import React, { useState } from 'react';
import { TimeRange } from '../types';

interface Props {
  onNavigateToShipments: () => void;
  onNavigateToTracking?: (id: string) => void;
}

export const ExecutiveSummaryView: React.FC<Props> = ({
  onNavigateToShipments,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Dynamic metrics depending on selected range
  const metrics = {
    '30d': {
      revenue: '€148,920.00',
      revenueDelta: '+14.2% vs mes anterior',
      projectedPerformance: '96.8%',
      performanceWidth: '96.8%',
      shipmentsCount: '24,850',
      shipmentsDelta: '+8.6% volumen',
      accuracyText: 'Calibrado (0.01g)',
      scaleWidth: '99.4%',
      chartTotal: '24.8k',
      peqPercent: '52%',
      medPercent: '34%',
      graPercent: '14%',
      scanEfficiency: '99.8%',
      avgCubingTime: '1.4s',
    },
    trimestre: {
      revenue: '€432,650.00',
      revenueDelta: '+18.7% vs trim anterior',
      projectedPerformance: '98.2%',
      performanceWidth: '98.2%',
      shipmentsCount: '72,190',
      shipmentsDelta: '+12.4% volumen',
      accuracyText: 'Calibrado (0.01g)',
      scaleWidth: '99.7%',
      chartTotal: '72.2k',
      peqPercent: '54%',
      medPercent: '33%',
      graPercent: '13%',
      scanEfficiency: '99.9%',
      avgCubingTime: '1.3s',
    },
    anual: {
      revenue: '€1,745,800.00',
      revenueDelta: '+24.1% vs año anterior',
      projectedPerformance: '99.1%',
      performanceWidth: '99.1%',
      shipmentsCount: '291,400',
      shipmentsDelta: '+19.3% volumen',
      accuracyText: 'Certificado ENAC',
      scaleWidth: '99.8%',
      chartTotal: '291k',
      peqPercent: '50%',
      medPercent: '35%',
      graPercent: '15%',
      scanEfficiency: '99.8%',
      avgCubingTime: '1.4s',
    },
  }[timeRange];

  const handleExport = () => {
    setExportNotice('Generando informe ejecutivo consolidado (PDF/CSV)...');
    setTimeout(() => {
      // Simulate file download
      const csvContent =
        'data:text/csv;charset=utf-8,Periodo,Ingresos,Envios,Eficiencia_Escaneo,Precision_Basculas\n' +
        `${timeRange},${metrics.revenue.replace('€', '').replace(',', '')},${metrics.shipmentsCount.replace(',', '')},${metrics.scanEfficiency},${metrics.accuracyText}\n`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `SmartPack_Informe_Ejecutivo_${timeRange}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportNotice('¡Informe exportado con éxito!');
      setTimeout(() => setExportNotice(null), 2500);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-space-xl py-space-xl max-w-[1600px] mx-auto w-full flex flex-col gap-space-xl">
        {/* Top Header Row with Title and Timeframe Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                Métricas Ejecutivas • Nodo Global
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Resumen de Rendimiento y Operaciones
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Métricas consolidadas de logística y clasificación inteligente en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-space-sm bg-surface-container-lowest shadow-sm p-1 rounded-xl border border-surface-container/60 self-start md:self-auto">
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                timeRange === '30d'
                  ? 'bg-surface-container-low text-on-surface font-semibold shadow-xs'
                  : 'text-outline hover:text-on-surface'
              }`}
              type="button"
            >
              Últimos 30 días
            </button>
            <button
              onClick={() => setTimeRange('trimestre')}
              className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                timeRange === 'trimestre'
                  ? 'bg-surface-container-low text-on-surface font-semibold shadow-xs'
                  : 'text-outline hover:text-on-surface'
              }`}
              type="button"
            >
              Trimestre
            </button>
            <button
              onClick={() => setTimeRange('anual')}
              className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                timeRange === 'anual'
                  ? 'bg-surface-container-low text-on-surface font-semibold shadow-xs'
                  : 'text-outline hover:text-on-surface'
              }`}
              type="button"
            >
              Anual
            </button>
            <div className="w-px h-5 bg-surface-container mx-1"></div>
            <button
              aria-label="Exportar informe"
              onClick={handleExport}
              className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
              type="button"
              title="Exportar informe en CSV"
            >
              <span className="material-symbols-outlined text-[20px]">file_download</span>
            </button>
          </div>
        </div>

        {/* Notification pill if export clicked */}
        {exportNotice && (
          <div className="bg-secondary-container/30 border border-secondary/30 text-secondary px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-between animate-in fade-in duration-200">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              {exportNotice}
            </span>
            <button
              onClick={() => setExportNotice(null)}
              className="text-secondary/70 hover:text-secondary"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* 3 Main KPI Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg items-stretch">
          {/* CARD 1: Ingresos Totales */}
          <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  Ingresos Totales
                </span>
              </div>
              <span className="inline-flex items-center gap-1 bg-secondary-container/40 text-secondary px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                {metrics.revenueDelta}
              </span>
            </div>

            <div className="my-space-lg flex flex-col gap-space-xs">
              <div className="font-metric-xl text-metric-xl text-primary font-bold tracking-tight">
                {metrics.revenue}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Facturación directa por tarifas y pesaje dinámico.
              </p>
            </div>

            <div className="pt-space-md bg-surface-container-low/50 -mx-space-xl -mb-space-xl px-space-xl pb-space-lg mt-auto border-t border-surface-container/30">
              <div className="flex items-center justify-between text-outline font-label-sm text-label-sm mb-2">
                <span>Rendimiento proyectado mensual</span>
                <span className="font-code-telemetry text-code-telemetry text-on-surface font-semibold">
                  {metrics.projectedPerformance}
                </span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full rounded-full transition-all duration-700"
                  style={{ width: metrics.performanceWidth }}
                ></div>
              </div>
            </div>
          </div>

          {/* CARD 2: Total de Envíos */}
          <div
            onClick={onNavigateToShipments}
            className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all cursor-pointer"
            title="Ver puestos de cubicación y envíos recientes"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  Total de Envíos
                </span>
              </div>
              <span className="inline-flex items-center gap-1 bg-secondary-container/40 text-secondary px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                {metrics.shipmentsDelta}
              </span>
            </div>

            <div className="my-space-lg flex flex-col gap-space-xs">
              <div className="font-metric-xl text-metric-xl text-primary font-bold tracking-tight">
                {metrics.shipmentsCount}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                99.4% clasificados mediante básculas IoT sin intervención manual.
              </p>
            </div>

            <div className="pt-space-md bg-surface-container-low/50 -mx-space-xl -mb-space-xl px-space-xl pb-space-lg mt-auto border-t border-surface-container/30">
              <div className="flex items-center justify-between text-outline font-label-sm text-label-sm mb-2">
                <span>Precisión de básculas dinámicas</span>
                <span className="font-code-telemetry text-code-telemetry text-secondary font-semibold">
                  {metrics.accuracyText}
                </span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary-container h-full rounded-full transition-all duration-700"
                  style={{ width: metrics.scaleWidth }}
                ></div>
              </div>
            </div>
          </div>

          {/* CARD 3: Distribución de Volumen */}
          <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between relative hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[20px]">pie_chart</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  Distribución de Volumen
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                3 Categorías
              </span>
            </div>

            {/* Circular Donut Chart */}
            <div className="flex items-center justify-center my-space-md relative">
              <svg
                aria-label="Gráfico de volumen por categoría"
                className="w-36 h-36 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background Ring */}
                <circle
                  className="text-surface-container-high"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="14"
                ></circle>
                {/* Segment 1: Secondary (52% PEQ) */}
                <circle
                  className="text-secondary transition-all duration-500 cursor-pointer hover:opacity-90"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeDasharray="238.76"
                  strokeDashoffset="114.6"
                  strokeLinecap="round"
                  strokeWidth="14"
                  onMouseEnter={() => setHoveredCategory('PEQ')}
                  onMouseLeave={() => setHoveredCategory(null)}
                ></circle>
                {/* Segment 2: Primary Container (34% MED) */}
                <circle
                  className="text-primary-container transition-all duration-500 cursor-pointer hover:opacity-90"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeDasharray="238.76"
                  strokeDashoffset="157.58"
                  strokeLinecap="round"
                  strokeWidth="14"
                  transform="rotate(187.2 50 50)"
                  onMouseEnter={() => setHoveredCategory('MED')}
                  onMouseLeave={() => setHoveredCategory(null)}
                ></circle>
                {/* Segment 3: Tertiary Fixed Dim (14% GRA) */}
                <circle
                  className="text-tertiary-fixed-dim transition-all duration-500 cursor-pointer hover:opacity-90"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeDasharray="238.76"
                  strokeDashoffset="205.33"
                  strokeLinecap="round"
                  strokeWidth="14"
                  transform="rotate(309.6 50 50)"
                  onMouseEnter={() => setHoveredCategory('GRA')}
                  onMouseLeave={() => setHoveredCategory(null)}
                ></circle>
              </svg>

              {/* Center Donut Label */}
              <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold leading-none">
                  {hoveredCategory
                    ? hoveredCategory === 'PEQ'
                      ? metrics.peqPercent
                      : hoveredCategory === 'MED'
                      ? metrics.medPercent
                      : metrics.graPercent
                    : metrics.chartTotal}
                </span>
                <span className="font-label-sm text-label-sm text-outline mt-0.5">
                  {hoveredCategory ? hoveredCategory : 'Paquetes'}
                </span>
              </div>
            </div>

            {/* 3 Categories Legend */}
            <div className="grid grid-cols-3 gap-space-xs pt-space-sm">
              <div
                onMouseEnter={() => setHoveredCategory('PEQ')}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex flex-col items-center text-center p-2 rounded-lg transition-colors cursor-pointer ${
                  hoveredCategory === 'PEQ'
                    ? 'bg-secondary-container/40 ring-1 ring-secondary'
                    : 'bg-surface-container-low/40 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    {metrics.peqPercent}
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  PEQ
                </span>
                <span className="font-code-telemetry text-code-telemetry text-outline text-[10px]">
                  &lt; 3 kg
                </span>
              </div>

              <div
                onMouseEnter={() => setHoveredCategory('MED')}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex flex-col items-center text-center p-2 rounded-lg transition-colors cursor-pointer ${
                  hoveredCategory === 'MED'
                    ? 'bg-primary-container/20 ring-1 ring-primary-container'
                    : 'bg-surface-container-low/40 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    {metrics.medPercent}
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  MED
                </span>
                <span className="font-code-telemetry text-code-telemetry text-outline text-[10px]">
                  3-15 kg
                </span>
              </div>

              <div
                onMouseEnter={() => setHoveredCategory('GRA')}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex flex-col items-center text-center p-2 rounded-lg transition-colors cursor-pointer ${
                  hoveredCategory === 'GRA'
                    ? 'bg-tertiary-fixed-dim/30 ring-1 ring-tertiary-fixed-dim'
                    : 'bg-surface-container-low/40 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    {metrics.graPercent}
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  GRA
                </span>
                <span className="font-code-telemetry text-code-telemetry text-outline text-[10px]">
                  &gt; 15 kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner: Eficiencia Operativa IoT de la Red */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[22px]">speed</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Eficiencia Operativa IoT de la Red
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Sincronización activa en estaciones de cubicación y pesaje dinámico
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-space-xl">
            <div className="flex items-center gap-space-sm">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                Eficiencia de Escaneo:
              </span>
              <span className="font-code-telemetry text-code-telemetry font-bold text-secondary bg-surface-container-low px-2 py-0.5 rounded">
                {metrics.scanEfficiency}
              </span>
            </div>

            <div className="w-px h-6 bg-surface-container hidden md:block"></div>

            <div className="flex items-center gap-space-sm">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                Tiempo Medio de Cubicación:
              </span>
              <span className="font-code-telemetry text-code-telemetry font-bold text-on-surface bg-surface-container-low px-2 py-0.5 rounded">
                {metrics.avgCubingTime}
              </span>
            </div>

            <div className="w-px h-6 bg-surface-container hidden md:block"></div>

            <div className="flex items-center gap-1.5 text-secondary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="font-label-sm text-label-sm font-semibold tracking-wide">
                Óptimo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
