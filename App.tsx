import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ImageDisplay } from './components/ImageDisplay';
import { PromptButton } from './components/PromptButton';
import { editImageWithPrompt } from './services/geminiService';

type Intensity = 'low' | 'medium' | 'high';
interface Prompt {
  ja: string;
  en: string;
}

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<Intensity>('medium');
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [scrollbarStyle, setScrollbarStyle] = useState({ width: '0%', left: '0%' });

  const scrollContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch('/prompts.csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const csvText = await response.text();

        const lines = csvText.trim().split('\n');
        const headers = lines.shift()?.split(',') || [];
        const jaIndex = headers.findIndex(h => h.trim() === 'ja');
        const enIndex = headers.findIndex(h => h.trim() === 'en');

        if (jaIndex === -1 || enIndex === -1) {
          console.error("CSV headers 'ja' or 'en' not found.");
          setError("プロンプトファイルの形式が正しくありません。");
          return;
        }

        const parsedPrompts = lines.map(line => {
          const values = line.split(',');
          return {
            ja: (values[jaIndex] || '').trim().replace(/^"|"$/g, ''),
            en: (values[enIndex] || '').trim().replace(/^"|"$/g, ''),
          };
        }).filter(p => p.ja && p.en);

        setPrompts(parsedPrompts);
      } catch (err) {
        console.error("Failed to load prompts:", err);
        setError("プロンプトの読み込みに失敗しました。");
      }
    };

    fetchPrompts();
  }, []);
  
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;

        if (scrollWidth <= clientWidth) {
            setScrollbarStyle({ width: '0%', left: '0%' });
            return;
        }

        const thumbWidthPercentage = (clientWidth / scrollWidth) * 100;
        const scrollableDistance = scrollWidth - clientWidth;
        const scrollPercentage = scrollLeft / scrollableDistance;
        const trackWidthPercentage = 100;
        const thumbLeftPercentage = scrollPercentage * (trackWidthPercentage - thumbWidthPercentage);

        setScrollbarStyle({
            width: `${thumbWidthPercentage}%`,
            left: `${thumbLeftPercentage}%`,
        });
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
        handleScroll();
        container.addEventListener('scroll', handleScroll);
        
        const resizeObserver = new ResizeObserver(handleScroll);
        resizeObserver.observe(container);

        return () => {
            container.removeEventListener('scroll', handleScroll);
            resizeObserver.unobserve(container);
        };
    }
  }, [prompts, handleScroll]);


  const handleImageUpload = (file: File) => {
    setError(null);
    setEditedImage(null);
    setSelectedPrompts([]);
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
  };

  const handleTogglePrompt = (promptEn: string) => {
    setSelectedPrompts(prev => {
      if (prev.includes(promptEn)) {
        return prev.filter(p => p !== promptEn);
      }
      if (prev.length < 4) {
        return [...prev, promptEn];
      }
      return prev;
    });
  };

  const handleGenerateImage = async () => {
    if (!originalImage || selectedPrompts.length === 0) {
      setError("はじめに画像をアップロードして、プロンプトを1つ以上選んでください！");
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

    const combinedPrompt = selectedPrompts.join(', ');
    const fullPrompt = `${combinedPrompt} ${intensityMap[intensity]}`.trim();

    try {
      const newImage = await editImageWithPrompt(originalImage.data, originalImage.mimeType, fullPrompt);
      setEditedImage(newImage);
      setSelectedPrompts([]);
    } catch (e) {
      console.error(e);
      setError("AIでエラーが起きました。別のプロンプトを試してください！");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setError(null);
    setIsLoading(false);
    setSelectedPrompts([]);
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
            <>
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

              <div className="my-4">
                 <h3 className="text-center text-lg font-bold text-cyan-700 mb-3">まほうの呪文 (4つまで)</h3>
                 <div className="min-h-[60px] bg-slate-100 rounded-xl p-2 flex flex-wrap gap-2 items-center justify-center border-2 border-slate-200">
                    {selectedPrompts.length === 0 ? (
                        <p className="text-gray-400">下のボタンから好きな呪文を選んでね</p>
                    ) : (
                        selectedPrompts.map((promptEn) => {
                            const promptObj = prompts.find(p => p.en === promptEn);
                            return (
                                <span key={promptEn} className="bg-cyan-200 text-cyan-800 text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-2">
                                    {promptObj?.ja}
                                    <button onClick={() => handleTogglePrompt(promptEn)} className="bg-cyan-600 text-white rounded-full w-4 h-4 text-xs">x</button>
                                </span>
                            );
                        })
                    )}
                 </div>
              </div>

              <div className="mt-4">
                <div
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto space-x-3 p-2 -mx-2 scrollbar-hide"
                >
                  {prompts.map((prompt, index) => (
                    <div key={index} className="flex-shrink-0 w-32 h-24">
                      <PromptButton
                        text={prompt.ja}
                        onClick={() => handleTogglePrompt(prompt.en)}
                        disabled={isLoading || (!selectedPrompts.includes(prompt.en) && selectedPrompts.length >= 4)}
                        isSelected={selectedPrompts.includes(prompt.en)}
                      />
                    </div>
                  ))}
                </div>
                {/* Custom Scrollbar */}
                <div className="w-full h-2 bg-slate-200 rounded-full mt-2 relative overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full absolute top-0"
                    style={scrollbarStyle}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <button
                    onClick={handleGenerateImage}
                    disabled={isLoading || selectedPrompts.length === 0}
                    className="bg-pink-500 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-600 transition-all duration-300 shadow-lg disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
                >
                    魔法をかける！
                </button>
              </div>

            </>
          )}

          {(originalImage || editedImage) && (
             <div className="flex justify-center mt-8">
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