import React from 'react';

const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

export const OscillatorIcon: React.FC = () => (
    <Icon>
        <path d="M3 12h2.5c1 0 1.5-1 1.5-2S7 8 6 8H4" />
        <path d="M18 16h-2.5c-1 0-1.5 1-1.5 2s.5 2 1.5 2H18" />
        <path d="M5 10v4" /><path d="M19 14v-4" />
        <path d="M10 12c0-3 2-5 2-5s2 2 2 5-2 5-2 5-2-2-2-5Z" />
    </Icon>
);

export const FilterIcon: React.FC = () => (
    <Icon>
        <path d="M2 5.5V5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v.5" />
        <path d="M2 18.5V19a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-.5" />
        <path d="M12 2v20" />
        <path d="M7 12H2" /><path d="M22 12h-5" />
    </Icon>
);

export const LfoIcon: React.FC = () => (
    <Icon>
        <path d="M3 12h3l3-9 6 18 3-9h3" />
    </Icon>
);

export const EnvelopeIcon: React.FC = () => (
    <Icon>
        <path d="M3 20V4l8 16 8-16v16" />
    </Icon>
);

export const FxIcon: React.FC = () => (
    <Icon>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="m10 13-2 2 2 2" /><path d="m14 13 2 2-2 2" />
    </Icon>
);

export const GlobalIcon: React.FC = () => (
    <Icon>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </Icon>
);

export const ModulationIcon: React.FC = () => (
    <Icon>
        <path d="M12 20.5v-17" />
        <path d="M12 20.5a8.5 8.5 0 0 0 8.5-8.5" />
        <path d="M12 20.5a8.5 8.5 0 0 1-8.5-8.5" />
        <path d="M12 12a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
    </Icon>
);
