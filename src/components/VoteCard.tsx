import { Game, VoteValue } from '../types';

interface VoteCardProps {
  game: Game;
  currentVote?: VoteValue | null;
  onVote: (value: VoteValue) => void;
  voters?: { user_name: string; value: VoteValue }[];
  totalScore?: number;
}

export function VoteCard({
  game,
  currentVote = null,
  onVote,
  voters = [],
  totalScore = 0,
}: VoteCardProps) {
  const options: { value: VoteValue; label: string; icon: string; style: string }[] = [
    { value: 2, label: 'Quero Muito!', icon: '🔥', style: 'border-purple-500/50 bg-purple-950/60 text-purple-300 hover:bg-purple-900/80' },
    { value: 1, label: 'Quero', icon: '👍', style: 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/80' },
    { value: 0, label: 'Tanto Faz', icon: '🤷', style: 'border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800' },
    { value: -1, label: 'Não Quero', icon: '👎', style: 'border-red-500/50 bg-red-950/60 text-red-300 hover:bg-red-900/80' },
  ];

  const isPlayedRecently = game.last_played_at
    ? (Date.now() - new Date(game.last_played_at).getTime()) / (1000 * 60 * 60 * 24) < 7
    : false;

  return (
    <div className="flex flex-col md:flex-row items-stretch rounded-2xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-md gap-4 shadow-xl">
      {/* Game Header Image */}
      <div className="relative h-32 md:h-auto md:w-56 shrink-0 overflow-hidden rounded-xl bg-slate-950">
        {game.image_url ? (
          <img
            src={game.image_url}
            alt={game.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-indigo-950 text-3xl">
            🎮
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="font-display text-sm font-bold text-white line-clamp-1">
            {game.name}
          </span>
        </div>

        {isPlayedRecently && (
          <div className="absolute top-2 left-2 rounded bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-slate-950">
            ⏳ Jogado esta semana
          </div>
        )}
      </div>

      {/* Voting Controls & Live Tally */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display text-base font-bold text-white md:hidden">
                {game.name}
              </h3>
              {game.genres && (
                <p className="text-xs text-slate-400">
                  {game.genres.slice(0, 3).join(' • ')}
                </p>
              )}
            </div>

            {/* Score Pill */}
            <div className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 px-3 py-1">
              <span className="text-xs text-slate-400 font-medium">Pontuação:</span>
              <span className={`font-mono text-sm font-extrabold ${totalScore > 0 ? 'text-emerald-400' : totalScore < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                {totalScore > 0 ? `+${totalScore}` : totalScore}
              </span>
            </div>
          </div>

          {/* Granular Vote Option Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            {options.map((opt) => {
              const isSelected = currentVote === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onVote(opt.value)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all active:scale-95 ${
                    isSelected
                      ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-950 shadow-lg ' + opt.style
                      : 'border-white/5 bg-slate-950/50 text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <span className="text-sm">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Voters List */}
        {voters.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Votos:</span>
            {voters.map((v, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium border ${
                  v.value === 2
                    ? 'border-purple-500/30 bg-purple-950/50 text-purple-300'
                    : v.value === 1
                    ? 'border-emerald-500/30 bg-emerald-950/50 text-emerald-300'
                    : v.value === -1
                    ? 'border-red-500/30 bg-red-950/50 text-red-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                {v.user_name}: {v.value === 2 ? '🔥 +2' : v.value === 1 ? '👍 +1' : v.value === -1 ? '👎 -1' : '🤷 0'}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
