
import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
      <h3 className="text-lg font-bold text-blue-400 mb-4 border-b border-gray-600 pb-2">{title}</h3>
      <div className="flex flex-wrap gap-4">
        {children}
      </div>
    </div>
  );
};

export default Section;
