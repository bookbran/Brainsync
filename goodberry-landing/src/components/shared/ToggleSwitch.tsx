import React from 'react';

interface ToggleSwitchProps {
  isStreamlined: boolean;
  onToggle: (isStreamlined: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isStreamlined, onToggle }) => {
  return (
    <div className="flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
      <span 
        className={`text-sm font-medium transition-colors cursor-pointer ${
          !isStreamlined ? 'text-white' : 'text-white/60'
        }`}
        onClick={() => onToggle(false)}
      >
        Detailed View
      </span>
      
      <div 
        className="relative w-14 h-7 bg-white/20 rounded-full cursor-pointer transition-colors"
        onClick={() => onToggle(!isStreamlined)}
      >
        <div 
          className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ease-in-out ${
            isStreamlined ? 'translate-x-7' : 'translate-x-0.5'
          }`}
        />
      </div>
      
      <span 
        className={`text-sm font-medium transition-colors cursor-pointer ${
          isStreamlined ? 'text-white' : 'text-white/60'
        }`}
        onClick={() => onToggle(true)}
      >
        Quick View
      </span>
    </div>
  );
};

export default ToggleSwitch; 