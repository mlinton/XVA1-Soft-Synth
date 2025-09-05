
import type { SynthPatch } from '../types';
import { parameterMap } from '../parameterMap';

/**
 * Serializes a SynthPatch object into a 512-byte Uint8Array for the synth.
 * @param patch The SynthPatch object to serialize.
 * @returns A 512-byte Uint8Array representing the patch data.
 */
export const serializePatchToData = (patch: SynthPatch): Uint8Array => {
  const data = new Uint8Array(512).fill(0);

  const set = (id: number | undefined, value: number | boolean) => {
    if (id === undefined || id >= data.length) return;
    data[id] = typeof value === 'boolean' ? (value ? 1 : 0) : Math.max(0, Math.min(255, Math.round(value)));
  };

  // Patch Name
  const encoder = new TextEncoder();
  const nameBytes = encoder.encode(patch.patchName.padEnd(24, ' '));
  data.set(nameBytes.slice(0, 24), 480);
  

  // Global
  set(parameterMap.transpose, patch.transpose);
  set(parameterMap.bendUp, patch.bendUp);
  set(parameterMap.bendDown, patch.bendDown);
  set(parameterMap.legatoMode, patch.legatoMode);
  set(parameterMap.portaMode, patch.portaMode);
  set(parameterMap.portaTime, patch.portaTime);
  set(parameterMap.volume, patch.volume);
  set(parameterMap.pan, patch.pan);
  set(parameterMap.velocityOffset, patch.velocityOffset);
  set(parameterMap.tuning, patch.tuning);
  set(parameterMap.tempOffset, patch.tempOffset);
  
  // Arpeggiator
  set(parameterMap.arpeggiator.mode, patch.arpeggiator.mode);
  set(parameterMap.arpeggiator.tempo, patch.arpeggiator.tempo);
  set(parameterMap.arpeggiator.mul, patch.arpeggiator.mul);
  set(parameterMap.arpeggiator.octaves, patch.arpeggiator.octaves);

  // Step Sequencer
  const seqMap = parameterMap.stepSequencer;
  set(seqMap.on, patch.stepSequencer.on);
  set(seqMap.velocity, patch.stepSequencer.velocity);
  set(seqMap.steps, patch.stepSequencer.steps);
  set(seqMap.tempo, patch.stepSequencer.tempo);
  set(seqMap.mul, patch.stepSequencer.mul);
  set(seqMap.transpose, patch.stepSequencer.transpose);
  patch.stepSequencer.stepValues.forEach((val, i) => set(seqMap.stepValues[i], val));

  // Oscillators
  set(parameterMap.oscSync, patch.oscSync);
  set(parameterMap.oscMode, patch.oscMode);
  set(parameterMap.oscPhase, patch.oscPhase);
  set(parameterMap.ringMod34, patch.ringMod34);
  patch.oscillators.forEach((osc, i) => {
    const oscMap = parameterMap.oscillators[i];
    set(oscMap.on, osc.on);
    set(oscMap.waveform, osc.waveform);
    set(oscMap.pulseWidth, osc.pulseWidth);
    set(oscMap.sawStackDetune, osc.sawStackDetune);
    set(oscMap.level, osc.level);
    set(oscMap.levelL, osc.levelL);
    set(oscMap.levelR, osc.levelR);
    set(oscMap.velocitySensitivity, osc.velocitySensitivity);
    set(oscMap.keyBreakpoint, osc.keyBreakpoint);
    set(oscMap.keyLDepth, osc.keyLDepth);
    set(oscMap.keyRDepth, osc.keyRDepth);
    set(oscMap.keyLCurve, osc.keyLCurve);
    set(oscMap.keyRCurve, osc.keyRCurve);
    set(oscMap.ams, osc.ampModSensitivity);
    set(oscMap.pms, osc.pitchModSensitivity);
    set(oscMap.transpose, osc.transpose);
    set(oscMap.tune, osc.tune);
    set(oscMap.drift, osc.drift);
  });
  
  // Filters
  set(parameterMap.filterType, patch.filterType);
  set(parameterMap.filterVelocity, patch.filterVelocity);
  set(parameterMap.filterRouting, patch.filterRouting);
  patch.filters.forEach((filter, i) => {
      const filterMap = parameterMap.filters[i];
      set(filterMap.cutoff1, filter.cutoff1);
      set(filterMap.cutoff2, filter.cutoff2);
      set(filterMap.resonance1, filter.resonance1);
      set(filterMap.resonance2, filter.resonance2);
      set(filterMap.kbdTrack, filter.kbdTrack);
      set(filterMap.egDepth, filter.egDepth);
      set(filterMap.egVelocity, filter.egVelocity);
      set(filterMap.velocityReso, filter.velocityReso);
      set(filterMap.kbdTrackReso, filter.kbdTrackReso);
      set(filterMap.drive, filter.drive);
  });
  
  // LFOs
  patch.lfos.forEach((lfo, i) => {
    const lfoMap = parameterMap.lfos[i];
    set(lfoMap.wave, lfo.wave);
    set(lfoMap.range, lfo.range);
    set(lfoMap.speed, lfo.speed);
    set(lfoMap.sync, lfo.sync);
    set(lfoMap.fade, lfo.fade);
  });
  set(parameterMap.lfo1DepthPitch, patch.lfo1DepthPitch);
  set(parameterMap.lfo1DepthAmp, patch.lfo1DepthAmp);
  set(parameterMap.lfo2DepthPW, patch.lfo2DepthPW);
  set(parameterMap.lfo2DepthCutoff, patch.lfo2DepthCutoff);

  // Envelopes
  set(parameterMap.egLoop, patch.egLoop);
  set(parameterMap.egLoopSeg, patch.egLoopSeg);
  set(parameterMap.egRestart, patch.egRestart);
  const envs = ['pitch', 'filter', 'amp'] as const;
  envs.forEach(envName => {
    const envMap = parameterMap.envelopes[envName];
    const envState = patch.envelopes[envName];
    for (const key in envMap) {
        if (key in envState) {
            set((envMap as any)[key], (envState as any)[key]);
        }
    }
  });

  // Effects
  const fxMap = parameterMap.effects;
  for(const effectKey in fxMap){
      const effectName = effectKey as keyof typeof fxMap;
      const effectState = patch.effects[effectName];
      const effectParamMap = fxMap[effectName];
      for(const paramKey in effectParamMap) {
          const paramName = paramKey as keyof typeof effectState;
          const paramId = (effectParamMap as any)[paramName];
          set(paramId, (effectState as any)[paramName]);
      }
  }
  set(parameterMap.fxRouting, patch.fxRouting);
  set(parameterMap.outputLevel, patch.outputLevel);
  set(parameterMap.gainPre, patch.gainPre);
  set(parameterMap.gainPost, patch.gainPost);
  
  return data;
};
