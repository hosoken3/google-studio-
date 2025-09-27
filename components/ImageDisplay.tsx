import React, { useRef, useCallback } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ImageDisplayProps {
  image: string | null;
  isLoading: boolean;
  onImageUpload: (file: File) => void;
}

const PhotoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


export const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isLoading, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAreaClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div className="w-full aspect-square bg-slate-100 rounded-3xl border-4 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative transition-all duration-300">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
          <LoadingSpinner />
           <p className="mt-4 text-cyan-600 font-bold text-lg">AIが考え中...</p>
        </div>
      )}
      
      {image ? (
        <img src={image} alt="User content" className="w-full h-full object-cover" />
      ) : (
        <button
          onClick={handleAreaClick}
          className="w-full h-full flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-slate-200 transition-colors"
        >
            <PhotoIcon />
            <span className="mt-2 font-bold text-xl text-gray-500">写真を追加！</span>
            <span className="text-sm text-gray-400">ここをクリックしてファイルを選択</span>
        </button>
      )}
    </div>
  );
};
