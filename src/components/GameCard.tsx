import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onRemove?: () => void;
  showRemove?: boolean;
}

export function GameCard({ game, onRemove, showRemove = false }: GameCardProps) {
  const isPlayedRecently = game.last_played_at
    ? (Date.now() - new Date(game.last_played_at).getTime()) / (1000 * 60 * 60 * 24) < 7
    : false;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md transition-all hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/30">
      {/* Game Image Header */}
      <div className="relative h-36 w-full overflow-hidden bg-slate-950">
        {game.image_url ? (
          <img
            src={game.image_url}
            alt={game.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 text-4xl">
            🎮
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

        {/* Source Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          {game.source === 'steam' ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 backdrop-blur-md border border-cyan-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Steam
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-semibold text-slate-300 backdrop-blur-md border border-white/10">
              ✏️ Manual
            </span>
          )}

          {isPlayedRecently && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-md border border-amber-500/40" title="Jogado nos últimos 7 dias (peso reduzido na roleta)">
              ⏳ Jogado recente
            </span>
          )}
        </div>

        {/* Optional Remove Button */}
        {showRemove && onRemove && (
          <button
            onClick={onRemove}
            title="Remover jogo do grupo"
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-red-950/80 text-red-300 opacity-0 transition-opacity hover:bg-red-900 group-hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>

      {/* Game Metadata Content */}
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div>
          <h3 className="font-display text-sm font-bold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
            {game.name}
          </h3>

          {/* Genres / Tags */}
          {game.genres && game.genres.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {game.genres.slice(0, 3).map((genre, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-300 border border-white/5"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Steam Store Link if Steam AppID exists */}
        {game.steam_appid && (
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">App ID: #{game.steam_appid}</span>
            <a
              href={`https://store.steampowered.com/app/${game.steam_appid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              Ver na Steam ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
