import React from 'react';
import { ViewMode } from '../types';
import { SmartPackLogo } from './SmartPackLogo';

interface Props {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pingsPerMin?: number;
}

export const Sidebar: React.FC<Props> = ({
  currentView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  pingsPerMin = 42,
}) => {
  const navItems: { id: ViewMode; label: string; icon: string }[] = [
    { id: 'resumen', label: 'Resumen', icon: 'dashboard' },
    { id: 'envios', label: 'Envíos', icon: 'local_shipping' },
    { id: 'etiquetas', label: 'Etiquetas', icon: 'qr_code_2' },
    { id: 'administracion', label: 'Administración', icon: 'tune' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full ${
        collapsed ? 'w-20' : 'w-72'
      } bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between py-space-lg transition-all duration-300 border-r border-surface-container/50 select-none`}
    >
      <div className="flex flex-col gap-space-lg">
        {/* Header Logo area */}
        <div
          className={`${
            collapsed ? 'px-2 flex-col gap-2' : 'px-space-lg justify-between'
          } flex items-center`}
        >
          <div
            onClick={() => onSelectView('resumen')}
            className="flex items-center cursor-pointer overflow-hidden"
          >
            <SmartPackLogo variant={collapsed ? 'icon-only' : 'full'} size="md" />
          </div>
          <button
            aria-label={collapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
            onClick={onToggleCollapse}
            className="p-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors shrink-0 cursor-pointer"
            type="button"
            title={collapsed ? 'Expandir' : 'Colapsar'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {collapsed ? 'dock_to_right' : 'dock_to_left'}
            </span>
          </button>
        </div>

        {/* Section title */}
        {!collapsed && (
          <div className="px-space-lg">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Operaciones IoT
            </span>
          </div>
        )}

        {/* Nav list */}
        <nav className="flex flex-col gap-space-xs px-space-md">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center ${
                  collapsed ? 'justify-center px-2' : 'gap-space-md px-space-md'
                } py-space-sm rounded-lg transition-all text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
                title={collapsed ? item.label : undefined}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="font-label-md text-label-md whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer telemetry status */}
      <div className="px-space-md flex flex-col gap-space-md">
        <div
          onClick={() => onSelectView('administracion')}
          className={`bg-surface-container-low p-space-md rounded-xl flex items-center ${
            collapsed ? 'justify-center' : 'justify-between'
          } cursor-pointer hover:bg-surface-container transition-colors`}
          title="Gateway Mesh v4.12.0 • 99.9%"
        >
          <div className="flex items-center gap-space-sm overflow-hidden">
            <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
              hub
            </span>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                  Gateway Mesh
                </span>
                <span className="font-code-telemetry text-code-telemetry text-on-surface-variant truncate">
                  v4.12.0 • 99.9%
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <span className="w-2 h-2 rounded-full bg-secondary ring-4 ring-secondary-container/40 shrink-0"></span>
          )}
        </div>

        {!collapsed && (
          <div className="flex items-center justify-between px-space-sm">
            <span className="font-label-sm text-label-sm text-outline">
              SmartPack Telematics
            </span>
            <span className="font-code-telemetry text-code-telemetry text-outline">
              {pingsPerMin} Pings/m
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
