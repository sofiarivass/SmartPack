import React from 'react';

interface Props {
  onClose: () => void;
  onSelectShipmentId?: (id: string) => void;
}

export const NotificationsModal: React.FC<Props> = ({
  onClose,
  onSelectShipmentId,
}) => {
  const notifications = [
    {
      id: '1',
      title: 'Báscula IoT Hub Norte Calibrada',
      time: 'Hace 12 min',
      desc: 'Comprobación patrón ENAC completada con desviación 0.002g.',
      type: 'info',
      icon: 'scale',
    },
    {
      id: '2',
      title: 'Envío SP-849203-ES en Tránsito',
      time: 'Hace 45 min',
      desc: 'GPS actualizado en Corredor A-2. Temperatura interna estable a 4.2°C.',
      type: 'telemetry',
      icon: 'sensors',
      shipmentId: 'SP-849203-ES',
    },
    {
      id: '3',
      title: 'Gateway Mesh #A4-09 Actualizado',
      time: 'Hace 2 horas',
      desc: 'Firmware v4.12.0 sincronizado con 100% de los nodos de radio.',
      type: 'system',
      icon: 'hub',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container max-w-sm w-full overflow-hidden flex flex-col mr-6">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-container bg-surface-container-low/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              notifications_active
            </span>
            <span className="font-label-md font-bold text-on-surface">
              Alertas y Telemetría IoT
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="divide-y divide-surface-container max-h-[380px] overflow-y-auto">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.shipmentId && onSelectShipmentId) {
                  onSelectShipmentId(item.shipmentId);
                  onClose();
                }
              }}
              className={`p-4 hover:bg-surface-container-low transition-colors ${
                item.shipmentId ? 'cursor-pointer' : ''
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-label-md font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">
                    {item.icon}
                  </span>
                  {item.title}
                </span>
                <span className="text-outline text-[11px]">{item.time}</span>
              </div>
              <p className="text-xs text-on-surface-variant pl-5">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-surface-container bg-surface-container-lowest text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
          >
            Marcar todas como leídas
          </button>
        </div>
      </div>
    </div>
  );
};
