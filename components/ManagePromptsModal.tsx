import React from 'react';

interface Prompt {
  ja: string;
  en: string;
}

interface ManagePromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customPrompts: Prompt[];
  onDeletePrompt: (prompt: Prompt) => void;
}

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


export const ManagePromptsModal: React.FC<ManagePromptsModalProps> = ({ isOpen, onClose, customPrompts, onDeletePrompt }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative flex flex-col"
        style={{ maxHeight: '80vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 z-10"
          aria-label="閉じる"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-cyan-700 text-center mb-4 flex-shrink-0">呪文を管理する</h2>
        
        <div className="overflow-y-auto flex-grow pr-2">
            {customPrompts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">追加した呪文はありません。</p>
            ) : (
                <ul className="space-y-2">
                    {customPrompts.map(prompt => (
                        <li key={prompt.en} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                            <span className="text-gray-700">{prompt.ja}</span>
                            <button
                                onClick={() => onDeletePrompt(prompt)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                                aria-label={`${prompt.ja} を削除`}
                            >
                                <TrashIcon />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <div className="flex justify-center mt-6 flex-shrink-0">
            <button
              onClick={onClose}
              className="bg-cyan-500 text-white font-bold py-2 px-8 rounded-full hover:bg-cyan-600 transition-colors duration-300 shadow-lg"
            >
              閉じる
            </button>
          </div>
      </div>
    </div>
  );
};