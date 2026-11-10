import React from 'react';

interface Props {
  onClose: () => void;
}

export const SupportModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container max-w-lg w-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container bg-surface-container-low/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">
              support_agent
            </span>
            <span className="font-headline-sm text-base font-bold text-on-surface">
              Centro de Asistencia IoT y Rastreo
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 text-sm text-on-surface">
          <div>
            <h3 className="font-semibold text-on-surface flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                thermostat
              </span>
              ¿Cómo funciona la telemetría en tiempo real?
            </h3>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Cada paquete SmartPack v4 transmite temperatura interna, vibración, orientación y nivel de batería cada 60 segundos a través de la red mesh terrestre y satelital.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-on-surface flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                lock
              </span>
              ¿Qué significa el Sello Electrónico Intacto?
            </h3>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              El sensor óptico de cierre confirma que la apertura del contenedor no ha sido vulnerada desde la expedición en el hub de origen.
            </p>
          </div>

          <div className="bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between mt-2">
            <div>
              <span className="text-xs text-outline block">Canal Directo de Operaciones</span>
              <span className="font-semibold text-secondary text-sm">soporte@smartpack-iot.com</span>
            </div>
            <a
              href="mailto:soporte@smartpack-iot.com"
              className="px-3 py-1.5 bg-secondary text-white rounded-lg text-xs font-semibold hover:bg-secondary/90 transition-colors"
            >
              Contactar
            </a>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-surface-container bg-surface-container-lowest text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold text-on-surface transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
