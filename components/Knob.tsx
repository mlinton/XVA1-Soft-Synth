import React, { useCallback, useRef } from 'react';

interface KnobProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  bipolar?: boolean;
}

const Knob: React.FC<KnobProps> = ({ label, value, min = 0, max = 255, step = 1, onChange, bipolar=false }) => {
  const knobRef = useRef<SVGSVGElement>(null);
  const previousY = useRef<number>(0);
  const currentValue = useRef<number>(value);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    const dy = previousY.current - e.clientY;
    const range = max - min;
    const sensitivity = range / 200; // Adjust sensitivity
    const newValue = currentValue.current + dy * sensitivity * step;
    
    const clampedValue = Math.min(max, Math.max(min, newValue));
    const steppedValue = Math.round(clampedValue / step) * step;
    
    onChange(steppedValue);
    currentValue.current = steppedValue;
    previousY.current = e.clientY;
  }, [min, max, step, onChange]);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'default';
  }, [handleMouseMove]);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    previousY.current = e.clientY;
    currentValue.current = value;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ns-resize';
  };

  const range = max - min;
  const percentage = (value - min) / range;
  const angle = 270 * (percentage - 0.5);

  // For a 0-255 range, center is 128. Display value should be value - 128.
  const center = bipolar ? Math.floor((max + min) / 2) : min;
  const displayValue = bipolar ? value - center : value;

  return (
    <div className="flex flex-col items-center justify-center space-y-1 w-20 text-center">
      <svg
        ref={knobRef}
        width="60"
        height="60"
        viewBox="0 0 100 100"
        onMouseDown={handleMouseDown}
        className="cursor-pointer"
        style={{ touchAction: 'none' }}
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="#4b5563" strokeWidth="8" />
        <path
            d="M 50 5 A 45 45 0 1 1 50 95"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeDasharray={`${percentage * 282.74}, 282.74`}
        />
        <line
          x1="50" y1="50" x2="50" y2="10"
          stroke="#e5e7eb" strokeWidth="5" strokeLinecap="round"
          transform={`rotate(${angle}, 50, 50)`}
        />
        <circle cx="50" cy="50" r="10" fill="#374151" />
      </svg>
      <span className="text-xs text-gray-400 uppercase tracking-wider h-6 flex items-center">{label}</span>
      <span className="text-sm font-mono bg-gray-900 px-2 py-0.5 rounded">{displayValue.toFixed(0)}</span>
    </div>
  );
};

export default Knob;
