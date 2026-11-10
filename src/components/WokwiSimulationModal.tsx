import React, { useState } from 'react';
import { ArduinoData } from '../lib/useArduinoSerial';

interface Props {
  onClose: () => void;
  onInject: (data: Partial<ArduinoData>) => void;
}

export const WokwiSimulationModal: React.FC<Props> = ({ onClose, onInject }) => {
  const [largo, setLargo] = useState<number>(18.5);
  const [ancho, setAncho] = useState<number>(14.0);
  const [alto, setAlto] = useState<number>(12.0);
  const [peso, setPeso] = useState<number>(1.45);

  // Replicate Arduino classification logic exactly from sketch
  let categoria = 'EXCESO';
  let catCorta = 'EXC';
  let tarifa = 0;
  const medicionValida = largo > 0 && ancho > 0 && alto > 0;

  if (medicionValida) {
    if (peso <= 2.0 && largo <= 20.0 && ancho <= 20.0 && alto <= 20.0) {
      categoria = 'PEQUENO';
      catCorta = 'PEQ';
      tarifa = 1500;
    } else if (peso <= 5.0 && largo <= 50.0 && ancho <= 50.0 && alto <= 50.0) {
      categoria = 'MEDIANO';
      catCorta = 'MED';
      tarifa = 2800;
    } else if (peso <= 10.0 && largo <= 70.0 && ancho <= 70.0 && alto <= 70.0) {
      categoria = 'GRANDE';
      catCorta = 'GRA';
      tarifa = 4200;
    }
  }

  const handleApply = () => {
    onInject({
      largo: Number(largo.toFixed(1)),
      ancho: Number(ancho.toFixed(1)),
      alto: Number(alto.toFixed(1)),
      peso: Number(peso.toFixed(2)),
      categoria,
      tarifa,
    });
    onClose();
  };

  const setPreset = (l: number, w: number, h: number, p: number) => {
    setLargo(l);
    setAncho(w);
    setAlto(h);
    setPeso(p);
  };

  const jsonPreview = JSON.stringify(
    {
      largo: Number(largo.toFixed(1)),
      ancho: Number(ancho.toFixed(1)),
      alto: Number(alto.toFixed(1)),
      peso: Number(peso.toFixed(2)),
      categoria,
      tarifa,
    },
    null,
    2
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-3 sm:px-6 sm:py-3.5 border-b border-surface-container bg-surface-container-low/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">
              developer_board
            </span>
            <div className="flex flex-col">
              <span className="font-headline-sm text-sm font-bold text-on-surface">
                Simulador de Dispositivo Arduino (Wokwi)
              </span>
              <span className="font-code-telemetry text-xs text-outline">
                HC-SR04 (Ultrasonido) + HX711 (Báscula)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 text-sm overflow-y-auto flex-1 min-h-0 overscroll-contain">
          {/* Quick presets */}
          <div>
            <span className="text-xs font-semibold text-outline uppercase tracking-wider block mb-2">
              Presets de prueba del sketch:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPreset(18.0, 14.0, 12.0, 1.45)}
                className="p-2.5 rounded-lg border border-surface-container bg-surface-container-low hover:bg-surface-container text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-on-surface block">1. PEQUEÑO ($1500)</span>
                <span className="text-[11px] text-outline">18×14×12 cm • 1.45 kg</span>
              </button>
              <button
                type="button"
                onClick={() => setPreset(42.0, 35.5, 28.0, 4.2)}
                className="p-2.5 rounded-lg border border-surface-container bg-surface-container-low hover:bg-surface-container text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-on-surface block">2. MEDIANO ($2800)</span>
                <span className="text-[11px] text-outline">42×35.5×28 cm • 4.2 kg</span>
              </button>
              <button
                type="button"
                onClick={() => setPreset(65.0, 55.0, 45.0, 8.5)}
                className="p-2.5 rounded-lg border border-surface-container bg-surface-container-low hover:bg-surface-container text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-on-surface block">3. GRANDE ($4200)</span>
                <span className="text-[11px] text-outline">65×55×45 cm • 8.5 kg</span>
              </button>
              <button
                type="button"
                onClick={() => setPreset(75.0, 72.0, 68.0, 12.5)}
                className="p-2.5 rounded-lg border border-red-200 bg-red-50 text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-red-700 block">4. EXCESO (Rechazado)</span>
                <span className="text-[11px] text-red-500">75×72×68 cm • 12.5 kg</span>
              </button>
            </div>
          </div>

          {/* Sliders for precise tuning */}
          <div className="flex flex-col gap-3 bg-surface-container-low/50 p-4 rounded-xl border border-surface-container/60">
            {/* Peso */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-on-surface">Peso Celda HX711 (Pines A0 / A1)</span>
                <span className="font-bold font-mono text-secondary">{peso.toFixed(2)} kg</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.05"
                value={peso}
                onChange={(e) => setPeso(parseFloat(e.target.value))}
                className="w-full accent-secondary cursor-pointer"
              />
            </div>

            {/* Largo */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-on-surface">Largo HC-SR04 (Pines 7 / 6)</span>
                <span className="font-bold font-mono text-secondary">{largo.toFixed(1)} cm</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="0.5"
                value={largo}
                onChange={(e) => setLargo(parseFloat(e.target.value))}
                className="w-full accent-secondary cursor-pointer"
              />
            </div>

            {/* Ancho */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-on-surface">Ancho HC-SR04 (Pines 5 / 4)</span>
                <span className="font-bold font-mono text-secondary">{ancho.toFixed(1)} cm</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="0.5"
                value={ancho}
                onChange={(e) => setAncho(parseFloat(e.target.value))}
                className="w-full accent-secondary cursor-pointer"
              />
            </div>

            {/* Alto */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-on-surface">Alto HC-SR04 (Pines 3 / 2)</span>
                <span className="font-bold font-mono text-secondary">{alto.toFixed(1)} cm</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="0.5"
                value={alto}
                onChange={(e) => setAlto(parseFloat(e.target.value))}
                className="w-full accent-secondary cursor-pointer"
              />
            </div>
          </div>

          {/* JSON Transmitted Format */}
          <div>
            <span className="text-xs font-semibold text-outline uppercase tracking-wider block mb-1">
              Trama Serial JSON transmitida al navegador (9600 baud):
            </span>
            <pre className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-28 overflow-y-auto">
              {jsonPreview}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 p-3 sm:p-4 border-t border-surface-container bg-surface-container-lowest flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary/90 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">sensors</span>
            <span>Inyectar en Cards de Envíos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
