import React from 'react';
import type { Filter, SynthPatch } from '../../types';
import { FILTER_TYPE_OPTIONS, FILTER_ROUTING_OPTIONS } from '../../constants';
import Knob from '../Knob';
import { Select } from '../ParameterControls';
import Section from '../Section';

interface FilterEditorProps {
  filter: Filter;
  index: number;
  update: <K extends keyof Filter>(index: number, param: K, value: Filter[K]) => void;
}

const FilterEditor: React.FC<FilterEditorProps> = ({ filter, index, update }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex-1 min-w-[340px]">
      <h4 className="text-md font-bold text-blue-300 mb-4">Filter {index + 1}</h4>
      <div className="flex flex-wrap gap-4">
        <Knob label="Cutoff 1" value={filter.cutoff1} onChange={v => update(index, 'cutoff1', v)} />
        <Knob label="Reso 1" value={filter.resonance1} onChange={v => update(index, 'resonance1', v)} />
        <Knob label="Cutoff 2" value={filter.cutoff2} onChange={v => update(index, 'cutoff2', v)} />
        <Knob label="Reso 2" value={filter.resonance2} onChange={v => update(index, 'resonance2', v)} />
        <Knob label="EG Depth" value={filter.egDepth} bipolar onChange={v => update(index, 'egDepth', v)} />
        <Knob label="EG Velo" value={filter.egVelocity} bipolar onChange={v => update(index, 'egVelocity', v)} />
        <Knob label="KBD Track" value={filter.kbdTrack} bipolar onChange={v => update(index, 'kbdTrack', v)} />
        <Knob label="Velo Reso" value={filter.velocityReso} bipolar onChange={v => update(index, 'velocityReso', v)} />
        <Knob label="KBD Reso" value={filter.kbdTrackReso} bipolar onChange={v => update(index, 'kbdTrackReso', v)} />
        <Knob label="Drive" min={0} max={7} value={filter.drive} onChange={v => update(index, 'drive', v)} />
      </div>
    </div>
  );
};

interface FilterSectionProps {
  patch: SynthPatch;
  updateFilter: <K extends keyof Filter>(index: number, param: K, value: Filter[K]) => void;
  setParam: <K extends keyof SynthPatch>(param: K, value: SynthPatch[K]) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ patch, updateFilter, setParam }) => {
  return (
    <div className="space-y-6">
        <Section title="Common Filter Settings">
            <Select label="Filter Type" options={FILTER_TYPE_OPTIONS} value={patch.filterType} onChange={v => setParam('filterType', v)} />
            <Knob label="Filter Velocity" value={patch.filterVelocity} bipolar onChange={v => setParam('filterVelocity', v)} />
            <Select label="Parallel Routing" options={FILTER_ROUTING_OPTIONS} value={patch.filterRouting} onChange={v => setParam('filterRouting', v)} />
        </Section>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {patch.filters.map((filter, i) => (
            <FilterEditor key={i} filter={filter} index={i} update={updateFilter} />
          ))}
        </div>
    </div>
  );
};

export default FilterSection;