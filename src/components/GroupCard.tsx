import { useState } from 'react';
import { Group, Session } from '../types';

interface GroupCardProps {
  group: Group;
  activeSession?: Session | null;
  gamesCount?: number;
  onOpenGroup: () => void;
  onStartSession: () => void;
}

export function GroupCard({
  group,
  activeSession,
  gamesCount = 0,
  onOpenGroup,
  onStartSession,
}: GroupCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyInvite = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(group.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onOpenGroup}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md transition-all hover:border-purple-500/50 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-purple-950/40 cursor-pointer"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-purple-600/10 blur-2xl group-hover:bg-purple-600/20 transition-all" />

      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-900 to-slate-950 border border-white/10 text-2xl group-hover:scale-105 transition-transform">
              👥
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                {group.name}
              </h3>
              <p className="text-xs text-slate-400">
                {group.members_count || 1} membros • {gamesCount} jogos no catálogo
              </p>
            </div>
          </div>

          {/* Active Session Badge */}
          {activeSession ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Votação Aberta!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-400 border border-white/5">
              Sem sessão ativa
            </span>
          )}
        </div>

        {/* Invite Code & Discord Webhook Status */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-950/60 p-2.5 border border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400">Convite:</span>
            <code className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs font-bold text-cyan-300">
              {group.invite_code}
            </code>
          </div>
          <button
            onClick={handleCopyInvite}
            className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            {copied ? '✓ Copiado!' : '📋 Copiar'}
          </button>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 flex items-center gap-2 pt-3 border-t border-white/5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenGroup();
          }}
          className="flex-1 rounded-xl border border-white/10 bg-slate-800/80 py-2 text-xs font-semibold text-slate-200 hover:border-purple-500/30 hover:bg-slate-700 transition-all"
        >
          Ver Catálogo
        </button>

        {activeSession ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenGroup();
            }}
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-95"
          >
            🗳️ Entrar na Votação
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartSession();
            }}
            className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition-all active:scale-95"
          >
            ⚡ Iniciar Votação
          </button>
        )}
      </div>
    </div>
  );
}
