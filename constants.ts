
import type { SynthPatch } from './types';

export const WAVEFORM_OPTIONS = [
  "Saw Up", "Saw Down", "Square/Pulse", "Triangle", "Sine", "Noise", 
  "SawStack 3 Stereo", "SawStack 7 Mono", "SawStack 7 Stereo"
];

export const FILTER_TYPE_OPTIONS = [
  "Bypass", "1-pole LP", "2-pole LP", "3-pole LP", "4-pole LP",
  "1-pole HP", "2-pole HP", "3-pole HP", "4-pole HP",
  "2-pole BP", "4-pole BP", "2-pole BR", "4-pole BR",
  "Serial: 2LP -> 2LP", "Serial: 2LP -> 2BP", "Serial: 2LP -> 2HP",
  "Parallel: 2x LP", "Parallel: LP & BP", "Parallel: LP & HP",
  "Parallel: BP & BP", "Parallel: BP & HP", "Parallel: HP & HP"
];

export const FILTER_ROUTING_OPTIONS = ["Two parallel stereo", "Independent L/R"];
export const CURVE_OPTIONS = ["Decreases", "Increases"];

export const LFO_WAVE_OPTIONS = [
  "Triangle", "Square", "Saw Up", "Saw Down", "Sine",
  "Sine(x)+Sine(2x)", "Sine(x)+Sine(3x)", "Sine(x)^3", "Guitar", "Random"
];

export const LFO_SYNC_OPTIONS = ["Single, Free", "Single, Key", "Multi, Free", "Multi, Key"];

export const ARP_MODE_OPTIONS = ["Off", "Up", "Down", "Up/Down", "As Played", "Random"];

export const DISTORTION_TYPE_OPTIONS = ["Hard Clip", "Soft Clip", "Tube 12AX", "Tube DSL"];
export const BANDWIDTH_OPTIONS = ["48kHz", "20kHz", "18kHz", "16kHz", "14kHz", "12kHz", "10kHz", "8kHz"];
export const CHORUS_MODE_OPTIONS = ["Chorus Long", "Chorus Short", "Flanger Long", "Flanger Short"];
export const PHASER_MODE_OPTIONS = ["Mono", "Stereo", "Cross"];
export const DELAY_MODE_OPTIONS = ["Stereo", "Cross", "Bounce"];
export const REVERB_MODE_OPTIONS = ["Plate", "Hall"];
export const GATE_CURVE_OPTIONS = ["S-Shape 1", "S-Shape 2"];
export const FX_ROUTING_OPTIONS = ["Routing 1 (Pre-Delay)", "Routing 2 (Post-Delay)", "Bypass"];
export const GAIN_OPTIONS = ["0dB", "6dB", "12dB", "18dB"];


export const initialPatch: SynthPatch = {
  patchName: "Default Patch",
  transpose: 128, bendUp: 2, bendDown: 2, legatoMode: 0, portaMode: 0, portaTime: 0,
  volume: 128, pan: 128, velocityOffset: 0, tuning: 0, tempOffset: 0,
  
  arpeggiator: { mode: 0, tempo: 120, mul: 1, octaves: 2 },

  stepSequencer: {
    on: false, velocity: 100, steps: 16, tempo: 120, mul: 4, transpose: 128,
    stepValues: Array(16).fill(60),
  },

  oscillators: Array(4).fill(0).map((_, i) => ({
    on: i < 1, waveform: 11, pulseWidth: 128, sawStackDetune: 0,
    level: 255, levelL: 255, levelR: 255, velocitySensitivity: 40,
    keyBreakpoint: 60, keyLDepth: 0, keyRDepth: 0, keyLCurve: 0, keyRCurve: 0,
    ampModSensitivity: 255, pitchModSensitivity: 255,
    transpose: 128, tune: 128, drift: 255,
  })),

  oscSync: 15, oscMode: 0, oscPhase: 0, ringMod34: false,

  filterType: 1,
  filterVelocity: 0,
  filters: Array(2).fill({
    cutoff1: 36, cutoff2: 0, resonance1: 0, resonance2: 0,
    kbdTrack: 75, egDepth: 150, egVelocity: 220,
    velocityReso: 128, kbdTrackReso: 128, drive: 0,
  }),
  filterRouting: 0,

  lfos: Array(2).fill({ wave: 0, range: 1, speed: 128, sync: 3, fade: 255 }),
  lfo1DepthPitch: 5, lfo1DepthAmp: 0, lfo2DepthPW: 0, lfo2DepthCutoff: 0,
  
  pitchMod: { after: 128, breath: 128, foot: 128, temp: 128, vc0: 128, vc1: 128, rnd: 0 },
  pwMod: { after: 128, breath: 128, foot: 128, temp: 128, vc0: 128, vc1: 128, rnd: 0 },
  cutoffMod: { after: 128, breath: 128, foot: 128, temp: 128, vc0: 128, vc1: 128, rnd: 0 },
  volumeMod: { after: 128, breath: 128, foot: 128, temp: 128, vc0: 128, vc1: 128, rnd: 0 },
  
  pitchLfoMod: { after: 0, wheel: 72, breath: 0, foot: 0 },
  ampLfoMod: { after: 0, wheel: 0, breath: 0, foot: 0 },
  cutoffLfoMod: { after: 0, wheel: 77, breath: 0, foot: 0 },
  pwLfoMod: { after: 0, wheel: 0, breath: 0, foot: 0 },

  envelopes: {
    pitch: {
      delay: 110, startLevel: 80, attackLevel: 85, decay1Level: 90, sustainLevel: 95, release1Level: 100, release2Level: 105,
      attackTime: 115, decay1Time: 120, decay2Time: 125, release1Time: 130, release2Time: 135, rateKey: 0, range: 0, velo: 0,
    },
    filter: {
      delay: 111, startLevel: 81, attackLevel: 86, decay1Level: 91, sustainLevel: 96, release1Level: 101, release2Level: 106,
      attackTime: 116, decay1Time: 121, decay2Time: 126, release1Time: 131, release2Time: 136, rateKey: 0,
    },
    amp: {
      delay: 112, startLevel: 82, attackLevel: 87, decay1Level: 92, sustainLevel: 97, release1Level: 102, release2Level: 107,
      attackTime: 117, decay1Time: 122, decay2Time: 127, release1Time: 132, release2Time: 137, rateKey: 0,
    },
  },
  egLoop: 0, egLoopSeg: 0, egRestart: 0,

  effects: {
    bandwidth: { value: 0 },
    distortion: { on: false, type: 0, gainPre: 50, gainPost: 50, filterPost: 4 },
    bitcrusher: { depth: 0 },
    decimator: { depth: 0 },
    filter: { lo: 255, hi: 0 },
    chorus: { dry: 255, wet: 180, mode: 0, speed: 30, depth: 150, feedback: 100, lrPhase: 128 },
    phaser: { dry: 255, wet: 0, mode: 0, speed: 100, depth: 30, offset: 100, stages: 4, feedback: 100, lrPhase: 128 },
    ampMod: { depth: 0, speed: 150, range: 0, lrPhase: 128 },
    delay: { dry: 255, wet: 100, mode: 0, time: 100, feedback: 30, lo: 255, hi: 0, tempo: 120, mul: 1, div: 1, modSpeed: 100, modDepth: 5, smear: 0, doublingOn: false },
    earlyReflections: { dry: 255, wet: 0, room: 0, taps: 0, feedback: 0 },
    reverb: { dry: 255, wet: 0, mode: 0, decay: 200, damp: 200, hpf: 0, modSpeed: 100, modDepth: 10 },
    gate: { on: false, curve: 0, attack: 0, release: 0 },
  },
  fxRouting: 0,
  outputLevel: 160,
  gainPre: 2,
  gainPost: 2,
};
