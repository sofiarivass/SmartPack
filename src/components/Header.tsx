import React, { useState } from 'react';
import { SmartPackLogo } from './SmartPackLogo';

interface Props {
  collapsed: boolean;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
}

export const Header: React.FC<Props> = ({
  collapsed,
  onOpenSearch,
  onOpenNotifications,
  unreadCount = 2,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const avatarUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDwFpVyvEc77JmIoCmGQIjea7gJlJluCpwAFo0N-Og8p7Xkcx5YPftIKDm7_tItMGQLbjEtaPlufiWC8q69HQX8u2jWgXd2pC4_wiJ0dtlR8ngQnpE4gyxKbDkrKErbIqDUODieN1WvBPI-MJMzUfBIMgzaI69ZcY7qA2dr-gx4xQNvQccjXSYvm4i9qFi4_OZv_c2QvVNglt5KFx-QWie9SnYlmVk2hsEJqD0qFg';

  return (
    <header
      className={`fixed top-0 ${
        collapsed ? 'left-20' : 'left-72'
      } right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-xl transition-all duration-300 border-b border-surface-container/40`}
    >
      {/* Left side: Brand + Live Sensors Status */}
      <div className="flex items-center gap-space-lg">
        <div className="flex items-center gap-space-sm">
          <SmartPackLogo className="h-8 w-auto object-contain" />
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight hidden sm:inline">
            SmartPack Manager
          </span>
        </div>

        <div className="inline-flex items-center gap-space-sm bg-surface-container-low px-space-md py-1 rounded-full shadow-[0_0_12px_rgba(13,148,136,0.18)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold tracking-wide whitespace-nowrap">
            Sensores IoT: En Línea
          </span>
        </div>
      </div>

      {/* Right side: Search, Notifications & Elena Morales User Profile */}
      <div className="flex items-center gap-space-lg">
        <div className="flex items-center gap-space-xs text-on-surface-variant">
          <button
            aria-label="Buscar envío o sensor"
            onClick={onOpenSearch}
            className="p-space-xs hover:bg-surface-container-low hover:text-on-surface rounded-lg transition-colors cursor-pointer"
            type="button"
            title="Buscar envío o sensor (Ctrl+K)"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
          <button
            aria-label="Alertas del sistema"
            onClick={onOpenNotifications}
            className="relative p-space-xs hover:bg-surface-container-low hover:text-on-surface rounded-lg transition-colors cursor-pointer"
            type="button"
            title="Alertas del sistema"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-secondary"></span>
            )}
          </button>
        </div>

        {/* Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-space-md pl-space-md hover:opacity-90 transition-opacity text-left cursor-pointer"
            type="button"
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                Elena Morales
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">
                Operador Principal
              </span>
            </div>
            <div className="relative flex items-center gap-space-xs">
              <img
                alt="Elena Morales"
                className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-surface-container"
                src={avatarUrl}
                onError={(e) => {
                  // Fallback to initials if image blocked
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="material-symbols-outlined text-outline text-[18px]">
                expand_more
              </span>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-surface-container">
                <p className="font-label-md font-semibold text-on-surface">Elena Morales</p>
                <p className="font-body-sm text-on-surface-variant">e.morales@smartpack.io</p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Puesto Operativo Hub Norte
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-outline">badge</span>
                  Perfil de Operador
                </button>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-outline">tune</span>
                  Calibración de Estación
                </button>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-outline">help</span>
                  Guía de Telemetría IoT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
