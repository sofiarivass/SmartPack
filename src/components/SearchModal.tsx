import React, { useState } from 'react';
import { Shipment } from '../types';

interface Props {
  shipments: Shipment[];
  onClose: () => void;
  onSelectShipment: (shipment: Shipment) => void;
}

export const SearchModal: React.FC<Props> = ({
  shipments,
  onClose,
  onSelectShipment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = shipments.filter(
    (s) =>
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.hub.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin.hub.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container max-w-xl w-full overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-surface-container bg-surface-container-low/30">
          <span className="material-symbols-outlined text-outline text-[22px]">search</span>
          <input
            autoFocus
            type="text"
            className="w-full bg-transparent font-body-md text-on-surface focus:outline-none placeholder:text-outline/70"
            placeholder="Buscar por código (ej. SP-849203-ES), destino, o estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-outline hover:text-on-surface p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 rounded-md bg-surface-container text-outline hover:text-on-surface"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-[360px] overflow-y-auto divide-y divide-surface-container/60">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-outline text-sm">
              No se encontraron resultados para "{searchTerm}"
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectShipment(item);
                  onClose();
                }}
                className="p-3 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-secondary-container/40 group-hover:text-secondary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">
                      inventory_2
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-code-telemetry text-sm font-bold text-on-surface">
                        {item.id}
                      </span>
                      <span className="text-[11px] font-medium text-secondary">
                        {item.status}
                      </span>
                    </div>
                    <span className="text-xs text-outline block">
                      {item.origin.hub} → {item.destination.hub}
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-code-telemetry font-bold text-on-surface block">
                    {item.weight} kg
                  </span>
                  <span className="text-outline text-[11px]">
                    {item.length}×{item.width}×{item.height} cm
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Suggestions Footer */}
        <div className="px-4 py-2.5 bg-surface-container-low/40 border-t border-surface-container text-[11px] text-outline flex items-center justify-between">
          <span>Sugerencia: Haz clic en cualquier envío para ver su telemetría y rastreo IoT</span>
          <span className="font-code-telemetry">{filtered.length} envíos</span>
        </div>
      </div>
    </div>
  );
};
