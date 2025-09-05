import React from 'react';
import { Checkbox } from './ParameterControls';

interface BitwiseCheckboxProps {
  label: string;
  bit: number; // 0-indexed bit position
  value: number; // The current integer value
  onChange: (newValue: number) => void;
}

const BitwiseCheckbox: React.FC<BitwiseCheckboxProps> = ({ label, bit, value, onChange }) => {
  const isChecked = (value & (1 << bit)) !== 0;

  const handleChange = (checked: boolean) => {
    let newValue: number;
    if (checked) {
      newValue = value | (1 << bit); // Set bit
    } else {
      newValue = value & ~(1 << bit); // Clear bit
    }
    onChange(newValue);
  };

  return <Checkbox label={label} checked={isChecked} onChange={handleChange} />;
};

export default BitwiseCheckbox;
