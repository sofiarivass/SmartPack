import React, { useState } from 'react';
import { Shipment } from '../types';
import { SmartPackLogo } from './SmartPackLogo';

interface Props {
  shipment: Shipment;
  onClose: () => void;
  onTrack: (id: string) => void;
}

export const LabelModal: React.FC<Props> = ({ shipment, onClose, onTrack }) => {
  const [copiedZPL, setCopiedZPL] = useState(false);

  const zplCode = `^XA
^FO50,50^A0N,40,40^FDSmartPack IoT Logistics^FS
^FO50,100^BY3^BCN,100,Y,N,N^FD${shipment.id}^FS
^FO50,230^A0N,25,25^FDORIGEN: ${shipment.origin.hub}^FS
^FO50,265^A0N,25,25^FDDESTINO: ${shipment.destination.hub}^FS
^FO50,300^A0N,25,25^FDPESO REAL: ${shipment.weight} KG  VOLUMEN: ${shipment.volumeM3} M3^FS
^FO50,335^A0N,25,25^FDPESO VOLUMETRICO (IATA 1:5000): ${shipment.volumetricWeight} KG^FS
^FO50,370^BQN,2,6^FDQA,${shipment.id};TRACK;IOT_VERIFIED^FS
^XZ`;

  const handleCopyZPL = () => {
    navigator.clipboard.writeText(zplCode);
    setCopiedZPL(true);
    setTimeout(() => setCopiedZPL(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container max-w-lg w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              verified
            </span>
            <div className="flex flex-col">
              <span className="font-headline-sm text-sm font-bold text-on-surface">
                Guía de Despacho ZPL Emitida
              </span>
              <div className="flex items-center gap-1.5 font-code-telemetry text-xs text-secondary">
                <span>{shipment.id} • Impresora #Z4M-01</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-[13px] text-secondary">cloud_done</span>
                  Firebase: smartpack-64dfc
                </span>
              </div>
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

        {/* Physical Thermal Label Preview */}
        <div className="p-6 bg-surface-container-low/30 flex flex-col items-center">
          <div className="w-full max-w-sm bg-white border-2 border-dashed border-outline-variant rounded-xl p-5 shadow-sm text-black font-mono flex flex-col gap-3">
            {/* Label Header */}
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <SmartPackLogo className="h-6 w-auto object-contain" />
                <span className="font-sans font-bold text-sm tracking-tight">SmartPack IoT</span>
              </div>
              <span className="text-xs font-sans font-bold uppercase bg-black text-white px-2 py-0.5 rounded">
                EXPRESS 24H
              </span>
            </div>

            {/* Barcode Simulated Lines */}
            <div className="flex flex-col items-center py-2 bg-slate-50 border border-slate-200 rounded p-2">
              <div className="w-full h-16 flex items-center justify-between gap-[2px] px-2 overflow-hidden">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-full bg-black"
                    style={{
                      width: i % 3 === 0 ? '4px' : i % 2 === 0 ? '2px' : '1px',
                    }}
                  />
                ))}
              </div>
              <span className="font-mono text-xs font-bold tracking-widest mt-1 text-black">
                *{shipment.id}*
              </span>
            </div>

            {/* Origin & Destination details */}
            <div className="grid grid-cols-2 gap-2 text-xs border-b pb-2 border-slate-300 font-sans">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                  ORIGEN
                </span>
                <span className="font-semibold block truncate">
                  {shipment.origin.hub}
                </span>
                <span className="text-[10px] text-slate-600 block">
                  Operador: Elena Morales
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                  DESTINO
                </span>
                <span className="font-semibold block truncate text-secondary">
                  {shipment.destination.hub}
                </span>
                <span className="text-[10px] text-slate-600 block">
                  {shipment.destination.estimatedDelivery}
                </span>
              </div>
            </div>

            {/* Telemetry & Volumetric Specs */}
            <div className="grid grid-cols-3 gap-1 text-[11px] font-sans bg-slate-100 p-2 rounded">
              <div>
                <span className="text-[9px] text-slate-500 block uppercase font-bold">
                  PESO REAL
                </span>
                <span className="font-bold">{shipment.weight} kg</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase font-bold">
                  DIMENSIONES
                </span>
                <span className="font-bold">
                  {shipment.length}×{shipment.width}×{shipment.height}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase font-bold">
                  VOLUMÉTRICO
                </span>
                <span className="font-bold text-secondary">
                  {shipment.volumetricWeight} kg
                </span>
              </div>
            </div>

            {/* Bottom QR Code representation */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex flex-col text-[10px] text-slate-600 font-sans">
                <span>SENSOR: SmartPack v4 Active BLE</span>
                <span>TELEMETRÍA: Temp + Shock + E-Seal</span>
                <span className="font-bold text-black mt-0.5">
                  TARIFA CALCULADA: €{shipment.shippingFee || 38.5}
                </span>
              </div>
              {/* Simulated QR matrix */}
              <div className="w-12 h-12 bg-black p-1 rounded flex flex-wrap gap-[1px]">
                <div className="w-full h-full bg-white p-[2px] flex flex-wrap gap-[1px]">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-[5px] h-[5px] ${
                        i % 2 === 0 || i === 0 || i === 4 || i === 20 || i === 24
                          ? 'bg-black'
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-surface-container bg-surface-container-lowest flex items-center justify-between gap-3">
          <button
            onClick={handleCopyZPL}
            className="px-4 py-2 border border-surface-container rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-1.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copiedZPL ? 'check' : 'content_copy'}
            </span>
            <span>{copiedZPL ? '¡Código ZPL Copiado!' : 'Copiar ZPL Raw'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onTrack(shipment.id);
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-secondary hover:bg-secondary-container/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">travel_explore</span>
              <span>Rastrear en Vivo</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-secondary text-white rounded-lg text-xs font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimir Etiqueta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
