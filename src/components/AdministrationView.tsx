import React, { useState } from 'react';

export const AdministrationView: React.FC = () => {
  const [gatewayStatus, setGatewayStatus] = useState('Online');
  const [meshFrequency, setMeshFrequency] = useState('42 Pings/min');
  const [calibrating, setCalibrating] = useState(false);
  const [lastCalibration, setLastCalibration] = useState('Hoy, 06:00 AM (ENAC-ISO)');

  const handleRecalibrate = () => {
    setCalibrating(true);
    setTimeout(() => {
      setCalibrating(false);
      setLastCalibration('Ahora mismo (Certificado 0.01g)');
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[1400px] w-full mx-auto px-space-xl py-space-xl flex flex-col gap-space-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">
              Configuración y Telemetría • Infraestructura IoT
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Administración de Red y Sensores
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Gestión centralizada de Gateways Mesh, calibración de básculas ópticas y seguridad criptográfica.
            </p>
          </div>

          <div className="inline-flex items-center gap-space-sm bg-surface-container-low px-space-md py-1.5 rounded-xl border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-sm text-secondary font-semibold">
              Gateway v4.12.0 • 99.9% Uptime
            </span>
          </div>
        </div>

        {/* 3 Infrastructure Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-md text-on-surface-variant font-medium">
                  Gateway Mesh #A4-09
                </span>
                <span className="material-symbols-outlined text-secondary">hub</span>
              </div>
              <div className="font-metric-xl text-headline-md font-bold text-on-surface">
                {gatewayStatus}
              </div>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Conexión multicanal BLE 5.4 + LoRaWAN 868MHz activa en Hub Logístico Norte.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-surface-container flex items-center justify-between text-xs text-outline">
              <span>Frecuencia de telemetría:</span>
              <span className="font-code-telemetry text-on-surface font-semibold">
                {meshFrequency}
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-md text-on-surface-variant font-medium">
                  Básculas Dinámicas IoT
                </span>
                <span className="material-symbols-outlined text-secondary">scale</span>
              </div>
              <div className="font-metric-xl text-headline-md font-bold text-on-surface">
                Tolerancia 0.01g
              </div>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Última verificación patrón: {lastCalibration}.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-surface-container flex items-center justify-between">
              <button
                onClick={handleRecalibrate}
                disabled={calibrating}
                className="w-full py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-secondary flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {calibrating ? 'progress_activity' : 'tune'}
                </span>
                <span>{calibrating ? 'Autocalibrando celda...' : 'Recalibrar Célula de Carga'}</span>
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-md text-on-surface-variant font-medium">
                  Escáner Láser Volumétrico
                </span>
                <span className="material-symbols-outlined text-secondary">view_in_ar</span>
              </div>
              <div className="font-metric-xl text-headline-md font-bold text-on-surface">
                3 Ejes Activos (X, Y, Z)
              </div>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Precisión milimétrica (±1.5mm) mediante cortina ToF infrarroja y cámaras lineales.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-surface-container flex items-center justify-between text-xs text-outline">
              <span>Resolución óptica:</span>
              <span className="font-code-telemetry text-secondary font-semibold">1200 DPI LiDAR</span>
            </div>
          </div>
        </div>

        {/* Security & Cryptography Panel */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[24px]">lock</span>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Seguridad Criptográfica y Sellos Electrónicos
              </h2>
              <p className="font-body-sm text-on-surface-variant">
                Todos los trackers SmartPack v4 integran módulo HSM con firma digital ed25519 en cada ping.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-surface-container-low/60 rounded-lg">
              <span className="font-label-sm text-outline uppercase block">Algoritmo</span>
              <span className="font-code-telemetry text-sm font-bold text-on-surface">AES-256-GCM</span>
            </div>
            <div className="p-3 bg-surface-container-low/60 rounded-lg">
              <span className="font-label-sm text-outline uppercase block">Certificado Gateway</span>
              <span className="font-code-telemetry text-sm font-bold text-secondary">Válido (2028)</span>
            </div>
            <div className="p-3 bg-surface-container-low/60 rounded-lg">
              <span className="font-label-sm text-outline uppercase block">Detección de Manipulación</span>
              <span className="font-code-telemetry text-sm font-bold text-on-surface">Acelerómetro 6-DOF</span>
            </div>
            <div className="p-3 bg-surface-container-low/60 rounded-lg">
              <span className="font-label-sm text-outline uppercase block">Latencia Media Broker</span>
              <span className="font-code-telemetry text-sm font-bold text-secondary">18 ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
