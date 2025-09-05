/**
 * Maps the nested SynthPatch state object structure to the flat
 * parameter numbers required by the XVA1 hardware, based on the user manual spreadsheet.
 */

export const parameterMap = {
  // Oscillators
  oscillators: Array(4).fill(0).map((_, i) => ({
    on: 1 + i,
    waveform: 11 + i,
    pulseWidth: 15 + i,
    sawStackDetune: 19 + i,
    transpose: 23 + i,
    tune: 27 + i,
    level: 31 + (i * 2),
    levelL: 32 + (i * 2),
    levelR: 32 + (i * 2), // Map R to L as per spreadsheet
    velocitySensitivity: 39 + i,
    keyBreakpoint: 43 + i,
    keyLDepth: 47 + i,
    keyRDepth: 51 + i,
    keyLCurve: 55 + i,
    keyRCurve: 59 + i,
    pms: 63 + i, // pitchModSensitivity
    ams: 67 + i, // ampModSensitivity
    drift: 260 + i,
  })),

  oscSync: 5,
  oscMode: 6,
  oscPhase: 7,
  ringMod34: 271,

  // Filters
  filterType: 71,
  filterVelocity: 73,
  filters: [
    {
      cutoff1: 77,
      resonance1: 79,
      cutoff2: 78,
      resonance2: 79, // Mapped to same as Reso1
      kbdTrack: 74,
      egDepth: 75,
      velocityReso: 76,
      kbdTrackReso: 277,
      drive: 275,
      egVelocity: 220, // From spreadsheet, EG column
    },
    { // Filter 2 mappings
      cutoff1: 77, // Shared
      resonance1: 79, // Shared
      cutoff2: 78, // Shared
      resonance2: 79, // Shared
      kbdTrack: 74, // Shared
      egDepth: 75, // Shared
      velocityReso: 76, // Shared
      kbdTrackReso: 277, // Shared
      drive: 275, // Shared
      egVelocity: 220, // Shared
    }
  ],
  filterRouting: 278,

  // LFOs
  lfos: [
    { wave: 160, range: 161, speed: 162, sync: 163, fade: 164 },
    { wave: 170, range: 171, speed: 172, sync: 173, fade: 174 },
  ],
  lfo1DepthPitch: 165,
  lfo1DepthAmp: 166,
  lfo2DepthPW: 175,
  lfo2DepthCutoff: 176,

  // LFO Modulators
  pitchLfoMod: { after: 180, wheel: 181, breath: 182, foot: 183 },
  pwLfoMod: { after: 184, wheel: 185, breath: 186, foot: 187 },
  cutoffLfoMod: { after: 188, wheel: 189, breath: 190, foot: 191 },
  ampLfoMod: { after: 192, wheel: 193, breath: 194, foot: 195 },

  // Direct Modulations
  pitchMod: { after: 200, breath: 201, foot: 202, rnd: 203, temp: 220, vc0: 221, vc1: 222 },
  pwMod: { after: 204, breath: 205, foot: 206, temp: 207, vc0: 224, vc1: 225 },
  cutoffMod: { after: 208, breath: 209, foot: 210, temp: 211, vc0: 226, vc1: 227 },
  volumeMod: { after: 212, breath: 213, foot: 214, temp: 215, vc0: 230, vc1: 231 },

  // Envelopes
  egLoop: 145,
  egLoopSeg: 146,
  egRestart: 147,
  envelopes: {
    pitch: { startLevel: 80, attackLevel: 85, decay1Level: 90, sustainLevel: 95, release1Level: 100, release2Level: 105, delay: 110, attackTime: 115, decay1Time: 120, decay2Time: 125, release1Time: 130, release2Time: 135, rateKey: 0, range: 148, velo: 149 },
    filter: { startLevel: 81, attackLevel: 86, decay1Level: 91, sustainLevel: 96, release1Level: 101, release2Level: 106, delay: 111, attackTime: 116, decay1Time: 121, decay2Time: 126, release1Time: 131, release2Time: 136, rateKey: 0 },
    amp: { startLevel: 82, attackLevel: 87, decay1Level: 92, sustainLevel: 97, release1Level: 102, release2Level: 107, delay: 112, attackTime: 117, decay1Time: 122, decay2Time: 127, release1Time: 132, release2Time: 137, rateKey: 0 },
  },

  // Global
  transpose: 241,
  bendUp: 242,
  bendDown: 243,
  legatoMode: 244,
  portaMode: 245,
  portaTime: 246,
  pan: 247,
  volume: 248,
  velocityOffset: 249,
  tuning: 251,
  tempOffset: 239,

  // Arpeggiator
  arpeggiator: { mode: 450, tempo: 451, mul: 453, octaves: 454 },
  
  // Step Sequencer
  stepSequencer: {
    on: 428,
    velocity: 429,
    steps: 430,
    tempo: 431,
    mul: 432,
    transpose: 433,
    stepValues: Array(16).fill(0).map((_, i) => 434 + i),
  },

  // Effects
  fxRouting: 508,
  outputLevel: 509,
  gainPre: 510,
  gainPost: 511,
  effects: {
    bandwidth: { value: 340 },
    distortion: { on: 350, type: 354, gainPre: 351, gainPost: 352, filterPost: 353 },
    bitcrusher: { depth: 380 },
    decimator: { depth: 370 },
    filter: { lo: 320, hi: 321 },
    chorus: { dry: 360, wet: 361, mode: 362, speed: 363, depth: 364, feedback: 365, lrPhase: 366 },
    phaser: { dry: 310, wet: 311, mode: 312, speed: 313, depth: 314, feedback: 315, offset: 316, stages: 317, lrPhase: 318 },
    ampMod: { depth: 330, speed: 331, range: 332, lrPhase: 333 },
    delay: { dry: 300, wet: 301, mode: 302, time: 303, feedback: 304, lo: 305, hi: 306, tempo: 307, mul: 308, div: 309, modSpeed: 298, modDepth: 299, smear: 291, doublingOn: 292 },
    earlyReflections: { dry: 294, wet: 295, room: 296, taps: 293, feedback: 297 },
    reverb: { dry: 390, wet: 391, mode: 392, decay: 393, damp: 394, hpf: 397, modSpeed: 395, modDepth: 396 },
    gate: { on: 385, curve: 386, attack: 387, release: 388 },
  }
};