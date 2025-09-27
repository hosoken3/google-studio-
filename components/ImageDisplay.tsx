import React, { useRef, useCallback, useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ImageDisplayProps {
  image: string | null;
  isLoading: boolean;
  onImageUpload: (file: File) => void;
  onAddPromptClick: () => void;
}

const PhotoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const MenuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);

// FIX: The component was incomplete, causing a type error because it didn't return a ReactNode. The implementation has been completed.
export const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isLoading, onImageUpload, onAddPromptClick }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>, isOver: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isOver);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDownload = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'edited-photo.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const containerClasses = `relative w-full aspect-square bg-slate-100 rounded-2xl border-4 border-dashed border-slate-200 flex items-center justify-center transition-colors duration-200 ${isDragging ? 'border-cyan-400 bg-cyan-50' : ''}`;

  return (
    <div className="relative">
      <div
        className={containerClasses}
        onClick={!image && !isLoading ? handleClick : undefined}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDrop={handleDrop}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-2xl">
            <LoadingSpinner />
          </div>
        )}
        {!image && !isLoading && (
          <div className="text-center cursor-pointer text-gray-500">
            <PhotoIcon />
            <p className="mt-2 font-bold text-base">写真をクリック or ドラッグ</p>
            <p className="text-xs sm:text-sm">ここに写真をドロップしてね</p>
          </div>
        )}
        {image && (
          <img src={image} alt="Displayed" className="object-contain w-full h-full rounded-2xl" />
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
      </div>

      {image && !isLoading && (
        <div ref={menuRef} className="absolute top-3 right-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 bg-white/70 rounded-full hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="メニュー"
          >
            <MenuIcon />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-20">
              <button
                onClick={handleDownload}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                画像をダウンロード
              </button>
              <button
                onClick={onAddPromptClick}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                呪文を追加
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};