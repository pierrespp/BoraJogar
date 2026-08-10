import { UserProfile, Group } from '../types';

interface NavbarProps {
  currentUser: UserProfile;
  groups: Group[];
  activeGroup: Group | null;
  onSelectGroup: (group: Group | null) => void;
  onCreateGroupClick: () => void;
  onJoinGroupClick: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

export function Navbar({
  currentUser,
  groups,
  activeGroup,
  onSelectGroup,
  onCreateGroupClick,
  onJoinGroupClick,
  onSettingsClick,
  onLogout,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectGroup(null)}
            className="flex items-center gap-2 text-left group transition-transform active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 shadow-lg shadow-purple-500/25">
              <span className="text-xl">🎮</span>
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                Bora Jogar
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-semibold text-purple-400 tracking-wider">
                Decisões sem enrolação
              </span>
            </div>
          </button>

          {/* Group Switcher Dropdown */}
          {groups.length > 0 && (
            <div className="relative ml-4 hidden md:block">
              <select
                value={activeGroup?.id || ''}
                onChange={(e) => {
                  const selected = groups.find((g) => g.id === e.target.value);
                  onSelectGroup(selected || null);
                }}
                className="rounded-lg border border-white/10 bg-slate-900/90 py-1.5 pl-3 pr-8 text-xs font-medium text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
              >
                <option value="">📂 Todos os Grupos</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    👥 {g.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {activeGroup && onSettingsClick && (
            <button
              onClick={onSettingsClick}
              title="Configurações do Grupo"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-purple-500/50 hover:bg-slate-800 transition-all"
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">Configurações</span>
            </button>
          )}

          <button
            onClick={onJoinGroupClick}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all"
          >
            <span>🔑</span>
            <span className="hidden sm:inline">Entrar com Código</span>
          </button>

          <button
            onClick={onCreateGroupClick}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 transition-all active:scale-95"
          >
            <span>➕</span>
            <span className="hidden sm:inline">Novo Grupo</span>
          </button>

          {/* User Profile Avatar & Logout */}
          <div className="ml-2 flex items-center gap-2 pl-2 border-l border-white/10">
            <img
              src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.email)}`}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full border border-purple-400/50 object-cover bg-slate-800"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-cyan-400 font-medium leading-none">
                {currentUser.email && !currentUser.email.endsWith('@borajogar.app') ? currentUser.email : 'Online'}
              </span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Sair da conta"
                className="ml-1 rounded-lg border border-red-500/20 bg-red-950/30 px-2.5 py-1 text-xs font-semibold text-red-300 hover:bg-red-900/50 hover:border-red-500/40 transition-all"
              >
                Sair
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
