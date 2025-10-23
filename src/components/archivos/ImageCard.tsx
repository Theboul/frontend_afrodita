import React from 'react';
import { type ImagenProducto } from '../../services/archivos/imageService';

interface Props {
  img: ImagenProducto;
  onDelete: (id: number) => void;
  onMarkMain: (id: number) => void;
}

export const ImageCard: React.FC<Props> = ({ img, onDelete, onMarkMain }) => {
  return (
    <div className="relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <img
        src={img.metadata?.medium || img.url}
        alt={img.public_id}
        className="w-full h-48 object-cover"
      />

      {img.es_principal && (
        <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md">
          Principal
        </span>
      )}

      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">
        <button
          onClick={() => onMarkMain(img.id_imagen)}
          className="bg-white text-gray-700 p-2 rounded-full hover:bg-yellow-100"
          title="Marcar principal"
        >
          ⭐
        </button>
        <button
          onClick={() => onDelete(img.id_imagen)}
          className="bg-white text-gray-700 p-2 rounded-full hover:bg-red-100"
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
