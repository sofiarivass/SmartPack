import React, { useState } from 'react';
import { Shipment } from '../types';

interface Props {
  shipments: Shipment[];
  onSelectShipment: (shipment: Shipment) => void;
  onOpenLabelModal: (shipment: Shipment) => void;
}

export const WorkstationView: React.FC<Props> = ({
  shipments,
  onSelectShipment,
  onOpenLabelModal,
}) => {
  // Current active package on the workstation scale
  const [currentWeight, setCurrentWeight] = useState(14.85);
  const [currentLength, setCurrentLength] = useState(42.0);
  const [currentWidth, setCurrentWidth] = useState(35.5);
  const [currentHeight, setCurrentHeight] = useState(28.0);
  const [isStable, setIsStable] = useState(true);
  const [latency, setLatency] = useState(18);
  const [actionState, setActionState] = useState<'idle' | 'transmitting' | 'success'>('idle');

  // Calculate volume & IATA volumetric weight
  // Factor IATA standard 1:5000 -> (L * W * H) / 5000 in cm
  const volumeM3 = Number(
    ((currentLength * currentWidth * currentHeight) / 1000000).toFixed(3)
  );
  const volumetricWeight = Number(
    ((currentLength * currentWidth * currentHeight) / 5000).toFixed(2)
  );

  const handleActionClick = () => {
    setActionState('transmitting');
    setTimeout(() => {
      setActionState('success');
      setTimeout(() => {
        setActionState('idle');
        // Open the label modal with the current package data
        const currentPackage: Shipment = {
          id: `SP-${Math.floor(98215 + Math.random() * 50)}`,
          weight: currentWeight,
          length: currentLength,
          width: currentWidth,
          height: currentHeight,
          volumeM3,
          volumetricWeight,
          status: 'Etiquetado',
          sensorId: 'Sensor SmartPack v4',
          batch: 'Lote Operativo Hub Norte',
          lastUpdate: 'Ahora',
          origin: {
            hub: 'Hub Logístico Norte (Muelle 4)',
            dispatchedTime: '11:45 AM',
          },
          destination: {
            hub: 'Barcelona Express (Zona Franca)',
            estimatedDelivery: 'Mañana, < 18:00',
          },
          routeProgress: [
            {
              number: 1,
              title: '1. Ingresado',
              subtitle: 'Hub Logístico Norte',
              detail: 'Báscula y escáner óptico validados',
              completed: true,
              active: false,
            },
            {
              number: 2,
              title: '2. En Tránsito',
              subtitle: 'Generación de guía ZPL',
              detail: 'Etiqueta adherida y confirmada',
              completed: false,
              active: true,
            },
            {
              number: 3,
              title: '3. Entregado',
              subtitle: 'Estimado: Mañana antes de las 18:00',
              detail: 'Pendiente de entrega',
              completed: false,
              active: false,
            },
          ],
          telemetry: {
            internalTemp: 4.8,
            tempStatus: 'Óptima',
            trackerBatteryPercent: 99,
            trackerRemainingDays: 24,
            electronicSeal: 'Intacto',
            sealStatus: 'Verificado',
          },
          shippingFee: Number((volumetricWeight * 3.8 + 8).toFixed(2)),
        };
        onOpenLabelModal(currentPackage);
      }, 1000);
    }, 1200);
  };

  const handleSimulateNewPackage = () => {
    setIsStable(false);
    const presets = [
      { w: 14.85, l: 42.0, wi: 35.5, h: 28.0 },
      { w: 3.2, l: 20.0, wi: 15.0, h: 12.0 },
      { w: 8.75, l: 34.0, wi: 28.0, h: 22.5 },
      { w: 22.1, l: 58.0, wi: 44.0, h: 36.0 },
      { w: 1.1, l: 15.0, wi: 10.0, h: 8.0 },
    ];
    const pick = presets[Math.floor(Math.random() * presets.length)];
    setTimeout(() => {
      setCurrentWeight(pick.w);
      setCurrentLength(pick.l);
      setCurrentWidth(pick.wi);
      setCurrentHeight(pick.h);
      setIsStable(true);
      setLatency(Math.floor(15 + Math.random() * 8));
    }, 400);
  };

  const handleTare = () => {
    setIsStable(false);
    setTimeout(() => {
      setCurrentWeight(0.0);
      setIsStable(true);
    }, 300);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[1400px] w-full mx-auto px-space-xl py-space-xl flex flex-col gap-space-xl">
        {/* Top Operational Station Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">
              Puesto Operativo • Hub Logístico Norte
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Medición y Telemetría IoT en Tiempo Real
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-space-sm">
              <span>Báscula y escáner óptico volumétrico conectados</span>
            </p>
          </div>

          {/* Sync Badge */}
          <div className="flex items-center gap-space-md bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm border border-outline-variant/30 self-start md:self-auto">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
            </span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                Sincronizado vía BLE / MQTT
              </span>
              <span className="font-code-telemetry text-code-telemetry text-outline">
                Latencia: {latency}ms • Gateway #A4-09
              </span>
            </div>
          </div>
        </div>

        {/* 4 Telemetry Metrics Cards */}
        <section
          aria-label="Métricas IoT en vivo"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg"
        >
          {/* Card 1: Peso (kg) */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 hover:shadow-md transition-all flex flex-col justify-between h-48 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Peso (kg)
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[18px]">scale</span>
              </div>
            </div>

            <div className="flex items-baseline gap-space-xs">
              <span
                className="font-metric-xl text-metric-xl text-on-surface font-bold tracking-tight"
                id="metric-weight"
              >
                {currentWeight.toFixed(2)}
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">
                kg
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-semibold">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isStable ? 'bg-secondary' : 'bg-amber-500 animate-pulse'
                  }`}
                ></span>
                {isStable ? 'Estable' : 'Pesando...'}
              </span>

              <button
                onClick={handleTare}
                className="text-xs font-medium text-outline hover:text-on-surface transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-surface-container-low"
                title="Poner a cero / Tara"
                type="button"
              >
                Tara
              </button>
            </div>
          </div>

          {/* Card 2: Largo (cm) */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 hover:shadow-md transition-all flex flex-col justify-between h-48 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Largo (cm)
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[18px]">straighten</span>
              </div>
            </div>

            <div className="flex items-baseline gap-space-xs">
              <span
                className="font-metric-xl text-metric-xl text-on-surface font-bold tracking-tight"
                id="metric-length"
              >
                {currentLength.toFixed(1)}
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">
                cm
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Eje X
              </span>
              <span className="font-code-telemetry text-[11px] text-outline">
                Láser óptico
              </span>
            </div>
          </div>

          {/* Card 3: Ancho (cm) */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 hover:shadow-md transition-all flex flex-col justify-between h-48 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Ancho (cm)
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[18px]">aspect_ratio</span>
              </div>
            </div>

            <div className="flex items-baseline gap-space-xs">
              <span
                className="font-metric-xl text-metric-xl text-on-surface font-bold tracking-tight"
                id="metric-width"
              >
                {currentWidth.toFixed(1)}
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">
                cm
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Eje Y
              </span>
              <span className="font-code-telemetry text-[11px] text-outline">
                Cortina IR
              </span>
            </div>
          </div>

          {/* Card 4: Alto (cm) */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 hover:shadow-md transition-all flex flex-col justify-between h-48 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Alto (cm)
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[18px]">height</span>
              </div>
            </div>

            <div className="flex items-baseline gap-space-xs">
              <span
                className="font-metric-xl text-metric-xl text-on-surface font-bold tracking-tight"
                id="metric-height"
              >
                {currentHeight.toFixed(1)}
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">
                cm
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Eje Z
              </span>
              <span className="font-code-telemetry text-[11px] text-outline">
                Sensor ToF
              </span>
            </div>
          </div>
        </section>

        {/* Central Dispatch & Calculation Action */}
        <section
          aria-label="Acción de despacho y cálculo"
          className="flex flex-col items-center justify-center py-space-md"
        >
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30 flex flex-col items-center text-center gap-space-lg">
            <div className="flex flex-col items-center gap-space-xs">
              <div className="inline-flex items-center gap-space-sm bg-surface-container-low px-space-md py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm mb-space-xs">
                <span className="material-symbols-outlined text-secondary text-[16px]">sensors</span>
                Lectura Confirmada del Paquete Actual
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Listo para emisión de guía de despacho
              </p>
            </div>

            {/* Action Button */}
            <button
              id="btn-action"
              onClick={handleActionClick}
              disabled={actionState !== 'idle'}
              className="w-full sm:w-auto min-w-[340px] px-space-xl py-space-md rounded-xl bg-secondary text-on-secondary font-headline-sm text-headline-sm font-bold shadow-lg hover:bg-on-secondary-fixed-variant active:scale-[0.99] transition-all flex items-center justify-center gap-space-md group cursor-pointer disabled:opacity-90"
              type="button"
            >
              {actionState === 'idle' && (
                <>
                  <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform">
                    barcode_scanner
                  </span>
                  <span>Calcular Tarifa y Generar Etiqueta</span>
                </>
              )}
              {actionState === 'transmitting' && (
                <>
                  <span className="material-symbols-outlined animate-spin text-[24px]">
                    progress_activity
                  </span>
                  <span>Transmitiendo a Impresora ZPL...</span>
                </>
              )}
              {actionState === 'success' && (
                <>
                  <span className="material-symbols-outlined text-[24px]">
                    check_circle
                  </span>
                  <span>¡Etiqueta Generada con Éxito!</span>
                </>
              )}
            </button>

            {/* Volumetric Calculation Footer */}
            <div className="flex flex-wrap items-center justify-center gap-x-space-lg gap-y-space-xs text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low px-space-lg py-space-sm rounded-lg w-full">
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-on-surface">Volumen neto:</span> {volumeM3} m³
              </span>
              <span className="text-outline-variant">•</span>
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-on-surface">Peso volumétrico:</span> {volumetricWeight} kg
              </span>
              <span className="text-outline-variant">•</span>
              <span className="flex items-center gap-1.5 text-secondary font-medium">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Factor IATA 1:5000
              </span>
            </div>

            {/* Simulation controls */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSimulateNewPackage}
                className="text-xs text-outline hover:text-secondary flex items-center gap-1 px-3 py-1 rounded bg-surface-container-low/70 transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                Simular Siguiente Paquete en Cinta
              </button>
            </div>
          </div>
        </section>

        {/* Recent Shipments Table */}
        <section
          aria-label="Historial de envíos procesados"
          className="flex flex-col gap-space-md"
        >
          <div className="flex items-center justify-between px-space-xs">
            <div className="flex items-center gap-space-sm">
              <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                Envíos Recientes
              </h2>
            </div>
            <button
              onClick={() => {
                // If clicked, user can view the full list or tracking
                onSelectShipment(shipments[0]);
              }}
              className="font-label-md text-label-md text-secondary hover:text-on-secondary-fixed-variant transition-colors flex items-center gap-1 cursor-pointer"
              type="button"
            >
              <span>Ver historial completo</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider border-b border-surface-container">
                    <th className="py-space-md px-space-lg font-semibold" scope="col">
                      Identificador
                    </th>
                    <th className="py-space-md px-space-lg font-semibold" scope="col">
                      Peso Registrado
                    </th>
                    <th className="py-space-md px-space-lg font-semibold" scope="col">
                      Dimensiones (L x An x Al)
                    </th>
                    <th className="py-space-md px-space-lg font-semibold text-right" scope="col">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-0 text-on-surface">
                  {shipments.slice(1, 5).map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => onSelectShipment(item)}
                      className="hover:bg-surface-container-low/60 transition-colors cursor-pointer group"
                      title={`Ver telemetría y rastreo de ${item.id}`}
                    >
                      <td className="py-space-lg px-space-lg">
                        <div className="flex items-center gap-space-sm">
                          <span className="material-symbols-outlined text-outline group-hover:text-secondary text-[18px] transition-colors">
                            inventory_2
                          </span>
                          <span className="font-code-telemetry text-code-telemetry font-bold text-on-surface group-hover:text-secondary transition-colors">
                            {item.id}
                          </span>
                        </div>
                      </td>
                      <td className="py-space-lg px-space-lg font-body-md text-body-md font-medium">
                        {item.weight.toFixed(2)} kg
                      </td>
                      <td className="py-space-lg px-space-lg font-code-telemetry text-code-telemetry text-on-surface-variant">
                        {item.length.toFixed(1)} × {item.width.toFixed(1)} × {item.height.toFixed(1)} cm
                      </td>
                      <td className="py-space-lg px-space-lg text-right">
                        {item.status === 'Etiquetado' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            Etiquetado
                          </span>
                        )}
                        {item.status === 'Procesado' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
                            Procesado
                          </span>
                        )}
                        {item.status === 'Pesado' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                            Pesado
                          </span>
                        )}
                        {item.status === 'Entregado' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            Entregado
                          </span>
                        )}
                        {item.status === 'En Tránsito Activo' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/40 text-secondary font-label-sm text-label-sm font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            En Tránsito Activo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
