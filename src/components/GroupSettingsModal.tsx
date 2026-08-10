import { useState } from 'react';
import { Group, DecisionStrategy } from '../types';
import { sendDiscordSessionNotification } from '../lib/discord';

interface GroupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  onUpdateGroup: (updated: Partial<Group>) => void;
}

export function GroupSettingsModal({
  isOpen,
  onClose,
  group,
  onUpdateGroup,
}: GroupSettingsModalProps) {
  const [name, setName] = useState(group.name);
  const [discordWebhook, setDiscordWebhook] = useState(group.discord_webhook_url || '');
  const [decisionMode, setDecisionMode] = useState<DecisionStrategy>(
    group.decision_mode || 'weighted_random'
  );
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookTestMessage, setWebhookTestMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestWebhook = async () => {
    if (!discordWebhook.trim()) {
      setWebhookTestMessage('⚠️ Digite uma URL de Webhook válida primeiro.');
      return;
    }

    setTestingWebhook(true);
    setWebhookTestMessage(null);

    const success = await sendDiscordSessionNotification({
      webhookUrl: discordWebhook.trim(),
      groupName: group.name,
      sessionUrl: window.location.href,
      createdByName: 'Teste BoraJogar',
      gameCount: 3,
    });

    setTestingWebhook(false);
    if (success) {
      setWebhookTestMessage('✅ Mensagem de teste enviada com sucesso no Discord!');
    } else {
      setWebhookTestMessage('❌ Falha ao enviar para o Discord. Verifique a URL do Webhook.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGroup({
      name: name.trim() || group.name,
      discord_webhook_url: discordWebhook.trim() || null,
      decision_mode: decisionMode,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <span>⚙️</span> Configurações do Grupo
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nome do Grupo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Código de Convite
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 font-mono text-xs font-bold text-cyan-300">
                {group.invite_code}
              </code>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(group.invite_code)}
                className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Copiar
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Modo Padrão de Sorteio
            </label>
            <select
              value={decisionMode}
              onChange={(e) => setDecisionMode(e.target.value as DecisionStrategy)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none cursor-pointer"
            >
              <option value="weighted_random">🎰 Sorteio Ponderado (Roleta por Votos)</option>
              <option value="most_voted">🏆 Mais Votado (Ranking Simples)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Discord Webhook
              </label>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={testingWebhook}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
              >
                {testingWebhook ? 'Testando...' : '🧪 Enviar Teste'}
              </button>
            </div>
            <input
              type="url"
              placeholder="https://discord.com/api/webhooks/..."
              value={discordWebhook}
              onChange={(e) => setDiscordWebhook(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
            {webhookTestMessage && (
              <p className="mt-1 text-[11px] font-medium text-slate-300">
                {webhookTestMessage}
              </p>
            )}
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
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
