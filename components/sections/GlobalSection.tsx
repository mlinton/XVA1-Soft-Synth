
import React from 'react';
import type { SynthPatch, Arpeggiator, StepSequencer } from '../../types';
import Knob from '../Knob';
import Section from '../Section';
import { Select } from '../ParameterControls';
import { ARP_MODE_OPTIONS } from '../../constants';
import StepSequencerEditor from '../StepSequencer';


interface GlobalSectionProps {
  patch: SynthPatch;
  setParam: <K extends keyof SynthPatch>(param: K, value: SynthPatch[K]) => void;
  updateArpeggiator: <K extends keyof Arpeggiator>(param: K, value: Arpeggiator[K]) => void;
  updateStepSequencer: <K extends keyof StepSequencer>(param: K, value: StepSequencer[K]) => void;
  updatePatchName: (name: string) => void;
}

const GlobalSection: React.FC<GlobalSectionProps> = ({ patch, setParam, updateArpeggiator, updateStepSequencer, updatePatchName }) => {
  return (
    <div className="space-y-6">
        <Section title="Patch Settings">
             <div className="flex flex-col space-y-1 w-64">
                <label htmlFor="patchName" className="text-xs text-gray-400 uppercase tracking-wider">Patch Name</label>
                <input
                    id="patchName"
                    type="text"
                    value={patch.patchName}
                    onChange={(e) => updatePatchName(e.target.value)}
                    maxLength={24}
                    className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </Section>
        <Section title="Global Settings">
            <Knob label="Volume" value={patch.volume} onChange={v => setParam('volume', v)} />
            <Knob label="Pan" value={patch.pan} bipolar onChange={v => setParam('pan', v)} />
            <Knob label="Transpose" value={patch.transpose} bipolar onChange={v => setParam('transpose', v)} />
            <Knob label="Bend Up" min={0} max={48} value={patch.bendUp} onChange={v => setParam('bendUp', v)} />
            <Knob label="Bend Down" min={0} max={48} value={patch.bendDown} onChange={v => setParam('bendDown', v)} />
            <Knob label="Velo Offset" bipolar value={patch.velocityOffset} onChange={v => setParam('velocityOffset', v)} />
            <Knob label="Temp Offset" bipolar value={patch.tempOffset} onChange={v => setParam('tempOffset', v)} />
        </Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Portamento">
                <Knob label="Time" value={patch.portaTime} onChange={v => setParam('portaTime', v)} />
                <Select label="Mode" options={['Off', 'Always', 'Fingered']} value={patch.portaMode} onChange={v => setParam('portaMode', v)} />
                <Select label="Legato" options={['Poly', 'Mono']} value={patch.legatoMode} onChange={v => setParam('legatoMode', v)} />
            </Section>
            <Section title="Arpeggiator">
                <Select label="Mode" options={ARP_MODE_OPTIONS} value={patch.arpeggiator.mode} onChange={v => updateArpeggiator('mode', v)} />
                <Knob label="Tempo" min={50} max={255} value={patch.arpeggiator.tempo} onChange={v => updateArpeggiator('tempo', v)} />
                <Knob label="Octaves" min={1} max={8} value={patch.arpeggiator.octaves} onChange={v => updateArpeggiator('octaves', v)} />
            </Section>
        </div>
        <Section title="Step Sequencer">
            <StepSequencerEditor sequencer={patch.stepSequencer} update={updateStepSequencer} />
        </Section>
    </div>
  );
};

export default GlobalSection;
