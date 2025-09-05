
import type { SynthPatch } from '../types';
import { parameterMap } from '../parameterMap';

/**
 * Parses a 512-byte Uint8Array from the synth into a SynthPatch object.
 * @param data The 512-byte array from the XVA1 hardware.
 * @param basePatch A base patch structure to fill, typically initialPatch.
 * @returns A new SynthPatch object populated with data from the hardware.
 */
export const parsePatchFromData = (data: Uint8Array, basePatch: SynthPatch): SynthPatch => {
  if (data.length < 512) {
    console.error(`Received data is shorter than expected 512 bytes (got ${data.length}).`);
    return basePatch;
  }

  // Create a deep copy to avoid mutations
  const newPatch: SynthPatch = JSON.parse(JSON.stringify(basePatch));

  const get = (id: number | undefined, defaultValue: number = 0): number => {
    if (id === undefined || id >= data.length) return defaultValue;
    return data[id];
  };

  const getBool = (id: number | undefined, defaultValue: boolean = false): boolean => {
    if (id === undefined || id >= data.length) return defaultValue;
    return data[id] > 0; // Treat any non-zero as true
  }

  // Patch Name (offset 480, length 24)
  const nameBytes = data.slice(480, 480 + 24);
  newPatch.patchName = new TextDecoder().decode(nameBytes).trim();


  // Global
  newPatch.transpose = get(parameterMap.transpose);
  newPatch.bendUp = get(parameterMap.bendUp);
  newPatch.bendDown = get(parameterMap.bendDown);
  newPatch.legatoMode = get(parameterMap.legatoMode);
  newPatch.portaMode = get(parameterMap.portaMode);
  newPatch.portaTime = get(parameterMap.portaTime);
  newPatch.volume = get(parameterMap.volume);
  newPatch.pan = get(parameterMap.pan);
  newPatch.velocityOffset = get(parameterMap.velocityOffset);
  newPatch.tuning = get(parameterMap.tuning);
  newPatch.tempOffset = get(parameterMap.tempOffset);


  // Arpeggiator
  newPatch.arpeggiator.mode = get(parameterMap.arpeggiator.mode);
  newPatch.arpeggiator.tempo = get(parameterMap.arpeggiator.tempo);
  newPatch.arpeggiator.mul = get(parameterMap.arpeggiator.mul);
  newPatch.arpeggiator.octaves = get(parameterMap.arpeggiator.octaves);

  // Step Sequencer
  const seqMap = parameterMap.stepSequencer;
  newPatch.stepSequencer.on = getBool(seqMap.on);
  newPatch.stepSequencer.velocity = get(seqMap.velocity);
  newPatch.stepSequencer.steps = get(seqMap.steps);
  newPatch.stepSequencer.tempo = get(seqMap.tempo);
  newPatch.stepSequencer.mul = get(seqMap.mul);
  newPatch.stepSequencer.transpose = get(seqMap.transpose);
  newPatch.stepSequencer.stepValues = seqMap.stepValues.map(id => get(id));

  // Oscillators
  newPatch.oscSync = get(parameterMap.oscSync);
  newPatch.oscMode = get(parameterMap.oscMode);
  newPatch.oscPhase = get(parameterMap.oscPhase);
  newPatch.ringMod34 = getBool(parameterMap.ringMod34);
  for (let i = 0; i < 4; i++) {
    const oscMap = parameterMap.oscillators[i];
    if (oscMap) {
      const osc = newPatch.oscillators[i];
      osc.on = getBool(oscMap.on);
      osc.waveform = get(oscMap.waveform);
      osc.pulseWidth = get(oscMap.pulseWidth);
      osc.sawStackDetune = get(oscMap.sawStackDetune);
      osc.level = get(oscMap.level);
      osc.levelL = get(oscMap.levelL);
      osc.levelR = get(oscMap.levelR);
      osc.velocitySensitivity = get(oscMap.velocitySensitivity);
      osc.keyBreakpoint = get(oscMap.keyBreakpoint);
      osc.keyLDepth = get(oscMap.keyLDepth);
      osc.keyRDepth = get(oscMap.keyRDepth);
      osc.keyLCurve = get(oscMap.keyLCurve);
      osc.keyRCurve = get(oscMap.keyRCurve);
      osc.ampModSensitivity = get(oscMap.ams);
      osc.pitchModSensitivity = get(oscMap.pms);
      osc.transpose = get(oscMap.transpose);
      osc.tune = get(oscMap.tune);
      osc.drift = get(oscMap.drift);
    }
  }
  
  // Filters
  newPatch.filterType = get(parameterMap.filterType);
  newPatch.filterVelocity = get(parameterMap.filterVelocity);
  newPatch.filterRouting = get(parameterMap.filterRouting);
  for (let i = 0; i < 2; i++) {
    const filterMap = parameterMap.filters[i];
    if (filterMap) {
      const filter = newPatch.filters[i];
      filter.cutoff1 = get(filterMap.cutoff1);
      filter.cutoff2 = get(filterMap.cutoff2);
      filter.resonance1 = get(filterMap.resonance1);
      filter.resonance2 = get(filterMap.resonance2);
      filter.egDepth = get(filterMap.egDepth);
      filter.kbdTrack = get(filterMap.kbdTrack);
      filter.egVelocity = get(filterMap.egVelocity);
      filter.velocityReso = get(filterMap.velocityReso);
      filter.kbdTrackReso = get(filterMap.kbdTrackReso);
      filter.drive = get(filterMap.drive);
    }
  }

  // LFOs
  for(let i=0; i<2; i++) {
    const lfoMap = parameterMap.lfos[i];
    if (lfoMap) {
        const lfo = newPatch.lfos[i];
        lfo.wave = get(lfoMap.wave);
        lfo.range = get(lfoMap.range);
        lfo.speed = get(lfoMap.speed);
        lfo.sync = get(lfoMap.sync);
        lfo.fade = get(lfoMap.fade);
    }
  }
  newPatch.lfo1DepthPitch = get(parameterMap.lfo1DepthPitch);
  newPatch.lfo1DepthAmp = get(parameterMap.lfo1DepthAmp);
  newPatch.lfo2DepthPW = get(parameterMap.lfo2DepthPW);
  newPatch.lfo2DepthCutoff = get(parameterMap.lfo2DepthCutoff);

  // Envelopes
  newPatch.egLoop = get(parameterMap.egLoop);
  newPatch.egLoopSeg = get(parameterMap.egLoopSeg);
  newPatch.egRestart = get(parameterMap.egRestart);

  const envs = ['pitch', 'filter', 'amp'] as const;
  envs.forEach(envName => {
    const envMap = parameterMap.envelopes[envName];
    const envState = newPatch.envelopes[envName];
    for (const key in envMap) {
        if (key in envState) {
            (envState as any)[key] = get((envMap as any)[key]);
        }
    }
  });

  // Effects
  const fxMap = parameterMap.effects;
  for(const effectKey in fxMap){
      const effectName = effectKey as keyof typeof fxMap;
      const effectState = newPatch.effects[effectName];
      const effectParamMap = fxMap[effectName];
      for(const paramKey in effectParamMap) {
          const paramName = paramKey as keyof typeof effectState;
          const paramId = (effectParamMap as any)[paramName];
          (effectState as any)[paramName] = (paramName === 'on' || paramName === 'doublingOn') ? getBool(paramId) : get(paramId);
      }
  }
  newPatch.fxRouting = get(parameterMap.fxRouting);
  newPatch.outputLevel = get(parameterMap.outputLevel);
  newPatch.gainPre = get(parameterMap.gainPre);
  newPatch.gainPost = get(parameterMap.gainPost);


  return newPatch;
};
