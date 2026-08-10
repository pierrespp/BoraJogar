import { useState } from 'react';
import { DecisionStrategy } from '../types';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, discordWebhook?: string, strategy?: DecisionStrategy) => void;
}

export function CreateGroupModal({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [strategy, setStrategy] = useState<DecisionStrategy>('weighted_random');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateGroup(name.trim(), discordWebhook.trim() || undefined, strategy);
    setName('');
    setDiscordWebhook('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <span>👥</span> Criar Novo Grupo de Jogatina
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nome do Grupo *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Corujao do Sabado, Squad do Valorant..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Modo Padrão de Decisão
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as DecisionStrategy)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none cursor-pointer"
            >
              <option value="weighted_random">🎰 Sorteio Ponderado (Roleta por Votos)</option>
              <option value="most_voted">🏆 Mais Votado (Ranking Simples)</option>
            </select>
            <p className="mt-1 text-[10px] text-slate-400">
              O sorteio ponderado dá mais chance aos mais votados sem ignorar opiniões minoritárias!
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Webhook do Discord (Notificações)
            </label>
            <input
              type="url"
              placeholder="https://discord.com/api/webhooks/..."
              value={discordWebhook}
              onChange={(e) => setDiscordWebhook(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              O bot enviará um aviso automático no Discord sempre que uma sessão de votação abrir.
            </p>
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
              className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500"
            >
              Criar Grupo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
