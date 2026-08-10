import { useEffect, useRef, useState } from 'react';
import { DecisionCandidate } from '../lib/decision';

interface WheelSpinModalProps {
  candidates: DecisionCandidate[];
  winner: DecisionCandidate;
  onFinish: () => void;
}

const COLORS = [
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#a855f7', // Purple
];

export function WheelSpinModal({ candidates, winner, onFinish }: WheelSpinModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  // Eligible candidates with positive weights
  const activeCandidates = candidates.filter((c) => c.weight > 0).length > 0
    ? candidates.filter((c) => c.weight > 0)
    : candidates;

  useEffect(() => {
    drawWheel(0);
  }, [candidates]);

  const drawWheel = (rotationAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas || activeCandidates.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 12;

    ctx.clearRect(0, 0, width, height);

    const totalWeight = activeCandidates.reduce((sum, c) => sum + Math.max(1, c.weight), 0);
    let startAngle = rotationAngle;

    activeCandidates.forEach((candidate, index) => {
      const weight = Math.max(1, candidate.weight);
      const sliceAngle = (weight / totalWeight) * 2 * Math.PI;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();

      ctx.fillStyle = COLORS[index % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Text label
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';

      let text = candidate.name;
      const maxTextWidth = radius - 35;
      if (ctx.measureText(text).width > maxTextWidth) {
        while (text.length > 3 && ctx.measureText(text + '...').width > maxTextWidth) {
          text = text.slice(0, -1);
        }
        text += '...';
      }

      ctx.fillText(text, radius - 20, 4);
      ctx.restore();

      startAngle += sliceAngle;
    });

    // Center hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#020617';
    ctx.fill();
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎮', centerX, centerY);
  };

  const handleStartSpin = () => {
    if (spinning || hasFinished) return;
    setSpinning(true);

    const winnerIndex = activeCandidates.findIndex((c) => c.id === winner.id);
    const validWinnerIndex = winnerIndex >= 0 ? winnerIndex : 0;
    const totalWeight = activeCandidates.reduce((sum, c) => sum + Math.max(1, c.weight), 0);

    let cumulativeAngle = 0;
    for (let i = 0; i < validWinnerIndex; i++) {
      cumulativeAngle += (Math.max(1, activeCandidates[i].weight) / totalWeight) * 2 * Math.PI;
    }
    const winnerSliceAngle = (Math.max(1, activeCandidates[validWinnerIndex].weight) / totalWeight) * 2 * Math.PI;
    const targetSliceCenter = cumulativeAngle + winnerSliceAngle / 2;

    // Pointer is at top (1.5 * PI)
    const targetAngle = 10 * Math.PI + (1.5 * Math.PI - targetSliceCenter);

    const duration = 4000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = targetAngle * easeOut;

      drawWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setHasFinished(true);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl text-center flex flex-col items-center">
        <h2 className="font-display text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          🎰 Roleta de Sorteio Ponderado
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Cada voto aumenta o tamanho da fatia na roleta!
        </p>

        {/* Pointer indicator */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="absolute -top-2.5 z-10 h-0 w-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            className="rounded-full border-4 border-slate-950 shadow-2xl shadow-purple-950/50"
          />
        </div>

        {hasFinished && (
          <div className="my-3 w-full rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 animate-bounce">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              🏆 Jogo Sorteado!
            </span>
            <h3 className="font-display text-lg font-bold text-white mt-0.5">
              {winner.name}
            </h3>
          </div>
        )}

        <div className="w-full mt-2">
          {!hasFinished ? (
            <button
              onClick={handleStartSpin}
              disabled={spinning}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 py-3 text-sm font-bold text-white shadow-xl shadow-cyan-600/25 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {spinning ? 'GIRANDO A ROLETA...' : '🎰 GIRAR ROLETA AGORA'}
            </button>
          ) : (
            <button
              onClick={onFinish}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-bold text-white shadow-xl hover:from-emerald-500 hover:to-teal-500 transition-all"
            >
              Ver Troféu & Iniciar Partida 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
