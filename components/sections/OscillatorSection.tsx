import React from 'react';
import type { Oscillator, SynthPatch } from '../../types';
import { WAVEFORM_OPTIONS, CURVE_OPTIONS } from '../../constants';
import Knob from '../Knob';
import { Select, Checkbox } from '../ParameterControls';
import Section from '../Section';
import BitwiseCheckbox from '../BitwiseCheckbox';

interface OscillatorEditorProps {
  osc: Oscillator;
  index: number;
  update: <K extends keyof Oscillator>(index: number, param: K, value: Oscillator[K]) => void;
}

const OscillatorEditor: React.FC<OscillatorEditorProps> = ({ osc, index, update }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex-1 min-w-[340px]">
        <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-bold text-blue-300">Oscillator {index + 1}</h4>
            <Checkbox label="On" checked={osc.on} onChange={v => update(index, 'on', v)} />
        </div>
        <div className="flex flex-wrap gap-4">
            <Select label="Waveform" options={WAVEFORM_OPTIONS} value={osc.waveform} onChange={v => update(index, 'waveform', v)} />
            <Knob label="Pulse Width" value={osc.pulseWidth} onChange={v => update(index, 'pulseWidth', v)} />
            <Knob label="Level" value={osc.level} onChange={v => update(index, 'level', v)} />
            <Knob label="Tune" value={osc.tune} bipolar onChange={v => update(index, 'tune', v)} />
            <Knob label="Transpose" value={osc.transpose} bipolar onChange={v => update(index, 'transpose', v)} />
            <Knob label="Drift" value={osc.drift} onChange={v => update(index, 'drift', v)} />
            <Knob label="Velo Sens" value={osc.velocitySensitivity} onChange={v => update(index, 'velocitySensitivity', v)} />
            <Knob label="Pan L" value={osc.levelL} onChange={v => update(index, 'levelL', v)} />
            <Knob label="Pan R" value={osc.levelR} onChange={v => update(index, 'levelR', v)} />
            <Knob label="AMS" value={osc.ampModSensitivity} onChange={v => update(index, 'ampModSensitivity', v)} />
            <Knob label="PMS" value={osc.pitchModSensitivity} onChange={v => update(index, 'pitchModSensitivity', v)} />
        </div>
        <div className="mt-4 pt-4 border-t border-gray-600">
            <h5 className="text-sm font-semibold mb-2 text-gray-300">Keyboard Tracking</h5>
            <div className="flex flex-wrap gap-4">
                <Knob label="Breakpoint" min={0} max={127} value={osc.keyBreakpoint} onChange={v => update(index, 'keyBreakpoint', v)} />
                <Knob label="Left Depth" value={osc.keyLDepth} onChange={v => update(index, 'keyLDepth', v)} />
                <Select label="Left Curve" options={CURVE_OPTIONS} value={osc.keyLCurve} onChange={v => update(index, 'keyLCurve', v)} />
                <Knob label="Right Depth" value={osc.keyRDepth} onChange={v => update(index, 'keyRDepth', v)} />
                <Select label="Right Curve" options={CURVE_OPTIONS} value={osc.keyRCurve} onChange={v => update(index, 'keyRCurve', v)} />
            </div>
        </div>
    </div>
  );
};

interface OscillatorSectionProps {
  patch: SynthPatch;
  updateOscillator: <K extends keyof Oscillator>(index: number, param: K, value: Oscillator[K]) => void;
  setParam: <K extends keyof SynthPatch>(param: K, value: SynthPatch[K]) => void;
}

const OscillatorSection: React.FC<OscillatorSectionProps> = ({ patch, updateOscillator, setParam }) => {
  return (
    <div className="space-y-6">
        <Section title="Common Oscillator Settings">
            <div className="flex flex-col space-y-2">
                <span className="text-sm font-semibold">Phase Sync</span>
                <div className="flex space-x-4">
                    {[...Array(4)].map((_, i) => <BitwiseCheckbox key={i} label={`OSC${i+1}`} bit={i} value={patch.oscSync} onChange={v => setParam('oscSync', v)} />)}
                </div>
            </div>
            <div className="flex flex-col space-y-2">
                <span className="text-sm font-semibold">Key Track</span>
                <div className="flex space-x-4">
                    {[...Array(4)].map((_, i) => <BitwiseCheckbox key={i} label={`OSC${i+1}`} bit={i} value={patch.oscMode} onChange={v => setParam('oscMode', v)} />)}
                </div>
            </div>
             <Select label="Initial Phase" options={['0°', '90°', '180°']} value={patch.oscPhase} onChange={v => setParam('oscPhase', v)} />
             <Checkbox label="Ring Mod 3-4" checked={patch.ringMod34} onChange={v => setParam('ringMod34', v)} />
        </Section>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {patch.oscillators.map((osc, i) => (
                <OscillatorEditor key={i} osc={osc} index={i} update={updateOscillator} />
            ))}
        </div>
    </div>
  );
};

export default OscillatorSection;