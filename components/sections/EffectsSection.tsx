import React from 'react';
import type { SynthPatch } from '../../types';
import Knob from '../Knob';
import Section from '../Section';
import { Checkbox, Select, Slider } from '../ParameterControls';
import { 
    FX_ROUTING_OPTIONS, GAIN_OPTIONS, BANDWIDTH_OPTIONS, DISTORTION_TYPE_OPTIONS,
    CHORUS_MODE_OPTIONS, PHASER_MODE_OPTIONS, DELAY_MODE_OPTIONS, REVERB_MODE_OPTIONS, GATE_CURVE_OPTIONS
} from '../../constants';

interface EffectsSectionProps {
  patch: SynthPatch;
  setEffectParam: <E extends keyof SynthPatch['effects'], P extends keyof SynthPatch['effects'][E]>(effect: E, param: P, value: SynthPatch['effects'][E][P]) => void;
  setParam: <K extends keyof SynthPatch>(param: K, value: SynthPatch[K]) => void;
}

const EffectsSection: React.FC<EffectsSectionProps> = ({ patch, setEffectParam, setParam }) => {
  const { effects } = patch;
  return (
    <div className="space-y-6">
      <Section title="Master Effects Routing & Gain">
        <Select label="FX Routing" options={FX_ROUTING_OPTIONS} value={patch.fxRouting} onChange={v => setParam('fxRouting', v)}/>
        <Select label="Pre Gain" options={GAIN_OPTIONS} value={patch.gainPre} onChange={v => setParam('gainPre', v)}/>
        <Select label="Post Gain" options={GAIN_OPTIONS} value={patch.gainPost} onChange={v => setParam('gainPost', v)}/>
        <Knob label="Output Level" value={patch.outputLevel} onChange={v => setParam('outputLevel', v)} />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Bandwidth Adjust">
            <Select label="Bandwidth" options={BANDWIDTH_OPTIONS} value={effects.bandwidth.value} onChange={v => setEffectParam('bandwidth', 'value', v)} />
        </Section>
        <Section title="Distortion">
            <Checkbox label="On" checked={effects.distortion.on} onChange={v => setEffectParam('distortion', 'on', v)} />
            <Select label="Type" options={DISTORTION_TYPE_OPTIONS} value={effects.distortion.type} onChange={v => setEffectParam('distortion', 'type', v)} />
            <Knob label="Pre Gain" value={effects.distortion.gainPre} onChange={v => setEffectParam('distortion', 'gainPre', v)} />
            <Knob label="Post Gain" value={effects.distortion.gainPost} onChange={v => setEffectParam('distortion', 'gainPost', v)} />
            <Select label="Post Filter" options={BANDWIDTH_OPTIONS} value={effects.distortion.filterPost} onChange={v => setEffectParam('distortion', 'filterPost', v)} />
        </Section>
        <Section title="Lo-Fi">
            <Knob label="Bitcrush" value={effects.bitcrusher.depth} onChange={v => setEffectParam('bitcrusher', 'depth', v)} />
            <Knob label="Decimate" value={effects.decimator.depth} onChange={v => setEffectParam('decimator', 'depth', v)} />
        </Section>
        <Section title="Post-LoFi Filter">
            <Knob label="Low Pass" value={effects.filter.lo} onChange={v => setEffectParam('filter', 'lo', v)} />
            <Knob label="High Pass" value={effects.filter.hi} onChange={v => setEffectParam('filter', 'hi', v)} />
        </Section>
      </div>
      
      <Section title="Chorus / Flanger">
        <Select label="Mode" options={CHORUS_MODE_OPTIONS} value={effects.chorus.mode} onChange={v => setEffectParam('chorus', 'mode', v)} />
        <Knob label="Dry" value={effects.chorus.dry} onChange={v => setEffectParam('chorus', 'dry', v)} />
        <Knob label="Wet" value={effects.chorus.wet} onChange={v => setEffectParam('chorus', 'wet', v)} />
        <Knob label="Speed" value={effects.chorus.speed} onChange={v => setEffectParam('chorus', 'speed', v)} />
        <Knob label="Depth" value={effects.chorus.depth} onChange={v => setEffectParam('chorus', 'depth', v)} />
        <Knob label="Feedback" value={effects.chorus.feedback} onChange={v => setEffectParam('chorus', 'feedback', v)} />
        <Knob label="LR Phase" bipolar value={effects.chorus.lrPhase} onChange={v => setEffectParam('chorus', 'lrPhase', v)} />
      </Section>
      
      <Section title="Phaser">
        <Select label="Mode" options={PHASER_MODE_OPTIONS} value={effects.phaser.mode} onChange={v => setEffectParam('phaser', 'mode', v)} />
        <Slider label="Stages" min={4} max={12} step={1} value={effects.phaser.stages} onChange={v => setEffectParam('phaser', 'stages', v)} />
        <Knob label="Dry" value={effects.phaser.dry} onChange={v => setEffectParam('phaser', 'dry', v)} />
        <Knob label="Wet" value={effects.phaser.wet} onChange={v => setEffectParam('phaser', 'wet', v)} />
        <Knob label="Speed" value={effects.phaser.speed} onChange={v => setEffectParam('phaser', 'speed', v)} />
        <Knob label="Depth" value={effects.phaser.depth} onChange={v => setEffectParam('phaser', 'depth', v)} />
        <Knob label="Offset" value={effects.phaser.offset} onChange={v => setEffectParam('phaser', 'offset', v)} />
        <Knob label="Feedback" value={effects.phaser.feedback} onChange={v => setEffectParam('phaser', 'feedback', v)} />
        <Knob label="LR Phase" bipolar value={effects.phaser.lrPhase} onChange={v => setEffectParam('phaser', 'lrPhase', v)} />
      </Section>

      <Section title="Delay">
        <Select label="Mode" options={DELAY_MODE_OPTIONS} value={effects.delay.mode} onChange={v => setEffectParam('delay', 'mode', v)} />
        <Checkbox label="2x Time" checked={effects.delay.doublingOn} onChange={v => setEffectParam('delay', 'doublingOn', v)} />
        <Knob label="Dry" value={effects.delay.dry} onChange={v => setEffectParam('delay', 'dry', v)} />
        <Knob label="Wet" value={effects.delay.wet} onChange={v => setEffectParam('delay', 'wet', v)} />
        <Knob label="Time" value={effects.delay.time} onChange={v => setEffectParam('delay', 'time', v)} />
        <Knob label="Feedback" value={effects.delay.feedback} onChange={v => setEffectParam('delay', 'feedback', v)} />
        <Knob label="LP Filter" value={effects.delay.lo} onChange={v => setEffectParam('delay', 'lo', v)} />
        <Knob label="HP Filter" value={effects.delay.hi} onChange={v => setEffectParam('delay', 'hi', v)} />
        <Knob label="Mod Speed" value={effects.delay.modSpeed} onChange={v => setEffectParam('delay', 'modSpeed', v)} />
        <Knob label="Mod Depth" value={effects.delay.modDepth} onChange={v => setEffectParam('delay', 'modDepth', v)} />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Reverb">
            <Select label="Mode" options={REVERB_MODE_OPTIONS} value={effects.reverb.mode} onChange={v => setEffectParam('reverb', 'mode', v)} />
            <Knob label="Dry" value={effects.reverb.dry} onChange={v => setEffectParam('reverb', 'dry', v)} />
            <Knob label="Wet" value={effects.reverb.wet} onChange={v => setEffectParam('reverb', 'wet', v)} />
            <Knob label="Decay" value={effects.reverb.decay} onChange={v => setEffectParam('reverb', 'decay', v)} />
            <Knob label="Damp" value={effects.reverb.damp} onChange={v => setEffectParam('reverb', 'damp', v)} />
            <Knob label="HPF" value={effects.reverb.hpf} onChange={v => setEffectParam('reverb', 'hpf', v)} />
        </Section>
        <Section title="Gate">
            <Checkbox label="On" checked={effects.gate.on} onChange={v => setEffectParam('gate', 'on', v)} />
            <Select label="Curve" options={GATE_CURVE_OPTIONS} value={effects.gate.curve} onChange={v => setEffectParam('gate', 'curve', v)} />
            <Knob label="Attack" value={effects.gate.attack} onChange={v => setEffectParam('gate', 'attack', v)} />
            <Knob label="Release" value={effects.gate.release} onChange={v => setEffectParam('gate', 'release', v)} />
        </Section>
      </div>

    </div>
  );
};

export default EffectsSection;