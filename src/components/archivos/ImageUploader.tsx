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
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 cursor-pointer"
      onClick={() => fileRef.current?.click()}
    >
      <p className="text-gray-500">Haz clic o arrastra imágenes aquí</p>
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
