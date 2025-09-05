import React from 'react';
import type { Envelope, SynthPatch } from '../../types';
import Section from '../Section';
import { Slider } from '../ParameterControls';
import BitwiseCheckbox from '../BitwiseCheckbox';

interface EnvelopeEditorProps {
    env: Envelope;
    name: 'pitch' | 'filter' | 'amp';
    isPitch?: boolean;
    pitchParams?: { range: number, velo: number };
    update: <K extends keyof (Envelope & { range?: number; velo?: number })>(env: any, param: K, value: (Envelope & { range?: number; velo?: number })[K]) => void;
}

const EnvelopeEditor: React.FC<EnvelopeEditorProps> = ({ env, name, update, isPitch = false, pitchParams }) => {
    const bipolarProps = (paramName: keyof Envelope) => {
        if (!isPitch) return {};
        const center = ['startLevel', 'attackLevel', 'decay1Level', 'sustainLevel', 'release1Level', 'release2Level'].includes(paramName) ? 128 : 0;
        return { 
            displayValue: env[paramName] - center,
        };
    };

    return (
        <Section title={`${name.charAt(0).toUpperCase() + name.slice(1)} Envelope`}>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {/* Rates */}
                <Slider label="Delay (R0)" value={env.delay} onChange={v => update(name, 'delay', v)} {...bipolarProps('delay')} />
                <Slider label="Attack Time (R1)" value={env.attackTime} onChange={v => update(name, 'attackTime', v)} {...bipolarProps('attackTime')} />
                <Slider label="Decay 1 Time (R2)" value={env.decay1Time} onChange={v => update(name, 'decay1Time', v)} {...bipolarProps('decay1Time')} />
                <Slider label="Decay 2 Time (R3)" value={env.decay2Time} onChange={v => update(name, 'decay2Time', v)} {...bipolarProps('decay2Time')} />
                <Slider label="Release 1 Time (R4)" value={env.release1Time} onChange={v => update(name, 'release1Time', v)} {...bipolarProps('release1Time')} />
                <Slider label="Release 2 Time (R5)" value={env.release2Time} onChange={v => update(name, 'release2Time', v)} {...bipolarProps('release2Time')} />

                {/* Levels */}
                <Slider label="Start Level (L0)" value={env.startLevel} onChange={v => update(name, 'startLevel', v)} {...bipolarProps('startLevel')} />
                <Slider label="Attack Level (L1)" value={env.attackLevel} onChange={v => update(name, 'attackLevel', v)} {...bipolarProps('attackLevel')} />
                <Slider label="Decay 1 Level (L2)" value={env.decay1Level} onChange={v => update(name, 'decay1Level', v)} {...bipolarProps('decay1Level')} />
                <Slider label="Sustain Level (L3)" value={env.sustainLevel} onChange={v => update(name, 'sustainLevel', v)} {...bipolarProps('sustainLevel')} />
                <Slider label="Release 1 Level (L4)" value={env.release1Level} onChange={v => update(name, 'release1Level', v)} {...bipolarProps('release1Level')} />
                <Slider label="Release 2 Level (L5)" value={env.release2Level} onChange={v => update(name, 'release2Level', v)} {...bipolarProps('release2Level')} />

                {/* Other */}
                 <Slider label="Rate Key" value={env.rateKey} onChange={v => update(name, 'rateKey', v)} {...bipolarProps('rateKey')} />
                {isPitch && pitchParams && (
                    <>
                        <Slider label="Range" min={0} max={48} value={pitchParams.range} onChange={v => update(name, 'range' as any, v)} />
                        <Slider label="Velocity" min={0} max={48} value={pitchParams.velo} onChange={v => update(name, 'velo' as any, v)} />
                    </>
                )}
            </div>
        </Section>
    )
}

interface EnvelopeSectionProps {
  patch: SynthPatch;
  updateEnvelope: <K extends keyof Envelope, E extends keyof SynthPatch['envelopes']>(env: E, param: K, value: Envelope[K]) => void;
  setParam: <K extends keyof SynthPatch>(param: K, value: SynthPatch[K]) => void;
}

const EnvelopeSection: React.FC<EnvelopeSectionProps> = ({ patch, updateEnvelope, setParam }) => {
  return (
    <div className="space-y-6">
        <Section title="Common Envelope Settings">
            <div className="flex flex-col space-y-2">
                <span className="text-sm font-semibold">EG Loop</span>
                <div className="flex space-x-4">
                    <BitwiseCheckbox label="Pitch" bit={2} value={patch.egLoop} onChange={v => setParam('egLoop', v)} />
                    <BitwiseCheckbox label="Filter" bit={1} value={patch.egLoop} onChange={v => setParam('egLoop', v)} />
                    <BitwiseCheckbox label="Amp" bit={0} value={patch.egLoop} onChange={v => setParam('egLoop', v)} />
                </div>
            </div>
             <div className="flex flex-col space-y-2">
                <span className="text-sm font-semibold">EG Loop Segment (0=Attack, 1=Decay1)</span>
                <div className="flex space-x-4">
                    <BitwiseCheckbox label="Pitch" bit={2} value={patch.egLoopSeg} onChange={v => setParam('egLoopSeg', v)} />
                    <BitwiseCheckbox label="Filter" bit={1} value={patch.egLoopSeg} onChange={v => setParam('egLoopSeg', v)} />
                    <BitwiseCheckbox label="Amp" bit={0} value={patch.egLoopSeg} onChange={v => setParam('egLoopSeg', v)} />
                </div>
            </div>
             <div className="flex flex-col space-y-2">
                <span className="text-sm font-semibold">EG Restart</span>
                <div className="flex space-x-4">
                    <BitwiseCheckbox label="Pitch" bit={2} value={patch.egRestart} onChange={v => setParam('egRestart', v)} />
                    <BitwiseCheckbox label="Filter" bit={1} value={patch.egRestart} onChange={v => setParam('egRestart', v)} />
                    <BitwiseCheckbox label="Amp" bit={0} value={patch.egRestart} onChange={v => setParam('egRestart', v)} />
                </div>
            </div>
        </Section>
      <EnvelopeEditor 
        env={patch.envelopes.pitch} 
        name="pitch" 
        isPitch 
        pitchParams={{range: patch.envelopes.pitch.range, velo: patch.envelopes.pitch.velo}}
        update={updateEnvelope as any} 
      />
      <EnvelopeEditor 
        env={patch.envelopes.filter} 
        name="filter" 
        update={updateEnvelope as any} 
      />
      <EnvelopeEditor 
        env={patch.envelopes.amp} 
        name="amp" 
        update={updateEnvelope as any}
      />
    </div>
  );
};

export default EnvelopeSection;
