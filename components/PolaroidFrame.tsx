import React from 'react';
import { UploadIcon } from './UploadIcon';
import { Loader } from './Loader';

interface PolaroidFrameProps {
  imageSrc: string | null;
  onClick?: () => void;
  isLoading: boolean;
}

export const PolaroidFrame: React.FC<PolaroidFrameProps> = ({ imageSrc, onClick, isLoading }) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-neutral-100 p-4 pb-16 rounded-sm shadow-2xl w-full aspect-[4/5] max-w-md transition-transform duration-300 ease-in-out ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
    >
      <div className="relative bg-zinc-800 w-full h-full overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="artwork"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-neutral-400">
            <UploadIcon />
            <span className="font-semibold text-lg">Click to upload</span>
          </div>
        )}
        {isLoading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                <Loader />
            </div>
        )}
      </div>
      <div className="absolute bottom-4 left-4 right-4 h-12 flex items-center justify-center">
        <p className="text-neutral-800 font-serif italic text-xl">
          {imageSrc ? "The Frog Within" : "Awaiting Transformation"}
        </p>
      </div>
    </div>
  );
};