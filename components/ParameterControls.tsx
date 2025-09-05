
import React from 'react';

interface SelectProps {
  label: string;
  value: number;
  options: string[];
  onChange: (value: number) => void;
}
export const Select: React.FC<SelectProps> = ({ label, value, options, onChange }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-xs text-gray-400 uppercase tracking-wider">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((opt, i) => (
        <option key={i} value={i}>{opt}</option>
      ))}
    </select>
  </div>
);

interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}
export const Slider: React.FC<SliderProps> = ({ label, value, min=0, max=255, step=1, onChange }) => (
    <div className="flex flex-col space-y-1 w-full">
        <div className="flex justify-between items-baseline">
            <label className="text-xs text-gray-400 uppercase tracking-wider">{label}</label>
            <span className="text-sm font-mono bg-gray-900 px-2 py-0.5 rounded">{value}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
    </div>
);


interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
export const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
    />
    <span className="text-sm">{label}</span>
  </label>
);
