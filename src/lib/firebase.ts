import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { Shipment } from '../types';

// Configuration for project smartpack-64dfc
// Supports optional Vercel environment variables with direct fallback
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCD3idQDyHHdTaQSS3SJ0fdbg3_mpKZ174",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smartpack-64dfc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smartpack-64dfc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smartpack-64dfc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "377138646665",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:377138646665:web:3399b7f65c1e29a9294058"
};

// Initialize Firebase cleanly without duplicate instances
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export function generateZplLabel(shipment: Shipment): string {
  return `^XA
^FO50,50^A0N,40,40^FDSmartPack IoT Logistics^FS
^FO50,100^BY3^BCN,100,Y,N,N^FD${shipment.id}^FS
^FO50,230^A0N,25,25^FDORIGEN: ${shipment.origin.hub}^FS
^FO50,265^A0N,25,25^FDDESTINO: ${shipment.destination.hub}^FS
^FO50,300^A0N,25,25^FDPESO REAL: ${shipment.weight} KG  VOLUMEN: ${shipment.volumeM3} M3^FS
^FO50,335^A0N,25,25^FDPESO VOLUMETRICO (IATA 1:5000): ${shipment.volumetricWeight} KG^FS
^FO50,370^BQN,2,6^FDQA,${shipment.id};TRACK;IOT_VERIFIED^FS
^XZ`;
}

/**
 * Guarda en Firestore la información completa del envío generado
 */
export async function saveShipmentToFirebase(shipment: Shipment): Promise<{
  success: boolean;
  id: string;
  error?: string;
}> {
  try {
    const zpl = generateZplLabel(shipment);
    const docRef = doc(db, 'shipments', shipment.id);

    const payload = {
      id: shipment.id,
      weight: shipment.weight,
      length: shipment.length,
      width: shipment.width,
      height: shipment.height,
      volumeM3: shipment.volumeM3,
      volumetricWeight: shipment.volumetricWeight,
      shippingFee: shipment.shippingFee || Number((shipment.volumetricWeight * 3.8 + 8).toFixed(2)),
      status: shipment.status,
      sensorId: shipment.sensorId || 'Sensor SmartPack v4',
      batch: shipment.batch || 'Lote Operativo Hub Norte',
      lastUpdate: 'Ahora',
      origin: shipment.origin,
      destination: shipment.destination,
      telemetry: shipment.telemetry,
      routeProgress: shipment.routeProgress,
      labelZpl: zpl,
      client: shipment.client || 'SmartPack Logistic Services',
      createdAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, payload, { merge: true });
    console.log(`[Firebase] Envío ${shipment.id} guardado con éxito en Firestore.`);
    return { success: true, id: shipment.id };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Firebase Error] Error al guardar envío ${shipment.id}:`, errMessage);
    return { success: false, id: shipment.id, error: errMessage };
  }
}

/**
 * Suscribe la aplicación a la colección de envíos de Firestore en tiempo real
 */
export function subscribeToShipments(
  onUpdate: (remoteShipments: Shipment[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const colRef = collection(db, 'shipments');
    const q = query(colRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Shipment[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: data.id || docSnap.id,
            weight: Number(data.weight) || 0,
            length: Number(data.length) || 0,
            width: Number(data.width) || 0,
            height: Number(data.height) || 0,
            volumeM3: Number(data.volumeM3) || 0,
            volumetricWeight: Number(data.volumetricWeight) || 0,
            shippingFee: Number(data.shippingFee) || 0,
            status: data.status || 'Etiquetado',
            sensorId: data.sensorId || 'Sensor SmartPack v4',
            batch: data.batch || 'Lote Hub Norte',
            lastUpdate: data.lastUpdate || 'Reciente',
            origin: data.origin || { hub: 'Hub Logístico Norte' },
            destination: data.destination || { hub: 'Destino Nacional' },
            routeProgress: data.routeProgress || [],
            telemetry: data.telemetry || {
              internalTemp: 4.5,
              tempStatus: 'Óptima',
              trackerBatteryPercent: 95,
              trackerRemainingDays: 20,
              electronicSeal: 'Intacto',
              sealStatus: 'Verificado',
            },
            client: data.client,
            declaredValue: data.declaredValue,
          });
        });
        onUpdate(list);
      },
      (error) => {
        console.warn('[Firebase Snapshot Warning]:', error.message);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('[Firebase Subscription Error]:', err);
    return () => {};
  }
}
