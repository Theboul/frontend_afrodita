import React from 'react';
import { type ImagenProducto } from '../../services/archivos/imageService';

interface Props {
  img: ImagenProducto;
  onDelete: (id: number) => void;
  onMarkMain: (id: number) => void;
}

export const ImageCard: React.FC<Props> = ({ img, onDelete, onMarkMain }) => {
  return (
    <div className="relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img
        src={img.metadata?.medium || img.url}
        alt={img.public_id}
        className="w-full h-32 sm:h-40 md:h-48 object-cover"
      />

      {img.es_principal && (
        <span className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-yellow-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md font-semibold">
          Principal
        </span>
      )}

      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 sm:gap-3 transition-opacity">
        <button
          onClick={() => onMarkMain(img.id_imagen)}
          className="bg-white text-gray-700 p-1.5 sm:p-2 rounded-full hover:bg-yellow-100 transition-colors text-sm sm:text-base"
          title="Marcar principal"
        >
          ⭐
        </button>
        <button
          onClick={() => onDelete(img.id_imagen)}
          className="bg-white text-gray-700 p-1.5 sm:p-2 rounded-full hover:bg-red-100 transition-colors text-sm sm:text-base"
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
