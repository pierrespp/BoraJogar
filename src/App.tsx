import { useState, useEffect } from 'react';
import { Group, Game, Session, Vote, PlayHistory, VoteValue, GameVoteSummary, DecisionStrategy, UserProfile } from './types';
import { getDemoDB, saveDemoDB, getSavedUser, saveUserSession, supabase } from './lib/supabase';
import { decideWinner, calculateGameWeight, DecisionCandidate } from './lib/decision';
import { sendDiscordSessionNotification } from './lib/discord';
import { Navbar } from './components/Navbar';
import { GroupCard } from './components/GroupCard';
import { GameCard } from './components/GameCard';
import { VoteCard } from './components/VoteCard';
import { AddGameModal } from './components/AddGameModal';
import { CreateGroupModal } from './components/CreateGroupModal';
import { GroupSettingsModal } from './components/GroupSettingsModal';
import { JoinGroupModal } from './components/JoinGroupModal';
import { WheelSpinModal } from './components/WheelSpinModal';
import { WinnerReveal } from './components/WinnerReveal';
import { PlayHistoryModal } from './components/PlayHistoryModal';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [db, setDb] = useState(() => getDemoDB());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getSavedUser());
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Modals
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isJoinGroupOpen, setIsJoinGroupOpen] = useState(false);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Wheel & Winner states
  const [wheelCandidates, setWheelCandidates] = useState<DecisionCandidate[]>([]);
  const [wheelWinner, setWheelWinner] = useState<DecisionCandidate | null>(null);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [revealedWinner, setRevealedWinner] = useState<DecisionCandidate | null>(null);

  // Toast message
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    saveDemoDB(db);
  }, [db]);

  // Check Supabase Auth Session on mount
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const uProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário',
            avatar_url: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.user.email || 'user')}`,
          };
          setCurrentUser(uProfile);
          saveUserSession(uProfile);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const uProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário',
            avatar_url: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.user.email || 'user')}`,
          };
          setCurrentUser(uProfile);
          saveUserSession(uProfile);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    saveUserSession(user);
    showToast(`Bem-vindo, ${user.name}! 🎮`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveUserSession(null);
    if (supabase) {
      supabase.auth.signOut();
    }
    showToast('Você saiu da sua conta.');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Currently active group
  const activeGroup = selectedGroup || db.groups[0] || null;

  // Games for active group
  const activeGroupGameLinks = db.groupGames.filter((g) => g.group_id === activeGroup?.id);
  const activeGroupGames = db.games.filter((game) =>
    activeGroupGameLinks.some((link) => link.game_id === game.id)
  );

  // Active session for active group
  const activeSession = db.sessions.find(
    (s) => s.group_id === activeGroup?.id && s.status === 'open'
  ) || null;

  // Votes for active session
  const activeSessionVotes = db.votes.filter((v) => v.session_id === activeSession?.id);

  // Compute Game Summaries for active voting session
  const gameSummaries: GameVoteSummary[] = activeGroupGames.map((game) => {
    const gameVotes = activeSessionVotes.filter((v) => v.game_id === game.id);
    const total_score = gameVotes.reduce((sum, v) => sum + v.value, 0);
    const userVoteObj = currentUser ? gameVotes.find((v) => v.user_id === currentUser.id) : undefined;

    return {
      game,
      total_score,
      vote_count: gameVotes.filter((v) => v.value > 0).length,
      user_vote: userVoteObj ? userVoteObj.value : null,
      voters: gameVotes.map((v) => ({ user_name: v.user_name || 'Membro', value: v.value })),
      weight: calculateGameWeight(total_score, game.last_played_at),
      last_played: game.last_played_at,
    };
  });

  // Group Play History
  const activeGroupHistory = db.playHistory.filter((h) => h.group_id === activeGroup?.id);

  // Create Group
  const handleCreateGroup = (name: string, discordWebhook?: string, strategy?: DecisionStrategy) => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      invite_code: `BORA${Math.floor(1000 + Math.random() * 9000)}`,
      created_by: currentUser?.id || 'anon',
      created_at: new Date().toISOString(),
      discord_webhook_url: discordWebhook || null,
      decision_mode: strategy || 'weighted_random',
      members_count: 1,
    };

    setDb((prev) => ({
      ...prev,
      groups: [newGroup, ...prev.groups],
    }));
    setSelectedGroup(newGroup);
    showToast(`Grupo "${name}" criado com sucesso!`);
  };

  // Join Group via Code
  const handleJoinGroup = (inviteCode: string) => {
    const foundGroup = db.groups.find(
      (g) => g.invite_code.toUpperCase() === inviteCode.toUpperCase()
    );

    if (foundGroup) {
      setSelectedGroup(foundGroup);
      showToast(`Você entrou no grupo "${foundGroup.name}"!`);
    } else {
      showToast('❌ Código de convite não encontrado.');
    }
  };

  // Update Group Settings
  const handleUpdateGroup = (updated: Partial<Group>) => {
    if (!activeGroup) return;
    setDb((prev) => ({
      ...prev,
      groups: prev.groups.map((g) => (g.id === activeGroup.id ? { ...g, ...updated } : g)),
    }));
    setSelectedGroup((prev) => (prev ? { ...prev, ...updated } : null));
    showToast('Configurações do grupo atualizadas!');
  };

  // Add Game to Group
  const handleAddGame = (gameData: Partial<Game>) => {
    if (!activeGroup) return;

    let gameId = `game-${Date.now()}`;
    const existingGame = db.games.find(
      (g) => (gameData.steam_appid && g.steam_appid === gameData.steam_appid) || g.name === gameData.name
    );

    if (existingGame) {
      gameId = existingGame.id;
    } else {
      const newGame: Game = {
        id: gameId,
        steam_appid: gameData.steam_appid || null,
        name: gameData.name || 'Jogo sem nome',
        image_url: gameData.image_url || null,
        genres: gameData.genres || ['Manual'],
        min_players: gameData.min_players || 1,
        max_players: gameData.max_players || 4,
        source: gameData.source || 'manual',
        added_by: currentUser?.id || 'anon',
        created_at: new Date().toISOString(),
      };
      setDb((prev) => ({ ...prev, games: [newGame, ...prev.games] }));
    }

    // Link to group if not linked
    if (!db.groupGames.some((gg) => gg.group_id === activeGroup.id && gg.game_id === gameId)) {
      setDb((prev) => ({
        ...prev,
        groupGames: [...prev.groupGames, { group_id: activeGroup.id, game_id: gameId }],
      }));
    }

    showToast(`Jogo "${gameData.name}" adicionado ao catálogo!`);
  };

  // Remove Game from Group
  const handleRemoveGame = (gameId: string) => {
    if (!activeGroup) return;
    setDb((prev) => ({
      ...prev,
      groupGames: prev.groupGames.filter(
        (gg) => !(gg.group_id === activeGroup.id && gg.game_id === gameId)
      ),
    }));
    showToast('Jogo removido do catálogo do grupo.');
  };

  // Start Decision Session
  const handleStartSession = async (groupId?: string) => {
    const targetGroup = db.groups.find((g) => g.id === (groupId || activeGroup?.id)) || activeGroup;
    if (!targetGroup) return;

    // Close any previous open sessions for this group
    const closedSessions = db.sessions.map((s) =>
      s.group_id === targetGroup.id && s.status === 'open' ? { ...s, status: 'closed' as const } : s
    );

    const newSession: Session = {
      id: `session-${Date.now()}`,
      group_id: targetGroup.id,
      status: 'open',
      created_at: new Date().toISOString(),
      created_by: currentUser?.id || 'anon',
      duration_minutes: 15,
    };

    setDb((prev) => ({
      ...prev,
      sessions: [newSession, ...closedSessions],
    }));

    // Trigger Discord Webhook Notification
    if (targetGroup.discord_webhook_url) {
      const groupGameCount = db.groupGames.filter((gg) => gg.group_id === targetGroup.id).length;
      sendDiscordSessionNotification({
        webhookUrl: targetGroup.discord_webhook_url,
        groupName: targetGroup.name,
        sessionUrl: window.location.href,
        createdByName: currentUser?.name || 'Membro',
        gameCount: groupGameCount,
      });
    }

    setSelectedGroup(targetGroup);
    showToast(`⚡ Sessão de votação iniciada para "${targetGroup.name}"!`);
  };

  // Handle User Vote
  const handleVote = (gameId: string, value: VoteValue) => {
    if (!activeSession || !currentUser) return;

    setDb((prev) => {
      const existingVoteIndex = prev.votes.findIndex(
        (v) => v.session_id === activeSession.id && v.game_id === gameId && v.user_id === currentUser.id
      );

      let updatedVotes = [...prev.votes];

      if (existingVoteIndex >= 0) {
        // Update or toggle vote off if clicking same value
        if (updatedVotes[existingVoteIndex].value === value) {
          updatedVotes = updatedVotes.filter((_, idx) => idx !== existingVoteIndex);
        } else {
          updatedVotes[existingVoteIndex] = {
            ...updatedVotes[existingVoteIndex],
            value,
            created_at: new Date().toISOString(),
          };
        }
      } else {
        // New vote
        const newVote: Vote = {
          id: `vote-${Date.now()}-${Math.random()}`,
          session_id: activeSession.id,
          game_id,
          user_id: currentUser.id,
          value,
          created_at: new Date().toISOString(),
          user_name: currentUser.name,
        };
        updatedVotes.push(newVote);
      }

      return { ...prev, votes: updatedVotes };
    });
  };

  // Close Session & Decide Winner
  const handleDecideWinner = (strategy: DecisionStrategy) => {
    if (!activeSession || gameSummaries.length === 0) return;

    const winnerCandidate = decideWinner(gameSummaries, strategy);

    if (!winnerCandidate) {
      showToast('❌ Nenhum jogo teve pontuação suficiente.');
      return;
    }

    if (strategy === 'weighted_random') {
      // Build candidate list with calculated weights
      const candidates: DecisionCandidate[] = gameSummaries.map((s) => ({
        id: s.game.id,
        name: s.game.name,
        score: s.total_score,
        weight: calculateGameWeight(s.total_score, s.last_played),
        image_url: s.game.image_url,
        last_played_at: s.last_played,
      }));

      setWheelCandidates(candidates);
      setWheelWinner(winnerCandidate);
      setIsWheelOpen(true);
    } else {
      // Directly reveal winner for most_voted
      finalizeWinner(winnerCandidate);
    }
  };

  const finalizeWinner = (winnerCandidate: DecisionCandidate) => {
    if (!activeSession || !activeGroup) return;

    // Update Session status
    const nowIso = new Date().toISOString();
    setDb((prev) => {
      const updatedSessions = prev.sessions.map((s) =>
        s.id === activeSession.id
          ? { ...s, status: 'closed' as const, winner_game_id: winnerCandidate.id, closed_at: nowIso }
          : s
      );

      // Record in play history
      const newHistory: PlayHistory = {
        id: `history-${Date.now()}`,
        group_id: activeGroup.id,
        game_id: winnerCandidate.id,
        game_name: winnerCandidate.name,
        image_url: winnerCandidate.image_url || undefined,
        played_at: nowIso,
        notes: 'Vencedor da sessão de decisão',
      };

      // Update game last_played_at recency stamp
      const updatedGames = prev.games.map((g) =>
        g.id === winnerCandidate.id ? { ...g, last_played_at: nowIso } : g
      );

      return {
        ...prev,
        sessions: updatedSessions,
        games: updatedGames,
        playHistory: [newHistory, ...prev.playHistory],
      };
    });

    setRevealedWinner(winnerCandidate);
  };

  // Manual History Logging
  const handleAddManualHistory = (gameId: string, notes?: string) => {
    if (!activeGroup) return;
    const game = db.games.find((g) => g.id === gameId);
    if (!game) return;

    const nowIso = new Date().toISOString();
    const newHistory: PlayHistory = {
      id: `history-${Date.now()}`,
      group_id: activeGroup.id,
      game_id: gameId,
      game_name: game.name,
      image_url: game.image_url || undefined,
      played_at: nowIso,
      notes,
    };

    setDb((prev) => ({
      ...prev,
      playHistory: [newHistory, ...prev.playHistory],
      games: prev.games.map((g) => (g.id === gameId ? { ...g, last_played_at: nowIso } : g)),
    }));

    showToast(`Partida de "${game.name}" registrada no histórico!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Login Screen Gate if user is not authenticated */}
      {!currentUser && (
        <LoginModal onLoginSuccess={handleLoginSuccess} />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 rounded-xl border border-purple-500/40 bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl animate-fade-in border-l-4 border-l-purple-500">
          {toast}
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser || { id: 'guest', email: '', name: 'Visitante', avatar_url: '' }}
        groups={db.groups}
        activeGroup={activeGroup}
        onSelectGroup={(group) => setSelectedGroup(group)}
        onCreateGroupClick={() => setIsCreateGroupOpen(true)}
        onJoinGroupClick={() => setIsJoinGroupOpen(true)}
        onSettingsClick={activeGroup ? () => setIsSettingsOpen(true) : undefined}
        onLogout={handleLogout}
      />

      {/* Main Content View Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Active Group Hero Header */}
        {activeGroup ? (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-purple-500/20 px-2.5 py-1 text-[11px] font-bold text-purple-300 border border-purple-500/30">
                    👥 Grupo Ativo
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Código: <strong className="text-cyan-300">{activeGroup.invite_code}</strong>
                  </span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {activeGroup.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  {activeGroupGames.length} jogos cadastrados no catálogo • Decisão rápida de partidas para o fim de semana.
                </p>
              </div>

              {/* Group Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
                >
                  <span>📜</span>
                  <span>Histórico ({activeGroupHistory.length})</span>
                </button>

                <button
                  onClick={() => setIsAddGameOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 transition-all"
                >
                  <span>➕</span>
                  <span>Adicionar Jogo</span>
                </button>

                {!activeSession && (
                  <button
                    onClick={() => handleStartSession()}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-xl shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 transition-all active:scale-95"
                  >
                    <span>⚡</span>
                    <span>Iniciar Votação</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* ACTIVE DECISION SESSION ROOM */}
        {activeSession && (
          <section className="space-y-4 rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-6 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 text-2xl border border-emerald-500/40 animate-pulse">
                  🗳️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      SESSÃO DE VOTAÇÃO ATIVA
                    </span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-white">
                    Vote nos jogos que você quer jogar hoje!
                  </h2>
                </div>
              </div>

              {/* Decision Action Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecideWinner('weighted_random')}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-cyan-600/20 hover:opacity-95 transition-all active:scale-95"
                >
                  <span>🎰</span>
                  <span>Sortear na Roleta Ponderada</span>
                </button>

                <button
                  onClick={() => handleDecideWinner('most_voted')}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
                >
                  <span>🏆</span>
                  <span>Encerrar por Mais Votado</span>
                </button>
              </div>
            </div>

            {/* Voting Cards Grid */}
            <div className="space-y-3 pt-2">
              {activeGroupGames.length > 0 ? (
                activeGroupGames.map((game) => {
                  const summary = gameSummaries.find((s) => s.game.id === game.id);
                  return (
                    <VoteCard
                      key={game.id}
                      game={game}
                      currentVote={summary?.user_vote}
                      onVote={(val) => handleVote(game.id, val)}
                      voters={summary?.voters}
                      totalScore={summary?.total_score || 0}
                    />
                  );
                })
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  Nenhum jogo no catálogo do grupo. Adicione jogos para começar a votar!
                </div>
              )}
            </div>
          </section>
        )}

        {/* GROUP CATALOG GRID */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <span>📚</span> Catálogo de Jogos do Grupo ({activeGroupGames.length})
              </h2>
              <p className="text-xs text-slate-400">
                Jogos integrados via Steam Web API e adições manuais.
              </p>
            </div>

            <button
              onClick={() => setIsAddGameOpen(true)}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              + Adicionar Novo Jogo
            </button>
          </div>

          {activeGroupGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeGroupGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  showRemove={true}
                  onRemove={() => handleRemoveGame(game.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-12 text-center">
              <span className="text-4xl block mb-2">🎮</span>
              <h3 className="font-display text-base font-bold text-white">
                Nenhum jogo cadastrado ainda
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Busque jogos na Steam Web API ou adicione jogos customizados para montar a lista do seu grupo!
              </p>
              <button
                onClick={() => setIsAddGameOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 transition-all"
              >
                🔍 Buscar na Steam Agora
              </button>
            </div>
          )}
        </section>

        {/* ALL GROUPS OVERVIEW SECTION */}
        <section className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <span>👥</span> Seus Grupos de Jogatina ({db.groups.length})
              </h2>
              <p className="text-xs text-slate-400">
                Alterne entre seus grupos ou crie um novo para o seu squad.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsJoinGroupOpen(true)}
                className="rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50"
              >
                Entrar com Código
              </button>
              <button
                onClick={() => setIsCreateGroupOpen(true)}
                className="rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-500"
              >
                + Criar Grupo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {db.groups.map((group) => {
              const grpSession = db.sessions.find(
                (s) => s.group_id === group.id && s.status === 'open'
              );
              const grpGameCount = db.groupGames.filter((gg) => gg.group_id === group.id).length;

              return (
                <GroupCard
                  key={group.id}
                  group={group}
                  activeSession={grpSession}
                  gamesCount={grpGameCount}
                  onOpenGroup={() => setSelectedGroup(group)}
                  onStartSession={() => handleStartSession(group.id)}
                />
              );
            })}
          </div>
        </section>
      </main>

      {/* MODALS */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onCreateGroup={handleCreateGroup}
      />

      <JoinGroupModal
        isOpen={isJoinGroupOpen}
        onClose={() => setIsJoinGroupOpen(false)}
        onJoinGroup={handleJoinGroup}
      />

      <AddGameModal
        isOpen={isAddGameOpen}
        onClose={() => setIsAddGameOpen(false)}
        onAddGame={handleAddGame}
      />

      {activeGroup && (
        <GroupSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          group={activeGroup}
          onUpdateGroup={handleUpdateGroup}
        />
      )}

      {activeGroup && (
        <PlayHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={activeGroupHistory}
          games={activeGroupGames}
          onAddManualHistory={handleAddManualHistory}
        />
      )}

      {/* Wheel Spin Modal */}
      {isWheelOpen && wheelWinner && (
        <WheelSpinModal
          candidates={wheelCandidates}
          winner={wheelWinner}
          onFinish={() => {
            setIsWheelOpen(false);
            finalizeWinner(wheelWinner);
          }}
        />
      )}

      {/* Winner Trophy Reveal */}
      {revealedWinner && (
        <WinnerReveal
          winner={revealedWinner}
          steamAppId={activeGroupGames.find((g) => g.id === revealedWinner.id)?.steam_appid}
          onClose={() => setRevealedWinner(null)}
        />
      )}
    </div>
  );
}
