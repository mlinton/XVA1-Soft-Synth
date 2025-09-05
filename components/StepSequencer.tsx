import React from 'react';
import type { StepSequencer } from '../../types';
import Knob from './Knob';
import { Checkbox } from './ParameterControls';

interface StepSequencerEditorProps {
  sequencer: StepSequencer;
  update: <K extends keyof StepSequencer>(param: K, value: StepSequencer[K]) => void;
}

const StepSequencerEditor: React.FC<StepSequencerEditorProps> = ({ sequencer, update }) => {
  const handleStepChange = (index: number, value: string) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 255) {
      const newSteps = [...sequencer.stepValues];
      newSteps[index] = numericValue;
      update('stepValues', newSteps);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Checkbox label="On" checked={sequencer.on} onChange={v => update('on', v)} />
        <Knob label="Steps" min={1} max={16} value={sequencer.steps} onChange={v => update('steps', v)} />
        <Knob label="Velocity" min={0} max={127} value={sequencer.velocity} onChange={v => update('velocity', v)} />
        <Knob label="Tempo" min={50} max={255} value={sequencer.tempo} onChange={v => update('tempo', v)} />
        <Knob label="Transpose" bipolar value={sequencer.transpose} onChange={v => update('transpose', v)} />
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-2">
        {sequencer.stepValues.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <label className="text-xs text-gray-400">{index + 1}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleStepChange(index, e.target.value)}
              className="w-12 bg-gray-700 text-center rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={3}
            />
          </div>
        ))}
      </div>
       <p className="text-xs text-gray-400 mt-2">Note values: 0-127 = Note On, 200 = Gate On, 201 = Gate Off, 255 = Note Off</p>
    </div>
  );
};

export default StepSequencerEditor;
