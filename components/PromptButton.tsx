import React from 'react';

interface PromptButtonProps {
  text: string;
  onClick: () => void;
  disabled: boolean;
}

export const PromptButton: React.FC<PromptButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full h-full p-3 md:p-4 text-sm md:text-base font-bold text-white rounded-2xl 
        focus:outline-none focus:ring-4 focus:ring-cyan-200
        transition-all duration-150 ease-in-out
        transform
        ${disabled 
          ? 'bg-gray-300 border-b-4 border-gray-400 cursor-not-allowed shadow-inner' 
          : 'bg-cyan-400 border-b-4 border-cyan-600 shadow-lg hover:bg-cyan-300 active:bg-cyan-500 active:border-b-2 active:translate-y-1 active:shadow-md'
        }
      `}
    >
      {text}
    </button>
  );
};
