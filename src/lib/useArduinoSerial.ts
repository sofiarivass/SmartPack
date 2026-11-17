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
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const keepReadingRef = useRef<boolean>(false);
  const disconnectListenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serial' in navigator) {
      setIsSupported(true);
    }
  }, []);

  const cleanupPort = useCallback(async () => {
    keepReadingRef.current = false;

    if (readerRef.current) {
      const reader = readerRef.current;
      readerRef.current = null;
      try {
        await reader.cancel();
      } catch {
        // Ignore cancel errors
      }
      try {
        reader.releaseLock();
      } catch {
        // Ignore release errors
      }
    }

    if (portRef.current) {
      const port = portRef.current;
      portRef.current = null;

      if (disconnectListenerRef.current) {
        try {
          port.removeEventListener('disconnect', disconnectListenerRef.current);
        } catch {
          // Ignore
        }
        disconnectListenerRef.current = null;
      }

      try {
        if (port.readable || port.writable) {
          await port.close();
        }
      } catch (err) {
        console.warn('[Arduino Serial] Error al cerrar el puerto:', err);
      }
    }

    setIsConnected(false);
    setIsConnecting(false);
    setPortName(null);
  }, []);

  const disconnect = useCallback(async () => {
    await cleanupPort();
  }, [cleanupPort]);

  const startReadingLoop = useCallback(
    async (port: any) => {
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (keepReadingRef.current && port.readable) {
        let reader: ReadableStreamDefaultReader<Uint8Array>;
        try {
          reader = port.readable.getReader();
          readerRef.current = reader;
        } catch (lockErr) {
          console.warn('[Arduino Serial] No se pudo obtener lock de lectura:', lockErr);
          break;
        }

        try {
          while (keepReadingRef.current) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }
            if (value) {
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split(/\r?\n/);
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                // Extract JSON payload even if there are extra characters around it
                const jsonStart = trimmed.indexOf('{');
                const jsonEnd = trimmed.lastIndexOf('}');
                if (jsonStart !== -1 && jsonEnd > jsonStart) {
                  const jsonCandidate = trimmed.slice(jsonStart, jsonEnd + 1);
                  try {
                    const parsed = JSON.parse(jsonCandidate);
                    if (
                      typeof parsed.largo === 'number' ||
                      typeof parsed.ancho === 'number' ||
                      typeof parsed.alto === 'number' ||
                      typeof parsed.peso === 'number'
                    ) {
                      const packet: ArduinoData = {
                        largo:
                          typeof parsed.largo === 'number'
                            ? Math.max(0, Number(parsed.largo.toFixed(1)))
                            : 0,
                        ancho:
                          typeof parsed.ancho === 'number'
                            ? Math.max(0, Number(parsed.ancho.toFixed(1)))
                            : 0,
                        alto:
                          typeof parsed.alto === 'number'
                            ? Math.max(0, Number(parsed.alto.toFixed(1)))
                            : 0,
                        peso:
                          typeof parsed.peso === 'number'
                            ? Math.max(0, Number(parsed.peso.toFixed(2)))
                            : 0,
                        categoria: parsed.categoria || 'EXCESO',
                        tarifa: typeof parsed.tarifa === 'number' ? parsed.tarifa : 0,
                        timestamp: Date.now(),
                      };
                      setLastPacket(packet);
                      setPacketCount((c) => c + 1);
                    }
                  } catch {
                    // Ignore incomplete or non-JSON lines
                  }
                }
              }
            }
          }
        } catch (readErr: any) {
          if (keepReadingRef.current) {
            console.warn('[Arduino Serial] Error de lectura:', readErr);
            setError(
              'Se perdió la comunicación con el Arduino. Verifica el cable USB y vuelve a conectar.'
            );
          }
          break;
        } finally {
          try {
            reader.releaseLock();
          } catch {
            // Ignore
          }
          if (readerRef.current === reader) {
            readerRef.current = null;
          }
        }
      }
    },
    []
  );

  const openPortWithRetry = async (port: any): Promise<void> => {
    // If port is already open in this tab, try closing cleanly first so we get a fresh 9600 session
    if (port.readable || port.writable) {
      try {
        if (port.readable?.locked && readerRef.current) {
          await readerRef.current.cancel().catch(() => {});
          readerRef.current.releaseLock();
          readerRef.current = null;
        }
        await port.close();
        await new Promise((r) => setTimeout(r, 250));
      } catch {
        // If already open and usable, return directly
        if (port.readable && !port.readable.locked) {
          return;
        }
      }
    }

    try {
      await port.open({ baudRate: 9600 });
    } catch (firstErr: any) {
      // Retry once after brief delay (handles CH340/Windows driver handle release delay)
      if (firstErr?.name === 'InvalidStateError' && port.readable) {
        return;
      }
      await new Promise((r) => setTimeout(r, 350));
      try {
        if (port.readable || port.writable) {
          await port.close().catch(() => {});
          await new Promise((r) => setTimeout(r, 200));
        }
        await port.open({ baudRate: 9600 });
      } catch (secondErr: any) {
        throw secondErr;
      }
    }
  };

  const connect = useCallback(async () => {
    if (!('serial' in navigator)) {
      setError('Tu navegador no soporta Web Serial API. Usa Google Chrome, Microsoft Edge u Opera.');
      return;
    }

    setError(null);
    setIsConnecting(true);

    // Ensure any previous connection from this app is completely closed first
    if (portRef.current || readerRef.current) {
      await cleanupPort();
      await new Promise((r) => setTimeout(r, 200));
    }

    try {
      const port = await (navigator as any).serial.requestPort({});

      await openPortWithRetry(port);

      portRef.current = port;
      keepReadingRef.current = true;

      const handlePortDisconnect = () => {
        cleanupPort();
        setError('El Arduino se desconectó del puerto USB.');
      };
      disconnectListenerRef.current = handlePortDisconnect;
      port.addEventListener('disconnect', handlePortDisconnect);

      setIsConnected(true);
      setIsConnecting(false);
      setPortName('Arduino USB (9600 baud)');

      // Start reading loop in background
      await startReadingLoop(port);

      // If loop exited while still expected to read, clean up cleanly
      if (keepReadingRef.current) {
        await cleanupPort();
      }
    } catch (err: any) {
      console.error('[Arduino Serial] Error al conectar:', err);
      const msg = String(err?.message || '');

      if (err?.name === 'NotFoundError') {
        // User cancelled port picker — no error banner needed
        setError(null);
      } else if (err?.name === 'SecurityError') {
        setError(
          'El navegador bloqueó el acceso al puerto serie por permisos de seguridad (SecurityError). Abre la app en una pestaña directa.'
        );
      } else if (
        err?.name === 'NetworkError' ||
        msg.toLowerCase().includes('failed to open serial port')
      ) {
        setError(
          'No se pudo abrir el puerto COM del Arduino (está ocupado o bloqueado). Cierra el Monitor Serie / Plotter de Arduino IDE, cierra otras pestañas que usen el puerto y asegúrate de seleccionar el puerto USB del Arduino (no un puerto COM Bluetooth).'
        );
      } else {
        setError(msg || 'Error inesperado al conectar con el puerto serie.');
      }
      await cleanupPort();
    }
  }, [cleanupPort, startReadingLoop]);

  const injectManualData = useCallback((data: Partial<ArduinoData>) => {
    setLastPacket((prev) => ({
      largo: data.largo !== undefined ? data.largo : prev?.largo || 0,
      ancho: data.ancho !== undefined ? data.ancho : prev?.ancho || 0,
      alto: data.alto !== undefined ? data.alto : prev?.alto || 0,
      peso: data.peso !== undefined ? data.peso : prev?.peso || 0,
      categoria: data.categoria || prev?.categoria || 'MEDIANO',
      tarifa: data.tarifa !== undefined ? data.tarifa : prev?.tarifa || 0,
      timestamp: Date.now(),
    }));
    setPacketCount((c) => c + 1);
  }, []);

  // Cleanup only when App unmounts
  useEffect(() => {
    return () => {
      cleanupPort();
    };
  }, [cleanupPort]);

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
