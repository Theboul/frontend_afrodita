import React from 'react';
import { type ImagenProducto } from '../../services/archivos/imageService';
import { ImageCard } from './ImageCard';

interface Props {
  images: ImagenProducto[];
  onDelete: (id: number) => void;
  onMarkMain: (id: number) => void;
}

export const ImageGrid: React.FC<Props> = ({ images, onDelete, onMarkMain }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {images.map((img) => (
        <ImageCard
          key={img.id_imagen}
          img={img}
          onDelete={onDelete}
          onMarkMain={onMarkMain}
        />
      ))}
    </div>
  );
};
