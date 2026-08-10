import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DecisionCandidate } from '../lib/decision';

interface WinnerRevealProps {
  winner: DecisionCandidate | null;
  onClose: () => void;
  steamAppId?: number | null;
}

export function WinnerReveal({ winner, onClose, steamAppId }: WinnerRevealProps) {
  useEffect(() => {
    if (winner) {
      // Confetti burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
      });
    }
  }, [winner]);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-purple-500/30 bg-slate-900 p-6 text-center shadow-2xl">
        {/* Background glow */}
        <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-cyan-600/20 blur-3xl" />

        <div className="relative z-10 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-3xl shadow-xl shadow-amber-500/30 animate-bounce">
            🏆
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
              Jogo Decidido com Sucesso!
            </span>
            <h2 className="font-display text-2xl font-extrabold text-white mt-1">
              {winner.name}
            </h2>
          </div>

          {/* Game Cover Image */}
          {winner.image_url ? (
            <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 shadow-xl">
              <img
                src={winner.image_url}
                alt={winner.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            </div>
          ) : (
            <div className="flex h-32 w-full items-center justify-center rounded-xl bg-indigo-950/50 text-5xl">
              🎮
            </div>
          )}

          <p className="text-xs text-slate-300">
            Chega de discussão no Discord! Todo mundo abre o jogo agora e bora jogar! 🚀
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            {steamAppId ? (
              <a
                href={`steam://run/${steamAppId}`}
                className="flex-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-2.5 text-xs font-bold text-white shadow-lg hover:from-cyan-500 hover:to-blue-500 text-center"
              >
                🚀 Abrir na Steam
              </a>
            ) : null}

            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
            >
              Concluir & Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
