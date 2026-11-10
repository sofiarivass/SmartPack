import { useState, useEffect, useRef, useCallback } from 'react';

export interface ArduinoData {
  largo: number;
  ancho: number;
  alto: number;
  peso: number;
  categoria?: string;
  tarifa?: number;
  raw?: number;
  timestamp: number;
}

export interface ArduinoSerialState {
  isSupported: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  portName: string | null;
  error: string | null;
  lastPacket: ArduinoData | null;
  packetCount: number;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  injectManualData: (data: Partial<ArduinoData>) => void;
}

export function useArduinoSerial(): ArduinoSerialState {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [portName, setPortName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastPacket, setLastPacket] = useState<ArduinoData | null>(null);
  const [packetCount, setPacketCount] = useState<number>(0);

  const portRef = useRef<any>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);
  const keepReadingRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serial' in navigator) {
      setIsSupported(true);
    }
  }, []);

  const disconnect = useCallback(async () => {
    keepReadingRef.current = false;
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current = null;
      }
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
    } catch (err) {
      console.warn('[Arduino Serial] Error during disconnect:', err);
    } finally {
      setIsConnected(false);
      setIsConnecting(false);
      setPortName(null);
    }
  }, []);

  const connect = useCallback(async () => {
    if (!('serial' in navigator)) {
      setError('Tu navegador no soporta Web Serial API. Usa Google Chrome, Microsoft Edge u Opera.');
      return;
    }

    setError(null);
    setIsConnecting(true);

    try {
      // Prompt user to select Arduino port
      const port = await (navigator as any).serial.requestPort({
        // Filters can be empty to allow any USB Serial CDC device (Arduino Uno, Nano, Mega, ESP32, etc.)
      });

      // Arduino Serial.begin(9600) from sketch
      await port.open({ baudRate: 9600 });
      portRef.current = port;
      keepReadingRef.current = true;
      setIsConnected(true);
      setIsConnecting(false);
      setPortName('Arduino USB (9600 baud)');

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      readerRef.current = reader;

      let buffer = '';

      while (keepReadingRef.current) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        if (value) {
          buffer += value;
          const lines = buffer.split('\n');
          // Keep whatever is after the last newline in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Check if line contains JSON payload: {"largo":...,"ancho":...,"alto":...,"peso":...}
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
              try {
                const parsed = JSON.parse(trimmed);
                const packet: ArduinoData = {
                  largo: typeof parsed.largo === 'number' ? Math.max(0, Number(parsed.largo.toFixed(1))) : 0,
                  ancho: typeof parsed.ancho === 'number' ? Math.max(0, Number(parsed.ancho.toFixed(1))) : 0,
                  alto: typeof parsed.alto === 'number' ? Math.max(0, Number(parsed.alto.toFixed(1))) : 0,
                  peso: typeof parsed.peso === 'number' ? Math.max(0, Number(parsed.peso.toFixed(2))) : 0,
                  categoria: parsed.categoria || 'MEDIANO',
                  tarifa: parsed.tarifa || 0,
                  timestamp: Date.now(),
                };
                setLastPacket(packet);
                setPacketCount((c) => c + 1);
              } catch (parseErr) {
                // Ignore incomplete or corrupt JSON frames
              }
            }
          }
        }
      }

      await readableStreamClosed.catch(() => {});
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        setError(err.message || 'Error al conectar con el puerto serie.');
      }
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, []);

  const injectManualData = useCallback((data: Partial<ArduinoData>) => {
    setLastPacket((prev) => ({
      largo: data.largo !== undefined ? data.largo : prev?.largo || 0,
      ancho: data.ancho !== undefined ? data.ancho : prev?.ancho || 0,
      alto: data.alto !== undefined ? data.alto : prev?.alto || 0,
      peso: data.peso !== undefined ? data.peso : prev?.peso || 0,
      categoria: data.categoria || prev?.categoria || 'MEDIANO',
      tarifa: data.tarifa || prev?.tarifa || 0,
      timestamp: Date.now(),
    }));
    setPacketCount((c) => c + 1);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (keepReadingRef.current) {
        disconnect();
      }
    };
  }, [disconnect]);

  return {
    isSupported,
    isConnected,
    isConnecting,
    portName,
    error,
    lastPacket,
    packetCount,
    connect,
    disconnect,
    injectManualData,
  };
}
