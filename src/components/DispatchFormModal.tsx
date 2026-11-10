import React, { useState } from 'react';
import { RecipientInfo } from '../types';

export interface DispatchFormData {
  recipient: RecipientInfo;
  originHub: string;
  destinationHub: string;
}

interface Props {
  currentWeight: number;
  currentLength: number;
  currentWidth: number;
  currentHeight: number;
  volumeM3: number;
  volumetricWeight: number;
  category: string;
  tarifa: number | null;
  onClose: () => void;
  onSubmit: (data: DispatchFormData) => void;
}

export const AVAILABLE_DESTINATIONS = [
  'Buenos Aires - Centro de Distribución Retiro (CABA)',
  'Córdoba - Centro Logístico Ferreyra',
  'Rosario - Terminal Multimodal Puerto (Santa Fe)',
  'Mendoza - Plataforma Logística Cuyo',
  'Mar del Plata - Delegación Atlántica (Buenos Aires)',
  'San Miguel de Tucumán - Nodo Logístico Noroeste',
  'Neuquén - Parque Industrial Patagonia',
  'Salta - Centro de Transferencia Norte',
  'Bariloche - Delegación Andina (Río Negro)',
  'Bahía Blanca - Hub Logístico Sur (Buenos Aires)',
  'Posadas - Plataforma Mesopotamia (Misiones)',
  'Resistencia - Centro de Carga Chaco',
];

const FIXED_ORIGIN_HUB = 'Hub Logístico Central Buenos Aires (Muelle 4 - CABA)';

export const DispatchFormModal: React.FC<Props> = ({
  currentWeight,
  currentLength,
  currentWidth,
  currentHeight,
  volumeM3,
  volumetricWeight,
  category,
  tarifa,
  onClose,
  onSubmit,
}) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [destinationHub, setDestinationHub] = useState(AVAILABLE_DESTINATIONS[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Regex validations
  const lettersOnlyRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
  const numbersRegex = /\d/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanNombre = nombre.trim();
    const cleanApellido = apellido.trim();
    const cleanDni = dni.trim();

    // 1. Validaciones para Nombre
    if (!cleanNombre) {
      setErrorMsg('Por favor ingresa el nombre del receptor.');
      return;
    }
    if (numbersRegex.test(cleanNombre)) {
      setErrorMsg('El nombre no puede contener números.');
      return;
    }
    if (!lettersOnlyRegex.test(cleanNombre)) {
      setErrorMsg('El nombre solo puede contener letras y espacios.');
      return;
    }
    if (cleanNombre.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '').length < 2) {
      setErrorMsg('El nombre debe tener un mínimo de 2 letras.');
      return;
    }

    // 2. Validaciones para Apellido
    if (!cleanApellido) {
      setErrorMsg('Por favor ingresa el apellido del receptor.');
      return;
    }
    if (numbersRegex.test(cleanApellido)) {
      setErrorMsg('El apellido no puede contener números.');
      return;
    }
    if (!lettersOnlyRegex.test(cleanApellido)) {
      setErrorMsg('El apellido solo puede contener letras y espacios.');
      return;
    }
    if (cleanApellido.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '').length < 2) {
      setErrorMsg('El apellido debe tener un mínimo de 2 letras.');
      return;
    }

    // 3. Validaciones para DNI: exactamente 7 u 8 números, ni más ni menos
    if (!cleanDni) {
      setErrorMsg('Por favor ingresa el DNI del receptor.');
      return;
    }
    if (!/^\d+$/.test(cleanDni)) {
      setErrorMsg('El DNI debe estar compuesto únicamente por números (sin letras, puntos ni guiones).');
      return;
    }
    if (cleanDni.length !== 7 && cleanDni.length !== 8) {
      setErrorMsg('El DNI debe estar compuesto exactamente de 7 u 8 números, ni más ni menos.');
      return;
    }

    setErrorMsg(null);
    onSubmit({
      recipient: {
        nombre: cleanNombre,
        apellido: cleanApellido,
        dni: cleanDni,
      },
      originHub: FIXED_ORIGIN_HUB,
      destinationHub,
    });
  };

  const calculatedFee = tarifa ? tarifa : Number((volumetricWeight * 3.8 + 8).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4 border-b border-surface-container bg-surface-container-low/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary-container/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[22px]">assignment_ind</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-sm sm:text-base font-bold text-on-surface">
                Datos del Receptor y Despacho
              </span>
              <span className="text-xs text-outline">
                Información obligatoria para emisión de la guía ZPL y Firebase
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <div className="p-4 sm:p-6 flex flex-col gap-4 text-sm">
            {/* Live Telemetry Summary Pill */}
            <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">scale</span>
                <span className="font-bold text-on-surface">{currentWeight.toFixed(2)} kg</span>
                <span className="text-outline">•</span>
                <span className="text-on-surface-variant font-mono">
                  {currentLength.toFixed(1)}×{currentWidth.toFixed(1)}×{currentHeight.toFixed(1)} cm
                </span>
                <span className="text-outline">•</span>
                <span className="text-outline">{volumeM3} m³</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-secondary font-bold text-[11px]">
                  {category}
                </span>
                <span className="font-bold text-on-surface text-xs">
                  {tarifa ? `$${tarifa}` : `€${calculatedFee}`}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px] text-red-600">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Recipient Details Section */}
            <div>
              <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">person</span>
                Receptor del Paquete (Destinatario)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nombre */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-on-surface" htmlFor="input-nombre">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-outline">Solo letras • Mín. 2</span>
                  </div>
                  <input
                    id="input-nombre"
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[0-9]/g, '');
                      setNombre(v);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="ej. Lucas"
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:border-secondary focus:ring-1 focus:ring-secondary text-on-surface text-sm transition-all outline-none placeholder:text-outline/50"
                  />
                </div>

                {/* Apellido */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-on-surface" htmlFor="input-apellido">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-outline">Solo letras • Mín. 2</span>
                  </div>
                  <input
                    id="input-apellido"
                    type="text"
                    required
                    value={apellido}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[0-9]/g, '');
                      setApellido(v);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="ej. Martínez"
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:border-secondary focus:ring-1 focus:ring-secondary text-on-surface text-sm transition-all outline-none placeholder:text-outline/50"
                  />
                </div>
              </div>

              {/* DNI */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-on-surface" htmlFor="input-dni">
                    DNI / Documento de Identidad (Argentina) <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-[11px] font-semibold ${
                    dni.length === 7 || dni.length === 8 ? 'text-secondary' : 'text-outline'
                  }`}>
                    {dni.length > 0 ? `${dni.length} de 7 u 8 dígitos` : '7 u 8 números'}
                  </span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                    badge
                  </span>
                  <input
                    id="input-dni"
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    required
                    value={dni}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 8);
                      setDni(v);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="ej. 38492011 (7 u 8 dígitos)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:border-secondary focus:ring-1 focus:ring-secondary text-on-surface text-sm font-mono tracking-wider transition-all outline-none placeholder:text-outline/50"
                  />
                </div>
                <span className="text-[11px] text-outline mt-1 block">
                  Debe contener exactamente 7 u 8 números (sin puntos, letras ni guiones).
                </span>
              </div>
            </div>

            {/* Hubs / Sucursales Section */}
            <div className="border-t border-surface-container pt-3">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">hub</span>
                Ruta y Sucursales de Logística
              </span>

              {/* Sucursal de Origen (BLOQUEADA / SOLO LECTURA) */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                    <span>Sucursal de Origen</span>
                    <span className="text-[10px] uppercase font-bold text-outline px-1.5 py-0.2 rounded bg-surface-container">
                      Bloqueada
                    </span>
                  </label>
                  <span className="text-[11px] text-outline flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px] text-amber-600">lock</span>
                    Estación Operativa Fija
                  </span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                    warehouse
                  </span>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={FIXED_ORIGIN_HUB}
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface-variant font-medium text-sm cursor-not-allowed select-none opacity-90"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline text-[18px]">
                    lock
                  </span>
                </div>
                <span className="text-[11px] text-outline/80 mt-1 block">
                  El paquete se encuentra en la báscula física de esta estación; el origen no puede ser modificado.
                </span>
              </div>

              {/* Sucursal de Destino (LISTA DESPLEGABLE) */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1" htmlFor="select-destino">
                  Sucursal de Destino <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[18px]">
                    flag
                  </span>
                  <select
                    id="select-destino"
                    value={destinationHub}
                    onChange={(e) => setDestinationHub(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:border-secondary focus:ring-1 focus:ring-secondary text-on-surface text-sm transition-all outline-none cursor-pointer appearance-none font-medium"
                  >
                    {AVAILABLE_DESTINATIONS.map((dest) => (
                      <option key={dest} value={dest}>
                        {dest}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
                <span className="text-[11px] text-outline mt-1 block">
                  Selecciona la delegación o centro logístico receptor donde se entregará el paquete.
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="shrink-0 p-3 sm:p-4 border-t border-surface-container bg-surface-container-lowest flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
              <span>Confirmar y Generar Etiqueta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
