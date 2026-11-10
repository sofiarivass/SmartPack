import React, { useState } from 'react';
import { Shipment } from '../types';
import { SmartPackLogo } from './SmartPackLogo';

interface Props {
  shipments: Shipment[];
  initialCode?: string;
  onBackToDashboard?: () => void;
  onOpenSupport?: () => void;
  embedded?: boolean;
}

export const TrackingView: React.FC<Props> = ({
  shipments,
  initialCode = 'SP-849203-ES',
  onBackToDashboard,
  onOpenSupport,
  embedded = false,
}) => {
  const [query, setQuery] = useState(initialCode);
  const [currentCode, setCurrentCode] = useState(initialCode);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Find matching shipment or fallback to the primary one
  const matchedShipment =
    shipments.find(
      (s) => s.id.toLowerCase() === currentCode.trim().toLowerCase()
    ) || (currentCode === 'SP-849203-ES' ? shipments[0] : null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setNotFound(false);

    setTimeout(() => {
      setIsSearching(false);
      const codeUpper = query.trim().toUpperCase();
      const found = shipments.some(
        (s) => s.id.toUpperCase() === codeUpper
      );
      if (found) {
        setCurrentCode(codeUpper);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    }, 450);
  };

  const handleSelectExample = (code: string) => {
    setQuery(code);
    setCurrentCode(code);
    setNotFound(false);
  };

  return (
    <div className="w-full min-h-screen bg-surface flex flex-col items-center justify-start pb-16 font-body-md text-body-md text-on-surface antialiased">
      <div className={`w-full max-w-5xl mx-auto px-margin-mobile md:px-margin ${embedded ? 'py-4 md:py-8' : 'py-8 md:py-14'} flex flex-col items-center`}>
        {/* HEADER MINIMALISTA (Only when standalone) */}
        {!embedded ? (
          <header className="w-full flex items-center justify-between pb-8 md:pb-16 border-b border-surface-container">
            <div className="flex items-center gap-3">
              <SmartPackLogo className="h-9 md:h-11 w-auto object-contain cursor-pointer" />
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="font-label-md text-label-md text-on-surface-variant hover:text-secondary flex items-center gap-1.5 transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  <span className="hidden sm:inline">Panel Operativo</span>
                </button>
              )}
              <button
                onClick={onOpenSupport}
                className="font-label-md text-label-md text-on-surface-variant hover:text-secondary flex items-center gap-1.5 transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">contact_support</span>
                <span>Ayuda y Soporte</span>
              </button>
            </div>
          </header>
        ) : (
          <div className="w-full flex items-center justify-between pb-4 border-b border-surface-container/60">
            <div className="flex items-center gap-2 text-outline text-xs">
              <span className="font-label-sm uppercase tracking-wider">Operaciones IoT</span>
              <span>•</span>
              <span className="text-secondary font-semibold">Portal y Consulta de Guías / Etiquetas</span>
            </div>
            <button
              onClick={onOpenSupport}
              className="font-label-md text-label-md text-on-surface-variant hover:text-secondary flex items-center gap-1.5 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">contact_support</span>
              <span>Ayuda y Soporte</span>
            </button>
          </div>
        )}

        {/* ÁREA CENTRAL HERO DE BÚSQUEDA */}
        <section className={`w-full max-w-3xl ${embedded ? 'mt-6 md:mt-10' : 'mt-10 md:mt-16'} flex flex-col items-center text-center`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/30 text-secondary mb-4">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Red IoT Activa • 99.98% Precisión
            </span>
          </div>

          <h1 className="font-display-hero text-headline-lg md:text-display-hero text-on-surface tracking-tight font-bold">
            Rastrea tu Envío
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant mt-3 max-w-xl">
            Consulta la ubicación y estado en tiempo real de tu paquete con telemetría IoT de alta frecuencia.
          </p>

          {/* CAMPO DE ENTRADA CON BOTÓN DE BÚSQUEDA */}
          <form
            className="w-full mt-8 md:mt-10"
            id="trackingForm"
            onSubmit={handleSearch}
          >
            <div className="relative flex flex-col sm:flex-row items-center gap-2.5 p-2 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 focus-within:border-secondary focus-within:shadow-md transition-all">
              <div className="flex items-center w-full pl-3 pr-2">
                <span className="material-symbols-outlined text-outline text-[22px] select-none">
                  qr_code_scanner
                </span>
                <input
                  aria-label="Código de seguimiento"
                  className="w-full px-3 py-3 font-code-telemetry text-headline-sm text-on-surface bg-transparent focus:outline-none placeholder:text-outline/60 uppercase tracking-wide"
                  id="trackingInput"
                  placeholder="Ingresa tu Código de Seguimiento"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    className="text-outline hover:text-on-surface transition-colors p-1 cursor-pointer"
                    onClick={() => {
                      setQuery('');
                    }}
                    title="Borrar entrada"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>

              <button
                className="w-full sm:w-auto px-7 py-3.5 bg-secondary hover:bg-secondary/90 text-on-secondary font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 shrink-0 transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-80"
                disabled={isSearching}
                id="searchBtn"
                type="submit"
              >
                {isSearching ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">
                      sync
                    </span>
                    <span>Consultando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">search</span>
                    <span>Buscar</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 mt-3 text-left gap-2">
              <div className="font-label-sm text-label-sm text-outline flex items-center gap-1.5 flex-wrap">
                <span>Ejemplo:</span>
                <button
                  type="button"
                  onClick={() => handleSelectExample('SP-849203-ES')}
                  className="underline hover:text-secondary cursor-pointer"
                >
                  SP-849203-ES
                </button>
                <span>,</span>
                <button
                  type="button"
                  onClick={() => handleSelectExample('SP-98214')}
                  className="underline hover:text-secondary cursor-pointer"
                >
                  SP-98214
                </button>
                <span>,</span>
                <button
                  type="button"
                  onClick={() => handleSelectExample('SP-104921-EU')}
                  className="underline hover:text-secondary cursor-pointer"
                >
                  SP-104921-EU
                </button>
              </div>

              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">sensors</span>
                Canal cifrado punto a punto
              </span>
            </div>
          </form>

          {/* Not Found State */}
          {notFound && (
            <div className="w-full mt-6 p-4 rounded-xl bg-error-container/40 border border-error/30 text-error flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span>
                No se encontró ningún paquete con el identificador "{query}". Prueba con{' '}
                <strong
                  className="underline cursor-pointer"
                  onClick={() => handleSelectExample('SP-849203-ES')}
                >
                  SP-849203-ES
                </strong>
                .
              </span>
            </div>
          )}
        </section>

        {/* SEGUIDOR DE ESTADO SIMPLIFICADO */}
        {matchedShipment && (
          <section
            className="w-full max-w-4xl mt-12 md:mt-16 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 md:p-10 shadow-sm transition-all duration-300"
            id="trackingResult"
          >
            {/* ENCABEZADO Y RESUMEN LIMPIO DEL PAQUETE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-surface-container">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-headline-md text-headline-sm md:text-headline-md text-on-surface font-semibold">
                    {matchedShipment.id}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-secondary font-label-sm text-label-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    {matchedShipment.status}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  {matchedShipment.sensorId || 'Sensor SmartPack v4'} •{' '}
                  {matchedShipment.batch || 'Lote Biomédico de Precisión #902'}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto bg-surface-container-low px-3.5 py-2 rounded-lg">
                <span className="material-symbols-outlined text-secondary text-[20px]">update</span>
                <div className="text-right">
                  <div className="font-label-sm text-label-sm text-outline">Última actualización</div>
                  <div className="font-label-md text-label-md text-on-surface font-semibold">
                    {matchedShipment.lastUpdate}
                  </div>
                </div>
              </div>
            </div>

            {/* DATOS DE ORIGEN Y DESTINO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 p-4 rounded-lg bg-surface-container-low/60">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-on-surface text-[18px]">
                    flight_takeoff
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-outline uppercase block">
                    Origen
                  </span>
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    {matchedShipment.origin.hub}
                  </span>
                  {matchedShipment.origin.dispatchedTime && (
                    <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                      Despachado: {matchedShipment.origin.dispatchedTime}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container/40 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">flag</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-outline uppercase block">
                    Destino
                  </span>
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    {matchedShipment.destination.hub}
                  </span>
                  {matchedShipment.destination.estimatedDelivery && (
                    <span className="font-body-sm text-body-sm text-secondary font-medium block mt-0.5">
                      Entrega estimada: {matchedShipment.destination.estimatedDelivery}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* LÍNEA DE TIEMPO VISUAL PASO A PASO */}
            <div className="pt-4 pb-2">
              <div className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-8">
                Progreso de la Ruta
              </div>

              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
                {/* LÍNEA CONECTORA HORIZONTAL (DESKTOP) */}
                <div className="hidden md:block absolute left-8 right-8 top-5 h-0.5 bg-outline-variant/30 z-0">
                  <div
                    className={`h-full bg-secondary transition-all duration-700 ${
                      matchedShipment.status === 'Entregado'
                        ? 'w-full'
                        : matchedShipment.status === 'En Tránsito Activo' ||
                          matchedShipment.status === 'Etiquetado' ||
                          matchedShipment.status === 'Procesado'
                        ? 'w-1/2'
                        : 'w-1/4'
                    }`}
                  ></div>
                </div>

                {/* LÍNEA CONECTORA VERTICAL (MOBILE) */}
                <div className="md:hidden absolute left-5 top-4 bottom-8 w-0.5 bg-outline-variant/30 z-0">
                  <div
                    className={`w-full bg-secondary transition-all duration-700 ${
                      matchedShipment.status === 'Entregado' ? 'h-full' : 'h-1/2'
                    }`}
                  ></div>
                </div>

                {/* PASO 1: INGRESADO */}
                <div className="relative z-10 flex md:flex-col items-center md:text-center gap-4 md:gap-3 w-full md:w-1/3">
                  <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm shrink-0 ring-4 ring-surface-container-lowest">
                    <span className="material-symbols-outlined text-[20px] font-bold">check</span>
                  </div>
                  <div className="flex flex-col md:items-center">
                    <span className="font-headline-sm text-label-md md:text-headline-sm text-on-surface font-semibold">
                      {matchedShipment.routeProgress[0]?.title || '1. Ingresado'}
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary font-medium mt-0.5">
                      {matchedShipment.routeProgress[0]?.subtitle ||
                        'Completado • Centro Logístico Norte'}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline mt-0.5">
                      {matchedShipment.routeProgress[0]?.detail ||
                        '08:30 AM • Verificación biométrica OK'}
                    </span>
                  </div>
                </div>

                {/* PASO 2: EN TRÁNSITO */}
                <div className="relative z-10 flex md:flex-col items-center md:text-center gap-4 md:gap-3 w-full md:w-1/3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest border-2 border-secondary text-secondary flex items-center justify-center shadow-sm shrink-0 ring-4 ring-surface-container-lowest relative">
                    <span className="w-3.5 h-3.5 rounded-full bg-secondary animate-pulse"></span>
                  </div>
                  <div className="flex flex-col md:items-center">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="font-headline-sm text-label-md md:text-headline-sm text-on-surface font-semibold">
                        {matchedShipment.routeProgress[1]?.title || '2. En Tránsito'}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface font-medium mt-0.5">
                      {matchedShipment.routeProgress[1]?.subtitle ||
                        'En ruta hacia delegación destino'}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                      {matchedShipment.routeProgress[1]?.detail ||
                        'GPS: Corredor A-2 • Velocidad 88 km/h'}
                    </span>
                  </div>
                </div>

                {/* PASO 3: ENTREGADO */}
                <div className="relative z-10 flex md:flex-col items-center md:text-center gap-4 md:gap-3 w-full md:w-1/3">
                  <div
                    className={`w-10 h-10 rounded-full bg-surface-container-lowest border ${
                      matchedShipment.status === 'Entregado'
                        ? 'border-secondary text-secondary'
                        : 'border-outline-variant/60 text-outline'
                    } flex items-center justify-center shrink-0 ring-4 ring-surface-container-lowest`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {matchedShipment.status === 'Entregado' ? 'done_all' : 'schedule'}
                    </span>
                  </div>
                  <div className="flex flex-col md:items-center">
                    <span
                      className={`font-headline-sm text-label-md md:text-headline-sm ${
                        matchedShipment.status === 'Entregado'
                          ? 'text-on-surface font-semibold'
                          : 'text-outline font-medium'
                      }`}
                    >
                      {matchedShipment.routeProgress[2]?.title || '3. Entregado'}
                    </span>
                    <span
                      className={`font-body-sm text-body-sm ${
                        matchedShipment.status === 'Entregado'
                          ? 'text-secondary font-medium'
                          : 'text-outline'
                      } mt-0.5`}
                    >
                      {matchedShipment.routeProgress[2]?.subtitle ||
                        'Estimado: Mañana antes de las 18:00'}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline/70 mt-0.5">
                      {matchedShipment.routeProgress[2]?.detail ||
                        'Pendiente de firma de recepción'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MICRO-TELEMETRÍA EN TIEMPO REAL (TARJETAS MINIMALISTAS) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-10 mt-8 border-t border-surface-container">
              {/* Temp */}
              <div className="p-3.5 rounded-lg bg-surface-container-low flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  thermostat
                </span>
                <div>
                  <div className="font-label-sm text-label-sm text-outline">Temperatura Interna</div>
                  <div className="font-body-md text-body-md text-on-surface font-semibold">
                    {matchedShipment.telemetry.internalTemp} °C{' '}
                    <span className="font-label-sm text-label-sm text-secondary font-normal">
                      ({matchedShipment.telemetry.tempStatus})
                    </span>
                  </div>
                </div>
              </div>

              {/* Battery */}
              <div className="p-3.5 rounded-lg bg-surface-container-low flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  battery_charging_90
                </span>
                <div>
                  <div className="font-label-sm text-label-sm text-outline">
                    Autonomía Tracker IoT
                  </div>
                  <div className="font-body-md text-body-md text-on-surface font-semibold">
                    {matchedShipment.telemetry.trackerBatteryPercent}%{' '}
                    <span className="font-label-sm text-label-sm text-outline font-normal">
                      ({matchedShipment.telemetry.trackerRemainingDays} días restantes)
                    </span>
                  </div>
                </div>
              </div>

              {/* Electronic Seal */}
              <div className="p-3.5 rounded-lg bg-surface-container-low flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  format_image_left
                </span>
                <div>
                  <div className="font-label-sm text-label-sm text-outline">Sello Electrónico</div>
                  <div className="font-body-md text-body-md text-on-surface font-semibold">
                    {matchedShipment.telemetry.electronicSeal}{' '}
                    <span className="font-label-sm text-label-sm text-secondary font-normal">
                      ({matchedShipment.telemetry.sealStatus})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FOOTER ULTRA-CLEAN */}
        <footer className="w-full mt-16 text-center text-outline font-body-sm text-body-sm flex flex-col sm:flex-row items-center justify-center gap-6">
          <span>© 2025 SmartPack IoT Logistics Systems</span>
          <span className="hidden sm:inline">•</span>
          <a
            className="hover:text-on-surface transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              alert(
                'Privacidad de Telemetría SmartPack:\nTodos los datos cinemáticos, térmicos y de posición están cifrados con curva elíptica ed25519 punto a punto.'
              );
            }}
            href="#privacidad"
          >
            Privacidad de Telemetría
          </a>
          <span className="hidden sm:inline">•</span>
          <a
            className="hover:text-on-surface transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenSupport) onOpenSupport();
            }}
            href="#contacto"
          >
            Atención al Destinatario
          </a>
        </footer>
      </div>
    </div>
  );
};
