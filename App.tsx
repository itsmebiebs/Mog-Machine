import React, { useState, useRef, useCallback } from 'react';
import { PolaroidFrame } from './components/PolaroidFrame';
import { Loader } from './components/Loader';
import { generateMoggedImage } from './services/geminiService';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setOriginalMimeType(file.type);
        setGeneratedImage(null);
        setError(null);
      };
      reader.onerror = () => {
        setError('Failed to read the image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleMogify = useCallback(async () => {
    if (!originalImage || !originalMimeType) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Data = originalImage.split(',')[1];
      const result = await generateMoggedImage(base64Data, originalMimeType);
      setGeneratedImage(`data:image/png;base64,${result}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, originalMimeType]);

  const handleClear = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-neutral-200 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 to-neutral-500">
          Mog Machine
        </h1>
        <p className="text-neutral-400 mt-2 text-lg">See yourself as a frog. In stunning charcoal.</p>
      </header>

      <main className="w-full max-w-sm sm:max-w-md flex flex-col items-center gap-6">
        <PolaroidFrame
          imageSrc={generatedImage || originalImage}
          onClick={!originalImage ? triggerFileUpload : undefined}
          isLoading={isLoading}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {error && (
          <div className="bg-red-900/50 text-red-300 p-3 rounded-lg w-full text-center">
            {error}
          </div>
        )}

        {isLoading && (
            <div className="flex flex-col items-center text-center">
                <Loader />
                <p className="text-neutral-400 mt-2 animate-pulse">Amphibious transformation in progress...</p>
            </div>
        )}


        <div className="w-full flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleMogify}
            disabled={!originalImage || isLoading}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-neutral-600 disabled:cursor-not-allowed disabled:transform-none"
          >
            Mogify
          </button>
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="w-full sm:w-auto bg-neutral-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-neutral-600 transition-all duration-300 ease-in-out disabled:bg-neutral-800 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      </main>
      
      <footer className="text-center mt-12 text-neutral-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;