
import { useState, useCallback, useRef } from 'react';

// Minimal type definitions for Web Serial API
interface SerialPort {
  open(options: { baudRate: number, flowControl?: 'none' | 'hardware' }): Promise<void>;
  close(): Promise<void>;
  readonly readable: ReadableStream<Uint8Array> | null;
  readonly writable: WritableStream<Uint8Array> | null;
}
interface SerialPortReader {
    read(): Promise<{ value?: Uint8Array; done: boolean }>;
    releaseLock(): void;
    cancel(): Promise<void>;
}

export type SyncState = 'disconnected' | 'connecting' | 'initializing' | 'syncing' | 'connected';

interface UseSerialProps {
  onPatchReceived: (data: Uint8Array) => void;
  onSyncStateChange: (state: SyncState | ((prevState: SyncState) => SyncState)) => void;
  onLog: (message: string) => void;
}

interface UseSerialReturn {
  connect: (baudRate: number) => Promise<void>;
  disconnect: () => Promise<void>;
  sendParameter: (paramId: number, value: number) => void;
  requestPatch: () => Promise<void>;
  sendRaw: (command: string) => Promise<void>;
  injectPatch: (data: Uint8Array) => Promise<void>;
  readProgramFromEEPROM: (programNumber: number) => Promise<void>;
  writeProgramToEEPROM: (programNumber: number) => Promise<void>;
}

const PATCH_DATA_LENGTH = 512;
const CMD_INIT = new Uint8Array([105]); // 'i'
const CMD_DUMP = new Uint8Array([100]); // 'd'
const CMD_INJECT = new Uint8Array([106]); // 'j'
const ACK_CODE = 0x00;
const SYNC_TIMEOUT_MS = 3000;

const toHex = (data: Uint8Array) => Array.from(data).map(b => b.toString(16).padStart(2, '0')).join(' ');
const encoder = new TextEncoder();

export const useSerial = ({ onPatchReceived, onSyncStateChange, onLog }: UseSerialProps): UseSerialReturn => {
  const portRef = useRef<SerialPort | null>(null);
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(null);
  const readerRef = useRef<SerialPortReader | null>(null);
  const keepReadingRef = useRef(false);
  const syncTimeoutRef = useRef<number | null>(null);

  const clearSyncTimeout = () => {
    if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
    }
  };

  const disconnect = useCallback(async () => {
    onLog('System: Disconnecting...');
    clearSyncTimeout();
    keepReadingRef.current = false;
    
    if (readerRef.current) {
        try {
            await readerRef.current.cancel();
        } catch(e) { /* Ignore cancel errors */ }
    }
    
    if (writerRef.current) {
      try {
        writerRef.current.releaseLock();
      } catch (error) {
        console.error('Error releasing writer lock:', error);
      }
    }

    if (portRef.current) {
      try {
        await portRef.current.close();
        onLog('System: Port closed.');
      } catch (error) {
        onLog(`System: Error closing port: ${error}`);
        console.error('Error closing port:', error);
      }
    }
    
    portRef.current = null;
    writerRef.current = null;
    readerRef.current = null;
    
    onSyncStateChange('disconnected');
    onLog('System: Port disconnected.');
  }, [onSyncStateChange, onLog]);

  const write = useCallback(async (data: Uint8Array, type: 'CMD' | 'PARAM' | 'RAW' | 'PATCH') => {
      if (!writerRef.current) {
          onLog('System: Write failed. Writer not available.');
          return;
      };
      try {
          await writerRef.current.write(data);
          if (type !== 'PATCH') {
            const logMsg = type === 'RAW' ? new TextDecoder().decode(data) : toHex(data);
            onLog(`TX: ${logMsg} (${type})`);
          } else {
            onLog(`TX: Sent 512-byte patch data`);
          }
      } catch (error) {
          onLog(`System: Error writing: ${error}`);
          console.error('Error writing to serial port:', error);
          await disconnect();
      }
  }, [onLog, disconnect]);

  const listen = useCallback(async () => {
    if (!portRef.current?.readable) return;

    let receivedData = new Uint8Array(0);
    keepReadingRef.current = true;
    onLog('System: Read loop started.');

    while (portRef.current?.readable && keepReadingRef.current) {
        try {
            const reader = portRef.current.readable.getReader();
            readerRef.current = reader;
            
            while (keepReadingRef.current) {
                const { value, done } = await reader.read();
                if (done) {
                    onLog('System: Reader done.');
                    break;
                };
                
                if (value) {
                    onLog(`RX: ${toHex(value)} (len: ${value.length})`);
                    
                    if (value.length === 1 && value[0] === ACK_CODE) {
                        onLog('RX: ACK (0x00)');
                        continue; 
                    }

                    const newData = new Uint8Array(receivedData.length + value.length);
                    newData.set(receivedData);
                    newData.set(value, receivedData.length);
                    receivedData = newData;

                    if (receivedData.length >= PATCH_DATA_LENGTH) {
                        onLog(`System: Full patch received (${receivedData.length} bytes). Processing...`);
                        clearSyncTimeout();
                        const patch = receivedData.slice(0, PATCH_DATA_LENGTH);
                        onPatchReceived(patch);
                        receivedData = receivedData.slice(PATCH_DATA_LENGTH);
                    }
                }
            }
            if(readerRef.current) {
              reader.releaseLock();
              readerRef.current = null;
            }
        } catch (error) {
            if (!(error instanceof DOMException && error.name === 'AbortError')) {
              onLog(`System: Error in read loop: ${error}`);
              console.error('Error in read loop:', error);
            }
            break;
        }
    }
    onLog('System: Read loop ended.');
  }, [onPatchReceived, onLog]);

  const requestPatch = useCallback(async () => {
    onSyncStateChange('syncing');
    onLog("System: Requesting patch dump...");
    await write(CMD_DUMP, 'CMD');
  }, [onSyncStateChange, write, onLog]);


  const connect = useCallback(async (baudRate: number) => {
    if (!('serial' in navigator)) {
      alert('Web Serial API not supported by your browser. Try Chrome or Edge.');
      onLog("System: Web Serial API not supported.");
      return;
    }
    
    onSyncStateChange('connecting');
    onLog("System: Requesting serial port...");

    try {
      const port: SerialPort = await (navigator as any).serial.requestPort({
        filters: [{ usbVendorId: 0x0403 }], // FTDI Vendor ID
      });
      onLog(`System: Port selected. Opening with baud rate ${baudRate}...`);
      await port.open({ baudRate, flowControl: 'none' });
      onLog("System: Port opened successfully.");
      
      portRef.current = port;
      writerRef.current = port.writable?.getWriter() ?? null;
      if (!writerRef.current) throw new Error('Could not get a writer for the serial port.');

      listen();
      
      onSyncStateChange('initializing');
      onLog("System: Initializing synth...");
      await write(CMD_INIT, 'CMD');
      await new Promise(resolve => setTimeout(resolve, 100)); // Increased delay
      
      await requestPatch();
      onLog('System: Port connected. Waiting for sync...');

      syncTimeoutRef.current = setTimeout(() => {
        onLog("Error: Sync timed out. The synth did not respond.");
        onLog("System: Ensure synth is powered and in normal operating mode (not firmware update mode). Try a different baud rate if needed.");
        disconnect();
      }, SYNC_TIMEOUT_MS);

    } catch (error) {
      onLog(`System: Error connecting - ${error instanceof Error ? error.message : String(error)}`);
      if (error instanceof DOMException && error.name === 'NotFoundError') {
        onLog("System: Port selection cancelled by user.");
      } else {
        console.error('There was an error opening the serial port:', error);
      }
      onSyncStateChange('disconnected');
    }
  }, [listen, requestPatch, onSyncStateChange, onLog, write, disconnect]);
  
  const sendParameter = useCallback(async (paramId: number, value: number) => {
    if (paramId === undefined || value === undefined) return;
    const clampedValue = Math.max(0, Math.min(255, Math.round(value)));
    const commandBytes: number[] = [115]; // 's'

    if (paramId > 254) {
      commandBytes.push(255);
      commandBytes.push(paramId - 256);
    } else {
      commandBytes.push(paramId);
    }
    commandBytes.push(clampedValue);
    
    await write(new Uint8Array(commandBytes), 'PARAM');
  }, [write]);
  
  const sendRaw = useCallback(async (command: string) => {
    const data = encoder.encode(command);
    await write(data, 'RAW');
  }, [write]);
  
  const injectPatch = useCallback(async (data: Uint8Array) => {
    if (data.length !== 512) {
      onLog(`Error: Cannot inject patch. Data must be 512 bytes, got ${data.length}`);
      return;
    }
    onLog("System: Injecting patch data into active memory...");
    await write(CMD_INJECT, 'CMD');
    await new Promise(r => setTimeout(r, 10));
    await write(data, 'PATCH');
  }, [write, onLog]);

  const readProgramFromEEPROM = useCallback(async (programNumber: number) => {
    onLog(`System: Requesting load from EEPROM slot ${programNumber}...`);
    await write(new Uint8Array([114, programNumber]), 'CMD'); // 'r'
    await new Promise(resolve => setTimeout(resolve, 50));
    await requestPatch();
  }, [write, onLog, requestPatch]);

  const writeProgramToEEPROM = useCallback(async (programNumber: number) => {
    onLog(`System: Requesting save to EEPROM slot ${programNumber}...`);
    await write(new Uint8Array([119, programNumber]), 'CMD'); // 'w'
  }, [write, onLog]);


  return { connect, disconnect, sendParameter, requestPatch, sendRaw, injectPatch, readProgramFromEEPROM, writeProgramToEEPROM };
};
