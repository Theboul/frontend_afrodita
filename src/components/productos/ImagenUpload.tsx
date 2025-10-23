import { useState, useEffect } from "react";
import { axiosInstance } from "../../services/axiosConfig";

interface ImagenUploadProps {
  productoId: string;
  onImagenesSubidas: () => void;
}

export default function ImagenUpload({ productoId, onImagenesSubidas }: ImagenUploadProps) {
  const [archivos, setArchivos] = useState<FileList | null>(null);
  const [imagenesPreview, setImagenesPreview] = useState<string[]>([]);

  useEffect(() => {
    if (!archivos) return;
    const previews = Array.from(archivos).map((file) => URL.createObjectURL(file));
    setImagenesPreview(previews);
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [archivos]);

  const subirImagenes = async () => {
    if (!productoId) {
      alert("Primero guarda el producto antes de subir imágenes.");
      return;
    }

    if (!archivos || archivos.length === 0) {
      alert("Selecciona al menos una imagen.");
      return;
    }

    try {
      for (let i = 0; i < archivos.length; i++) {
        const formData = new FormData();
        formData.append("imagen", archivos[i]);
        formData.append("es_principal", i === 0 ? "true" : "false");
        formData.append("orden", String(i + 1));

        await axiosInstance.post(
          `/api/imagenes/productos/${productoId}/subir/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      alert("Imágenes subidas correctamente.");
      setArchivos(null);
      setImagenesPreview([]);
      onImagenesSubidas();
    } catch (error) {
      console.error("Error subiendo imágenes:", error);
      alert("Error al subir imágenes.");
    }
  };

  return (
    <div className="mb-8">
      <label className="block text-gray-700 mb-2 font-medium">Fotos del producto</label>
      <div className="border border-gray-300 rounded-xl p-6 text-gray-500 flex flex-col items-center justify-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setArchivos(e.target.files)}
          className="text-sm"
        />
        <div className="flex flex-wrap gap-3 mt-3">
          {imagenesPreview.map((url, idx) => (
            <img key={idx} src={url} alt={`preview-${idx}`} className="w-24 h-24 object-cover rounded-lg border" />
          ))}
        </div>
        <button
          onClick={subirImagenes}
          className="mt-3 bg-pink-400 text-white px-4 py-2 rounded-lg hover:bg-pink-500 transition"
        >
          Subir imágenes
        </button>
      </div>
    </div>
  );
}