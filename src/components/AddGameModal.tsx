import { useState, useEffect } from 'react';
import { searchSteamGames, SteamGameResult } from '../lib/steam';
import { Game } from '../types';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (gameData: Partial<Game>) => void;
}

export function AddGameModal({ isOpen, onClose, onAddGame }: AddGameModalProps) {
  const [tab, setTab] = useState<'steam' | 'manual'>('steam');
  const [searchQuery, setSearchQuery] = useState('');
  const [steamResults, setSteamResults] = useState<SteamGameResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Manual inputs
  const [manualName, setManualName] = useState('');
  const [manualGenres, setManualGenres] = useState('');
  const [manualImageUrl, setManualImageUrl] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (tab === 'steam') {
      handleSearch(searchQuery);
    }
  }, [isOpen, tab]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const results = await searchSteamGames(query);
      setSteamResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSteamGame = (steamGame: SteamGameResult) => {
    onAddGame({
      steam_appid: steamGame.appid,
      name: steamGame.name,
      image_url: steamGame.image_url,
      genres: steamGame.genres,
      min_players: steamGame.min_players || 1,
      max_players: steamGame.max_players || 4,
      source: 'steam',
    });
    onClose();
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const genresList = manualGenres
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);

    onAddGame({
      name: manualName.trim(),
      genres: genresList.length > 0 ? genresList : ['Outro'],
      image_url: manualImageUrl.trim() || undefined,
      source: 'manual',
    });

    setManualName('');
    setManualGenres('');
    setManualImageUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <span>🎮</span> Adicionar Jogo ao Catálogo
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 flex rounded-xl bg-slate-950 p-1 border border-white/5">
          <button
            onClick={() => setTab('steam')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              tab === 'steam'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔍 Buscar na Steam Web API
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              tab === 'manual'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ✏️ Adicionar Manualmente
          </button>
        </div>

        {/* Steam Tab */}
        {tab === 'steam' && (
          <div className="mt-4 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite o nome do jogo na Steam (ex: Lethal Company, CS2)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                autoFocus
              />
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {loading ? (
                <div className="py-8 text-center text-xs text-cyan-400 animate-pulse">
                  Consultando catálogo da Steam...
                </div>
              ) : steamResults.length > 0 ? (
                steamResults.map((item) => (
                  <div
                    key={item.appid}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/60 p-2 hover:border-cyan-500/40 transition-all"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-12 w-24 rounded-lg object-cover bg-slate-900"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {item.genres.join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSelectSteamGame(item)}
                      className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-500 transition-all"
                    >
                      + Adicionar
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  Nenhum jogo encontrado com esse termo.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manual Tab */}
        {tab === 'manual' && (
          <form onSubmit={handleAddManual} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nome do Jogo *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Valorant, Minecraft, Roblox..."
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gêneros / Tags (separados por vírgula)
              </label>
              <input
                type="text"
                placeholder="Ex: FPS, Tático, Sobrevivência"
                value={manualGenres}
                onChange={(e) => setManualGenres(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL da Imagem de Capa (opcional)
              </label>
              <input
                type="url"
                placeholder="https://exemplo.com/capa.jpg"
                value={manualImageUrl}
                onChange={(e) => setManualImageUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-500"
              >
                Salvar Jogo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
