export type ViewMode = 'resumen' | 'envios' | 'etiquetas' | 'administracion' | 'rastreo';

export type TimeRange = '30d' | 'trimestre' | 'anual';

export interface RouteStep {
  number: number;
  title: string;
  subtitle: string;
  detail: string;
  completed: boolean;
  active: boolean;
  timestamp?: string;
}

export interface RecipientInfo {
  nombre: string;
  apellido: string;
  dni: string;
}

export interface Shipment {
  id: string;
  weight: number; // in kg
  length: number; // in cm
  width: number; // in cm
  height: number; // in cm
  volumeM3: number;
  volumetricWeight: number; // kg (factor 1:5000)
  status: 'Etiquetado' | 'Procesado' | 'Pesado' | 'Entregado' | 'En Tránsito Activo';
  statusColor?: string;
  sensorId?: string;
  batch?: string;
  lastUpdate: string;
  recipient?: RecipientInfo;
  origin: {
    hub: string;
    terminal?: string;
    dispatchedTime?: string;
  };
  destination: {
    hub: string;
    zone?: string;
    estimatedDelivery?: string;
  };
  routeProgress: RouteStep[];
  telemetry: {
    internalTemp: number; // °C
    tempStatus: string;
    trackerBatteryPercent: number;
    trackerRemainingDays: number;
    electronicSeal: string;
    sealStatus: string;
    gpsLocation?: string;
    gpsSpeedKmH?: number;
  };
  client?: string;
  declaredValue?: number;
  shippingFee?: number;
}
