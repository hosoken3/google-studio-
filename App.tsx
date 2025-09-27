import React, { useState, useCallback } from 'react';
import { ImageDisplay } from './components/ImageDisplay';
import { PromptButton } from './components/PromptButton';
import { editImageWithPrompt } from './services/geminiService';
import { LoadingSpinner } from './components/LoadingSpinner';
import { prompts } from './services/promptService';

type Intensity = 'low' | 'medium' | 'high';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<Intensity>('medium');

  const handleImageUpload = useCallback((file: File) => {
    setError(null);
    setEditedImage(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage({
        data: (reader.result as string).split(',')[1],
        mimeType: file.type,
      });
    };
    reader.onerror = () => {
      setError("画像の読み込みに失敗しました。もう一度お試しください。");
    };
    reader.readAsDataURL(file);
  }, []);

  const handlePromptClick = useCallback(async (prompt: string) => {
    if (!originalImage) {
      setError("はじめに画像をアップロードしてください！");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    const intensityMap: { [key in Intensity]: string } = {
      low: 'with a subtle and gentle touch',
      medium: '',
      high: 'with a strong and dramatic effect',
    };

    const fullPrompt = `${prompt} ${intensityMap[intensity]}`.trim();

    try {
      const newImage = await editImageWithPrompt(originalImage.data, originalImage.mimeType, fullPrompt);
      setEditedImage(newImage);
    } catch (e) {
      console.error(e);
      setError("AIでエラーが起きました。別のプロンプトを試してください！");
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, intensity]);

  const handleReset = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setError(null);
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-gray-800 font-sans">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-gray-200">
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-600">AI 写真あそび！</h1>
          <p className="text-gray-500 mt-2 text-lg">写真を選んで、魔法をかけよう！</p>
        </header>

        <main>
          <ImageDisplay
            image={editedImage || (originalImage ? `data:${originalImage.mimeType};base64,${originalImage.data}` : null)}
            isLoading={isLoading}
            onImageUpload={handleImageUpload}
          />

          {error && <div className="text-center text-red-500 bg-red-100 p-3 rounded-lg my-4">{error}</div>}
          
          {originalImage && (
            <div className="my-6">
              <h3 className="text-center text-lg font-bold text-cyan-700 mb-3">まほうの強さ</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setIntensity('low')}
                  className={`p-2 font-bold rounded-xl transition-all duration-200 ${intensity === 'low' ? 'bg-amber-400 text-white shadow-inner scale-95' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                >
                  ひかえめ
                </button>
                <button
                  onClick={() => setIntensity('medium')}
                  className={`p-2 font-bold rounded-xl transition-all duration-200 ${intensity === 'medium' ? 'bg-amber-400 text-white shadow-inner scale-95' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                >
                  ふつう
                </button>
                <button
                  onClick={() => setIntensity('high')}
                  className={`p-2 font-bold rounded-xl transition-all duration-200 ${intensity === 'high' ? 'bg-amber-400 text-white shadow-inner scale-95' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                >
                  つよめ
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 md:gap-3 my-6">
             {prompts.map((prompt, index) => (
              <div key={index} className="h-24 md:h-28">
                <PromptButton
                  text={prompt.ja}
                  onClick={() => handlePromptClick(prompt.en)}
                  disabled={isLoading || !originalImage}
                />
              </div>
            ))}
          </div>

          {(originalImage || editedImage) && (
             <div className="flex justify-center mt-4">
                <button 
                  onClick={handleReset}
                  className="bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  やり直す
                </button>
             </div>
          )}
        </main>
      </div>
       <footer className="text-center mt-6 text-gray-400 text-sm">
        <p>Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;