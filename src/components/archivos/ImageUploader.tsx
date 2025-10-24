import React, { useRef } from 'react';

interface Props {
  onUpload: (file: File, orden: number) => void;
}

export const ImageUploader: React.FC<Props> = ({ onUpload }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    files.forEach((file, idx) => onUpload(file, idx + 1));
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-indigo-500 cursor-pointer transition-colors"
      onClick={() => fileRef.current?.click()}
    >
      <div className="flex flex-col items-center">
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-gray-500 text-sm sm:text-base">Haz clic o arrastra imágenes aquí</p>
        <p className="text-gray-400 text-xs mt-1">Soporta múltiples archivos</p>
      </div>
      <input
        type="file"
        ref={fileRef}
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleSelect}
      />
    </div>
  );
};
