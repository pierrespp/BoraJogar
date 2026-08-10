import { useState } from 'react';
import { UserProfile } from '../types';

interface LoginModalProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export function LoginModal({ onLoginSuccess }: LoginModalProps) {
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim();

    if (!cleanName) {
      setError('Por favor, digite seu nome ou nick.');
      return;
    }

    if (cleanName.length < 2) {
      setError('O nome deve ter pelo menos 2 caracteres.');
      return;
    }

    const cleanSlug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const avatarSeed = encodeURIComponent(cleanName);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,c0aed9,d1d4f9,ffd5dc,ffdfbf`;

    const user: UserProfile = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: `${cleanSlug || 'player'}@borajogar.app`,
      name: cleanName,
      avatar_url: avatarUrl,
    };

    setIsLoggingIn(true);
    setTimeout(() => {
      onLoginSuccess(user);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/95 p-6 sm:p-8 shadow-2xl shadow-purple-950/50 text-center">
        {/* Decorative Background Glows */}
        <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Logo & Header */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 shadow-lg shadow-purple-500/30 text-3xl">
          🎮
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Bora Jogar
        </h1>
        <p className="text-sm text-slate-300 mb-6">
          Informe seu nome ou nickname para entrar e organizar as votações de jogos com a galera!
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/50 p-3 text-xs text-red-300 font-medium text-left">
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="text-left space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              Seu Nome ou Nick Gamer: <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              maxLength={30}
              placeholder="Ex: Pierre, Gabriel, ProGamer"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (error) setError(null);
              }}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoggingIn ? (
              <span>Entrando...</span>
            ) : (
              <>
                <span>Entrar no Bora Jogar</span>
                <span>🎮</span>
              </>
            )}
          </button>
        </form>

        {/* Features List */}
        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-400 space-y-2.5 text-left">
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-bold">✓</span>
            <span>Crie e entre em grupos de votação facilmente</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-bold">✓</span>
            <span>Adicione jogos da Steam ou personalizados</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-bold">✓</span>
            <span>Votações simples (+2, +1, 0, -1) e Roleta de sorteio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
