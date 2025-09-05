import React from 'react';
import type { LFO, SynthPatch } from '../../types';
import { LFO_WAVE_OPTIONS, LFO_SYNC_OPTIONS } from '../../constants';
import Knob from '../Knob';
import { Select } from '../ParameterControls';
import Section from '../Section';

interface LfoEditorProps {
  lfo: LFO;
  index: number;
  update: <K extends keyof LFO>(index: number, param: K, value: LFO[K]) => void;
}

const LfoEditor: React.FC<LfoEditorProps> = ({ lfo, index, update }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex-1">
        <h4 className="text-md font-bold text-blue-300 mb-4">LFO {index + 1}</h4>
        <div className="flex flex-wrap gap-4">
            <Select label="Wave" options={LFO_WAVE_OPTIONS} value={lfo.wave} onChange={v => update(index, 'wave', v)} />
            <Select label="Sync" options={LFO_SYNC_OPTIONS} value={lfo.sync} onChange={v => update(index, 'sync', v)} />
            <Knob label="Speed" value={lfo.speed} onChange={v => update(index, 'speed', v)} />
            <Knob label="Range" value={lfo.range} onChange={v => update(index, 'range', v)} />
            <Knob label="Fade" value={lfo.fade} onChange={v => update(index, 'fade', v)} />
        </div>
    </div>
  );
};

interface LfoSectionProps {
  patch: SynthPatch;
  updateLfo: <K extends keyof LFO>(index: number, param: K, value: LFO[K]) => void;
  setParam: <K extends keyof SynthPatch>(param: K, value: SynthPatch[K]) => void;
}

const LfoSection: React.FC<LfoSectionProps> = ({ patch, updateLfo, setParam }) => {
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {patch.lfos.map((lfo, i) => (
                <LfoEditor key={i} lfo={lfo} index={i} update={updateLfo} />
            ))}
        </div>
        <Section title="LFO Fixed Depth">
             <Knob label="LFO1 -> Pitch" value={patch.lfo1DepthPitch} onChange={v => setParam('lfo1DepthPitch', v)} />
             <Knob label="LFO1 -> Amp" value={patch.lfo1DepthAmp} onChange={v => setParam('lfo1DepthAmp', v)} />
             <Knob label="LFO2 -> PW" value={patch.lfo2DepthPW} onChange={v => setParam('lfo2DepthPW', v)} />
             <Knob label="LFO2 -> Cutoff" value={patch.lfo2DepthCutoff} onChange={v => setParam('lfo2DepthCutoff', v)} />
        </Section>
    </div>
  );
};

export default LfoSection;
