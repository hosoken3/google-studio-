import React, { useCallback, useState, useRef } from 'react';

interface ImageUploaderSlotProps {
  image: string | null;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  title: string;
}

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);


export const ImageUploaderSlot: React.FC<ImageUploaderSlotProps> = ({ image, onImageUpload, onImageRemove, title }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!image) {
      fileInputRef.current?.click();
    }
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
  
  const containerClasses = `relative w-full aspect-video bg-slate-100 rounded-2xl border-4 border-dashed flex items-center justify-center transition-colors duration-200 ${isDragging ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200'}`;

  return (
    <div
      className={containerClasses}
      onClick={handleClick}
      onDragEnter={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
      onDragOver={(e) => handleDragEvents(e, true)}
      onDrop={handleDrop}
    >
      {!image ? (
        <div className="text-center cursor-pointer text-gray-500 p-2">
            <PlusIcon />
            <p className="mt-1 font-bold text-sm">{title}</p>
        </div>
      ) : (
        <>
            <img src={image} alt="Style" className="object-contain w-full h-full rounded-lg" />
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onImageRemove();
                }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold hover:bg-black/75 transition-colors"
                aria-label="お手本画像を削除"
            >
                &times;
            </button>
        </>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
    </div>
  );
};
