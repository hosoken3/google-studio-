import React from 'react';

interface PromptButtonProps {
  text: string;
  onClick: () => void;
  disabled: boolean;
  isSelected?: boolean;
}

export const PromptButton: React.FC<PromptButtonProps> = ({ text, onClick, disabled, isSelected }) => {
  const baseClasses = `
    w-full h-full p-2 text-sm md:text-base font-bold text-white rounded-2xl 
    focus:outline-none focus:ring-4 focus:ring-cyan-200
    transition-all duration-150 ease-in-out
    transform
  `;

  const disabledClasses = 'bg-gray-300 border-b-4 border-gray-400 cursor-not-allowed shadow-inner';
  
  const selectedClasses = 'bg-cyan-600 border-b-2 border-cyan-800 shadow-inner translate-y-1';
  
  const activeClasses = 'bg-cyan-400 border-b-4 border-cyan-600 shadow-lg hover:bg-cyan-300 active:bg-cyan-500 active:border-b-2 active:translate-y-1 active:shadow-md';

  const getButtonClasses = () => {
    if (disabled && !isSelected) {
      return disabledClasses;
    }
    if (isSelected) {
      return selectedClasses;
    }
    return activeClasses;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled && !isSelected}
      className={`${baseClasses} ${getButtonClasses()}`}
    >
      {text}
    </button>
  );
};
