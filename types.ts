
export type Section = 'Global' | 'Oscillators' | 'Filters' | 'LFOs' | 'Envelopes' | 'Modulation' | 'Effects';

export interface Oscillator {
  on: boolean;
  waveform: number;
  pulseWidth: number;
  sawStackDetune: number;
  level: number;
  levelL: number;
  levelR: number;
  velocitySensitivity: number;
  keyBreakpoint: number;
  keyLDepth: number;
  keyRDepth: number;
  keyLCurve: number;
  keyRCurve: number;
  ampModSensitivity: number;
  pitchModSensitivity: number;
  transpose: number;
  tune: number;
  drift: number;
}

export interface Filter {
  cutoff1: number;
  cutoff2: number;
  resonance1: number;
  resonance2: number;
  kbdTrack: number;
  egDepth: number;
  egVelocity: number;
  velocityReso: number;
  kbdTrackReso: number;
  drive: number; // Merged driveOn and driveAmount
}

export interface LFO {
    wave: number;
    range: number;
    speed: number;
    sync: number;
    fade: number;
}

export interface ModulationSource {
    after: number;
    wheel: number;
    breath: number;
    foot: number;
}

export interface DirectModulationSource {
    after: number;
    breath: number;
    foot: number;
    temp: number;
    vc0: number;
    vc1: number;
    rnd: number;
}


// 7-stage DAD1D2SR1R2 Envelope
export interface Envelope {
    delay: number;        // R0
    startLevel: number;   // L0
    attackLevel: number;  // L1
    decay1Level: number;  // L2
    sustainLevel: number; // L3
    release1Level: number;// L4
    release2Level: number;// L5
    attackTime: number;   // R1
    decay1Time: number;   // R2
    decay2Time: number;   // R3
    release1Time: number; // R4
    release2Time: number; // R5
    rateKey: number;
}

export interface Arpeggiator {
  mode: number;
  tempo: number;
  mul: number;
  octaves: number;
}

export interface StepSequencer {
    on: boolean;
    velocity: number;
    steps: number;
    tempo: number;
    mul: number;
    transpose: number;
    stepValues: number[]; // 16 values
}

export interface Effects {
    bandwidth: { value: number };
    distortion: { on: boolean; type: number; gainPre: number; gainPost: number; filterPost: number };
    bitcrusher: { depth: number };
    decimator: { depth: number };
    filter: { lo: number; hi: number };
    chorus: { dry: number; wet: number; mode: number; speed: number; depth: number; feedback: number; lrPhase: number };
    phaser: { dry: number; wet: number; mode: number; speed: number; depth: number; offset: number; stages: number; feedback: number; lrPhase: number };
    ampMod: { depth: number; speed: number; range: number; lrPhase: number };
    delay: { dry: number; wet: number; mode: number; time: number; feedback: number; lo: number; hi: number; tempo: number; mul: number; div: number; modSpeed: number; modDepth: number; smear: number; doublingOn: boolean; };
    earlyReflections: { dry: number; wet: number; room: number; taps: number; feedback: number };
    reverb: { dry: number; wet: number; mode: number; decay: number; damp: number; hpf: number; modSpeed: number; modDepth: number };
    gate: { on: boolean; curve: number; attack: number; release: number };
}

export interface SynthPatch {
  patchName: string;

  // Global
  transpose: number;
  bendUp: number;
  bendDown: number;
  legatoMode: number;
  portaMode: number;
  portaTime: number;
  volume: number;
  pan: number;
  velocityOffset: number;
  tuning: number;
  tempOffset: number;
  
  // Arpeggiator
  arpeggiator: Arpeggiator;

  // Step Sequencer
  stepSequencer: StepSequencer;

  // Oscillators
  oscillators: Oscillator[];
  oscSync: number; // Bitwise
  oscMode: number; // Bitwise
  oscPhase: number;
  ringMod34: boolean;
  
  // Filters
  filters: Filter[];
  filterType: number;
  filterVelocity: number;
  filterRouting: number;

  // LFOs
  lfos: LFO[];
  lfo1DepthPitch: number;
  lfo1DepthAmp: number;
  lfo2DepthPW: number;
  lfo2DepthCutoff: number;

  // Modulation Matrix / Performance Controls
  pitchMod: DirectModulationSource;
  pwMod: DirectModulationSource;
  cutoffMod: DirectModulationSource;
  volumeMod: DirectModulationSource;
  pitchLfoMod: ModulationSource;
  ampLfoMod: ModulationSource;
  cutoffLfoMod: ModulationSource;
  pwLfoMod: ModulationSource;

  // Envelopes
  envelopes: {
    pitch: Envelope & { range: number; velo: number; };
    filter: Envelope;
    amp: Envelope;
  };
  egLoop: number; // Bitwise
  egLoopSeg: number; // Bitwise
  egRestart: number; // Bitwise

  // Effects
  effects: Effects;
  fxRouting: number;
  outputLevel: number;
  gainPre: number;
  gainPost: number;
}
