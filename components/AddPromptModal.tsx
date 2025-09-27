import React, { useState, useEffect } from 'react';

interface AddPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPrompt: (prompt: { ja: string; en: string }) => void;
}

export const AddPromptModal: React.FC<AddPromptModalProps> = ({ isOpen, onClose, onAddPrompt }) => {
  const [ja, setJa] = useState('');
  const [en, setEn] = useState('');

  useEffect(() => {
    if (isOpen) {
      setJa('');
      setEn('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ja.trim() && en.trim()) {
      onAddPrompt({ ja: ja.trim(), en: en.trim() });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          aria-label="閉じる"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-cyan-700 text-center mb-6">新しい呪文を追加</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="ja-prompt" className="block text-gray-600 font-semibold mb-2">
              日本語の呪文 🇯🇵
            </label>
            <input
              id="ja-prompt"
              type="text"
              value={ja}
              onChange={(e) => setJa(e.target.value)}
              placeholder="例：空を飛ぶ"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="en-prompt" className="block text-gray-600 font-semibold mb-2">
              英語の呪文 🇺🇸 (AI用)
            </label>
            <input
              id="en-prompt"
              type="text"
              value={en}
              onChange={(e) => setEn(e.target.value)}
              placeholder="Example: Make it fly"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!ja.trim() || !en.trim()}
              className="bg-pink-500 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-600 transition-all duration-300 shadow-lg disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
            >
              呪文を保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};