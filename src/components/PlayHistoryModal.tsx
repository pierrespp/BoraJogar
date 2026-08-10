import { useState } from 'react';
import { PlayHistory, Game } from '../types';

interface PlayHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PlayHistory[];
  games: Game[];
  onAddManualHistory: (gameId: string, notes?: string) => void;
}

export function PlayHistoryModal({
  isOpen,
  onClose,
  history,
  games,
  onAddManualHistory,
}: PlayHistoryModalProps) {
  const [selectedGameId, setSelectedGameId] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGameId) return;
    onAddManualHistory(selectedGameId, notes.trim() || undefined);
    setSelectedGameId('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <span>📜</span> Histórico de Jogos Jogados
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Form to log game */}
        <form onSubmit={handleAdd} className="mt-4 rounded-xl border border-white/5 bg-slate-950/60 p-3 space-y-2">
          <span className="text-xs font-bold text-purple-400"> Registrar Partida Realizada:</span>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              required
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="">Selecione o jogo jogado...</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Notas (ex: Vencemos no difícil)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-500 shrink-0"
            >
              Registrar
            </button>
          </div>
        </form>

        {/* History List */}
        <div className="mt-4 max-h-72 overflow-y-auto space-y-2 pr-1">
          {history.length > 0 ? (
            history.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/40 p-2.5"
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.game_name}
                    className="h-10 w-16 rounded-lg object-cover bg-slate-900"
                  />
                ) : (
                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-indigo-950 text-lg">
                    🎮
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {item.game_name}
                  </h4>
                  {item.notes && (
                    <p className="text-[11px] text-slate-400 italic truncate">
                      "{item.notes}"
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">
                    {new Date(item.played_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              Nenhuma partida registrada no histórico deste grupo ainda.
            </div>
          )}
        </div>

        <div className="mt-4 border-t border-white/10 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
