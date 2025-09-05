import React from 'react';
import type { SynthPatch, ModulationSource, DirectModulationSource } from '../../types';
import Knob from '../Knob';
import Section from '../Section';

interface ModulationSectionProps {
  patch: SynthPatch;
  updateModulation: <M extends keyof SynthPatch, P extends keyof (ModulationSource & DirectModulationSource)>(mod: M, param: P, value: (ModulationSource & DirectModulationSource)[P]) => void;
}

const ModSourceEditor: React.FC<{
    title: string;
    mod: ModulationSource;
    modKey: keyof SynthPatch;
    update: ModulationSectionProps['updateModulation']
}> = ({ title, mod, modKey, update }) => {
    return (
        <Section title={title}>
            <Knob label="Aftertouch" value={mod.after} bipolar onChange={v => update(modKey, 'after', v)} />
            <Knob label="Mod Wheel" value={mod.wheel} bipolar onChange={v => update(modKey, 'wheel', v)} />
            <Knob label="Breath" value={mod.breath} bipolar onChange={v => update(modKey, 'breath', v)} />
            <Knob label="Foot" value={mod.foot} bipolar onChange={v => update(modKey, 'foot', v)} />
        </Section>
    )
};

const DirectModSourceEditor: React.FC<{
    title: string;
    mod: DirectModulationSource;
    modKey: keyof SynthPatch;
    update: ModulationSectionProps['updateModulation']
}> = ({ title, mod, modKey, update }) => {
    return (
        <Section title={title}>
            <Knob label="Aftertouch" value={mod.after} bipolar onChange={v => update(modKey, 'after', v)} />
            <Knob label="Breath" value={mod.breath} bipolar onChange={v => update(modKey, 'breath', v)} />
            <Knob label="Foot" value={mod.foot} bipolar onChange={v => update(modKey, 'foot', v)} />
        </Section>
    )
};


const ModulationSection: React.FC<ModulationSectionProps> = ({ patch, updateModulation }) => {
  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-100">Performance Modulation</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DirectModSourceEditor title="Direct -> Pitch" mod={patch.pitchMod} modKey="pitchMod" update={updateModulation} />
            <DirectModSourceEditor title="Direct -> Pulse Width" mod={patch.pwMod} modKey="pwMod" update={updateModulation} />
            <DirectModSourceEditor title="Direct -> Filter Cutoff" mod={patch.cutoffMod} modKey="cutoffMod" update={updateModulation} />
            <DirectModSourceEditor title="Direct -> Volume" mod={patch.volumeMod} modKey="volumeMod" update={updateModulation} />
            <ModSourceEditor title="LFO -> Pitch" mod={patch.pitchLfoMod} modKey="pitchLfoMod" update={updateModulation} />
            <ModSourceEditor title="LFO -> Amplitude" mod={patch.ampLfoMod} modKey="ampLfoMod" update={updateModulation} />
            <ModSourceEditor title="LFO -> Filter Cutoff" mod={patch.cutoffLfoMod} modKey="cutoffLfoMod" update={updateModulation} />
            <ModSourceEditor title="LFO -> Pulse Width" mod={patch.pwLfoMod} modKey="pwLfoMod" update={updateModulation} />
        </div>
    </div>
  );
};

export default ModulationSection;