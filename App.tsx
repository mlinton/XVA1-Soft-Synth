
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { initialPatch } from './constants';
import type { SynthPatch, Section, Oscillator, Filter, LFO, Envelope, Arpeggiator, StepSequencer, ModulationSource, DirectModulationSource } from './types';
import { OscillatorIcon, FilterIcon, LfoIcon, EnvelopeIcon, FxIcon, GlobalIcon, ModulationIcon } from './components/icons';
import OscillatorSection from './components/sections/OscillatorSection';
import FilterSection from './components/sections/FilterSection';
import LfoSection from './components/sections/LfoSection';
import EnvelopeSection from './components/sections/EnvelopeSection';
import EffectsSection from './components/sections/EffectsSection';
import GlobalSection from './components/sections/GlobalSection';
import ModulationSection from './components/sections/ModulationSection';
import { useSerial, SyncState } from './hooks/useSerial';
import { parameterMap } from './parameterMap';
import { parsePatchFromData } from './utils/patchParser';
import { serializePatchToData } from './utils/patchSerializer';


const BAUD_RATES = [12000000, 500000, 115200, 57600, 38400, 9600];

const App: React.FC = () => {
  const [patch, setPatch] = useState<SynthPatch>(initialPatch);
  const [activeSection, setActiveSection] = useState<Section>('Global');
  const [syncState, setSyncState] = useState<SyncState>('disconnected');
  const [logs, setLogs] = useState<string[]>([]);
  const [showLog, setShowLog] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [baudRate, setBaudRate] = useState<number>(12000000);
  const [rawCommand, setRawCommand] = useState<string>('');
  const [programNumber, setProgramNumber] = useState<number>(0);


  const handlePatchReceived = useCallback((data: Uint8Array) => {
    const newPatch = parsePatchFromData(data, initialPatch);
    setPatch(newPatch);
    setSyncState('connected');
    addLog('System: Synthesizer state synced successfully!');
  }, []);

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev.slice(-200), `${new Date().toLocaleTimeString('en-US', { hour12: false })} - ${message}`]);
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);
  
  const { 
    connect, 
    disconnect, 
    sendParameter, 
    requestPatch, 
    sendRaw,
    injectPatch,
    readProgramFromEEPROM,
    writeProgramToEEPROM,
  } = useSerial({
      onPatchReceived: handlePatchReceived,
      onSyncStateChange: setSyncState,
      onLog: addLog,
  });

  const handleParamChange = useCallback((updateFunc: (p: SynthPatch) => SynthPatch, paramId?: number, value?: any) => {
      setPatch(prevPatch => {
          const updatedPatch = updateFunc(prevPatch);
          if (syncState === 'connected' && paramId !== undefined && value !== undefined) {
              const serialValue = typeof value === 'boolean' ? (value ? 1 : 0) : value;
              sendParameter(paramId, serialValue);
          }
          return updatedPatch;
      });
  }, [syncState, sendParameter]);

  const updatePatchName = useCallback((name: string) => {
      setPatch(p => ({...p, patchName: name}));
      if (syncState === 'connected') {
          const nameBytes = new TextEncoder().encode(name.padEnd(24, ' '));
          for (let i = 0; i < 24; i++) {
              const charCode = nameBytes[i] || 32;
              sendParameter(480 + i, charCode);
          }
      }
  }, [syncState, sendParameter]);


  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (syncState !== 'connected') {
        alert("Connect to the synth before loading a patch.");
        return;
    }
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            if (data.length === 512) {
                injectPatch(data);
                const newPatch = parsePatchFromData(data, patch);
                setPatch(newPatch);
                addLog(`System: Loaded patch "${newPatch.patchName.trim()}" from file.`);
            } else {
                alert(`Error: Invalid patch file. Expected 512 bytes, got ${data.length}.`);
            }
        };
        reader.readAsArrayBuffer(file);
    }
    event.target.value = '';
  };

  const handleFileSave = () => {
    const data = serializePatchToData(patch);
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${patch.patchName.trim() || 'preset'}.xva1`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog(`System: Saved patch "${patch.patchName.trim()}" to file.`);
  };

  const handleLoadFromSlot = async () => {
    if (syncState !== 'connected') return;
    const num = Math.max(0, Math.min(127, programNumber));
    await readProgramFromEEPROM(num);
  };

  const handleSaveToSlot = async () => {
      if (syncState !== 'connected') return;
      if (confirm(`Are you sure you want to overwrite program slot ${programNumber} on the synthesizer?`)) {
        const num = Math.max(0, Math.min(127, programNumber));
        await writeProgramToEEPROM(num);
      }
  };


  const handleManualSync = useCallback(async () => {
    if (syncState !== 'connected') {
        alert("Connect to the synthesizer first.");
        return;
    }
    await requestPatch();
  }, [syncState, requestPatch]);

  const handleConnect = useCallback(() => {
    if (syncState === 'connected') {
      disconnect();
    } else {
      connect(baudRate);
    }
  }, [syncState, connect, disconnect, baudRate]);
  
  const handleSendRaw = (e: React.FormEvent) => {
    e.preventDefault();
    if (rawCommand.trim() && syncState === 'connected') {
        sendRaw(rawCommand);
        setRawCommand('');
    } else if (syncState !== 'connected') {
        addLog("System: Cannot send command. Not connected.");
    }
  };

  const updateOscillator = useCallback(<K extends keyof Oscillator>(index: number, param: K, value: Oscillator[K]) => {
    const paramId = (parameterMap.oscillators[index] as Partial<Record<keyof Oscillator, number>>)?.[param];
    handleParamChange(p => {
      const newOscillators = [...p.oscillators];
      newOscillators[index] = { ...newOscillators[index], [param]: value };
      return { ...p, oscillators: newOscillators };
    }, paramId, value);
  }, [handleParamChange]);

  const updateFilter = useCallback(<K extends keyof Filter>(index: number, param: K, value: Filter[K]) => {
    const paramId = (parameterMap.filters[index] as Partial<Record<keyof Filter, number>>)?.[param];
    handleParamChange(p => {
      const newFilters = [...p.filters];
      newFilters[index] = { ...newFilters[index], [param]: value };
      return { ...p, filters: newFilters };
    }, paramId, value);
  }, [handleParamChange]);

  const updateLfo = useCallback(<K extends keyof LFO>(index: number, param: K, value: LFO[K]) => {
    const paramId = parameterMap.lfos[index]?.[param];
    handleParamChange(p => {
      const newLfos = [...p.lfos];
      newLfos[index] = { ...newLfos[index], [param]: value };
      return { ...p, lfos: newLfos };
    }, paramId, value);
  }, [handleParamChange]);

  const updateModulation = useCallback(<M extends keyof SynthPatch, P extends keyof (ModulationSource & DirectModulationSource)>(mod: M, param: P, value: (ModulationSource & DirectModulationSource)[P]) => {
      const paramId = (parameterMap as any)[mod]?.[param];
      handleParamChange(p => ({
          ...p,
          [mod]: { ...(p as any)[mod], [param]: value }
      }), paramId, value);
  }, [handleParamChange]);

  const updateEnvelope = useCallback(<K extends keyof Envelope, E extends keyof SynthPatch['envelopes']>(env: E, param: K, value: Envelope[K]) => {
    const paramId = (parameterMap.envelopes as any)[env]?.[param];
     handleParamChange(p => ({
      ...p,
      envelopes: {
        ...p.envelopes,
        [env]: { ...p.envelopes[env], [param]: value }
      }
    }), paramId, value);
  }, [handleParamChange]);
  
  const updateArpeggiator = useCallback(<K extends keyof Arpeggiator>(param: K, value: Arpeggiator[K]) => {
    const paramId = parameterMap.arpeggiator[param];
    handleParamChange(p => ({...p, arpeggiator: {...p.arpeggiator, [param]: value}}), paramId, value);
  }, [handleParamChange]);

  const updateStepSequencer = useCallback(<K extends keyof StepSequencer>(param: K, value: StepSequencer[K]) => {
      handleParamChange(p => {
          const newPatch = { ...p, stepSequencer: { ...p.stepSequencer, [param]: value } };
          
          if (param === 'stepValues' && syncState === 'connected') {
              const oldSteps = p.stepSequencer.stepValues;
              const newSteps = value as number[];
              const changedIndex = newSteps.findIndex((val, i) => val !== oldSteps[i]);
              if (changedIndex !== -1) {
                  const paramId = parameterMap.stepSequencer.stepValues[changedIndex];
                  const serialValue = newSteps[changedIndex];
                  sendParameter(paramId, serialValue);
              }
          } else if (param !== 'stepValues') {
              const paramId = (parameterMap.stepSequencer as any)[param];
              if (syncState === 'connected') {
                // FIX: Add a type guard to ensure `value` is not an array.
                // TypeScript cannot infer that `param !== 'stepValues'` guarantees `value` is not `number[]`,
                // causing a type error in `sendParameter`.
                if (!Array.isArray(value)) {
                    const serialValue = typeof value === 'boolean' ? (value ? 1 : 0) : value;
                    sendParameter(paramId, serialValue);
                }
              }
          }
          return newPatch;
      });
  }, [handleParamChange, syncState, sendParameter]);

  const setParam = useCallback(<K extends keyof SynthPatch>(param: K, value: SynthPatch[K]) => {
    const paramId = (parameterMap as any)[param];
    handleParamChange(p => ({ ...p, [param]: value }), paramId, value);
  }, [handleParamChange]);

  const setEffectParam = useCallback(<E extends keyof SynthPatch['effects'], P extends keyof SynthPatch['effects'][E]>(effect: E, param: P, value: SynthPatch['effects'][E][P]) => {
    const paramId = (parameterMap.effects as any)[effect]?.[param];
    handleParamChange(p => ({
      ...p,
      effects: {
        ...p.effects,
        [effect]: { ...p.effects[effect], [param]: value }
      }
    }), paramId, value);
  }, [handleParamChange]);

  const renderSection = () => {
    switch (activeSection) {
      case 'Global':
        return <GlobalSection patch={patch} setParam={setParam} updateArpeggiator={updateArpeggiator} updateStepSequencer={updateStepSequencer} updatePatchName={updatePatchName} />;
      case 'Oscillators':
        return <OscillatorSection patch={patch} setParam={setParam} updateOscillator={updateOscillator} />;
      case 'Filters':
        return <FilterSection patch={patch} setParam={setParam} updateFilter={updateFilter} />;
      case 'LFOs':
        return <LfoSection patch={patch} setParam={setParam} updateLfo={updateLfo} />;
      case 'Envelopes':
        return <EnvelopeSection patch={patch} setParam={setParam} updateEnvelope={updateEnvelope} />;
      case 'Modulation':
        return <ModulationSection patch={patch} updateModulation={updateModulation} />;
      case 'Effects':
        return <EffectsSection patch={patch} setParam={setParam} setEffectParam={setEffectParam} />;
      default:
        return null;
    }
  };

  const NavButton = ({ section, children }: { section: Section; children: React.ReactNode }) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`flex flex-col items-center justify-center space-y-1 p-2 w-full rounded-lg transition-colors duration-200 ${
        activeSection === section ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );

  const getButtonState = () => {
    switch (syncState) {
        case 'disconnected': return { text: 'Connect', color: 'green', disabled: false };
        case 'connecting': return { text: 'Connecting...', color: 'gray', disabled: true };
        case 'initializing': return { text: 'Initializing...', color: 'gray', disabled: true };
        case 'syncing': return { text: 'Syncing...', color: 'gray', disabled: true };
        case 'connected': return { text: 'Disconnect', color: 'red', disabled: false };
        default: return { text: 'Connect', color: 'green', disabled: false };
    }
  }
  const {text: connectButtonText} = getButtonState();
  const isConnected = syncState === 'connected';
  const isConnecting = syncState === 'connecting' || syncState === 'initializing' || syncState === 'syncing';
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="absolute top-0 left-0 right-0 h-16 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 flex items-center px-4 z-20">
        <h1 className="text-xl font-bold text-white tracking-wider">XVA1 EDITOR</h1>
        <div className="ml-auto flex items-center space-x-2">
            <input type="file" ref={fileInputRef} onChange={handleFileLoad} accept=".xva1" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={!isConnected} className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">Load File</button>
            <button onClick={handleFileSave} className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">Save File</button>
            <button onClick={handleManualSync} disabled={!isConnected} className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">Sync</button>

            <div className="flex items-center space-x-2 border-l border-gray-600 pl-2">
                <label htmlFor="programSlot" className="text-sm font-medium">Slot:</label>
                <input
                  id="programSlot"
                  type="number"
                  min="0"
                  max="127"
                  value={programNumber}
                  onChange={(e) => setProgramNumber(Math.max(0, Math.min(127, Number(e.target.value))))}
                  disabled={!isConnected}
                  className="w-16 bg-gray-700 border-gray-600 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
                <button onClick={handleLoadFromSlot} disabled={!isConnected} className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">Load</button>
                <button onClick={handleSaveToSlot} disabled={!isConnected} className="px-3 py-2 text-sm bg-orange-600 hover:bg-orange-500 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">Save</button>
            </div>

            <div className="flex items-center space-x-2 border-l border-gray-600 pl-2">
                <div className="flex flex-col">
                    <label htmlFor="baudRate" className="text-xs text-gray-400 -mb-1">Baud</label>
                    <select
                        id="baudRate"
                        value={baudRate}
                        onChange={(e) => setBaudRate(Number(e.target.value))}
                        disabled={isConnecting || isConnected}
                        className="bg-gray-700 border-gray-600 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {BAUD_RATES.map(rate => <option key={rate} value={rate}>{rate}</option>)}
                    </select>
                </div>
                <button 
                    onClick={handleConnect} 
                    disabled={isConnecting}
                    className={`px-4 py-2 text-sm rounded-md transition-colors w-28 text-center self-end ${
                        isConnected ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'
                    } disabled:bg-gray-500 disabled:cursor-not-allowed`}
                >
                    {connectButtonText}
                </button>
                <span title={syncState} className={`w-3 h-3 rounded-full self-end mb-2 ${isConnected ? 'bg-green-400' : (isConnecting ? 'bg-yellow-400' : 'bg-red-400')}`}></span>
            </div>
             <button onClick={() => setShowLog(!showLog)} className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                {showLog ? "Log" : "Log"}
            </button>
        </div>
      </header>
      
      <nav className="w-24 bg-gray-800 pt-16 flex flex-col items-center space-y-2 py-4 z-10 border-r border-gray-700">
        <NavButton section="Global"><GlobalIcon /><span className="text-xs">Global</span></NavButton>
        <NavButton section="Oscillators"><OscillatorIcon /><span className="text-xs">OSC</span></NavButton>
        <NavButton section="Filters"><FilterIcon /><span className="text-xs">Filter</span></NavButton>
        <NavButton section="LFOs"><LfoIcon /><span className="text-xs">LFO</span></NavButton>
        <NavButton section="Envelopes"><EnvelopeIcon /><span className="text-xs">ENV</span></NavButton>
        <NavButton section="Modulation"><ModulationIcon /><span className="text-xs">Mod</span></NavButton>
        <NavButton section="Effects"><FxIcon /><span className="text-xs">FX</span></NavButton>
      </nav>

      <main className="flex-1 pt-16 overflow-y-auto" style={{ paddingBottom: showLog ? '200px' : '0' }}>
        <div className="p-4 md:p-6 lg:p-8">
            {renderSection()}
        </div>
      </main>
      
      {showLog && (
        <div className="fixed bottom-0 left-24 right-0 h-52 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700 z-30 flex flex-col">
            <div className="flex-shrink-0 px-4 py-1 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-bold">Serial Log</h3>
                <button onClick={() => setLogs([])} className="text-xs text-gray-400 hover:text-white">Clear</button>
            </div>
            <div ref={logContainerRef} className="flex-grow p-2 overflow-y-auto text-xs font-mono">
                <pre className="whitespace-pre-wrap">
                    {logs.join('\n')}
                </pre>
            </div>
            <form onSubmit={handleSendRaw} className="flex-shrink-0 p-2 border-t border-gray-700 flex items-center">
                <input 
                    type="text"
                    value={rawCommand}
                    onChange={e => setRawCommand(e.target.value)}
                    placeholder="Send raw command (e.g., 'd' or 'i')... "
                    className="flex-grow bg-gray-800 text-xs rounded-l-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={!isConnected}
                />
                <button type="submit" className="bg-blue-600 text-xs px-3 py-1 rounded-r-md hover:bg-blue-500 disabled:bg-gray-600" disabled={!isConnected}>
                    Send
                </button>
            </form>
        </div>
      )}
    </div>
  );
};

export default App;
