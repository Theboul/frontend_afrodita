import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { imageService, type ImagenProducto } from "../../services/archivos/imageService";
import Button from "../../components/ui/Button";

interface Props {
  producto: { id_producto: string; nombre: string };
  onClose: () => void;
}

/* === Item sortable individual === */
function SortableImage({
  img,
  onDelete,
  onRestore,
  onSetMain,
}: {
  img: ImagenProducto;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onSetMain: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: img.id_imagen });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border rounded-lg overflow-hidden ${
        img.es_principal ? "ring-2 ring-green-500" : ""
      }`}
    >
      {/* Imagen + opacidad si está inactiva */}
      <div
        {...attributes}
        {...listeners}
        className={`relative cursor-grab active:cursor-grabbing ${
          img.estado_imagen === "INACTIVA" ? "opacity-50" : ""
        }`}
      >
        <img
          src={img.metadata?.medium || img.url}
          alt="producto"
          className="w-full h-32 sm:h-40 object-cover"
        />
        {img.estado_imagen === "INACTIVA" && (
          <div className="absolute inset-0 bg-gray-800/40 flex items-center justify-center">
            <span className="text-white text-xs sm:text-sm font-semibold bg-gray-700/80 px-2 py-1 rounded">
              Inactiva
            </span>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="absolute top-1 right-1 flex gap-1">
        {img.estado_imagen === "ACTIVA" ? (
          <>
            {!img.es_principal && (
              <button 
                onClick={() => onSetMain(img.id_imagen)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs sm:text-sm transition-colors"
              >
                ⭐
              </button>
            )}
            <button 
              onClick={() => onDelete(img.id_imagen)}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm transition-colors"
            >
              🗑️
            </button>
          </>
        ) : (
          <button 
            onClick={() => onRestore(img.id_imagen)}
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm transition-colors"
          >
            ♻️
          </button>
        )}
      </div>
    </div>
  );
}

/* === Modal principal === */
export function ProductImagesModal({ producto, onClose }: Props) {
  const [imagenes, setImagenes] = useState<ImagenProducto[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  // =========================
  // CARGAR IMÁGENES
  // =========================
  const loadImages = async () => {
    const data = await imageService.getByProduct(producto.id_producto);
    setImagenes(data);
  };

  useEffect(() => {
    loadImages();
  }, []);

  // =========================
  // SUBIR NUEVA IMAGEN
  // =========================
  const handleUpload = async () => {
    if (!archivo) return;
    setSubiendo(true);
    try {
      await imageService.upload(producto.id_producto, archivo);
      setArchivo(null);
      await loadImages();
    } catch (e) {
      console.error(e);
      alert("Error al subir imagen");
    } finally {
      setSubiendo(false);
    }
  };

  // =========================
  // ELIMINAR / RESTAURAR / PRINCIPAL
  // =========================
  const handleDelete = async (id: number) => {
    if (!confirm("¿Deseas marcar esta imagen como inactiva?")) return;
    await imageService.delete(id);
    await loadImages();
  };

  const handleRestore = async (id: number) => {
    if (!confirm("¿Restaurar esta imagen inactiva?")) return;
    await imageService.restore(id);
    await loadImages();
  };

  const handleSetMain = async (id: number) => {
    await imageService.markAsMain(id);
    await loadImages();
  };

  // =========================
  // REORDENAMIENTO
  // =========================
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = imagenes.findIndex((img) => img.id_imagen === active.id);
      const newIndex = imagenes.findIndex((img) => img.id_imagen === over.id);
      const newOrder = arrayMove(imagenes, oldIndex, newIndex);
      setImagenes(newOrder);

      // Actualizar backend
      const ordenPayload = newOrder.map((img, i) => ({
        id_imagen: img.id_imagen,
        orden: i + 1,
      }));

      try {
        await imageService.reorder(producto.id_producto, ordenPayload);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto my-4">
        <h2 className="text-lg sm:text-xl font-bold mb-3">
          Imágenes de <span className="text-indigo-600 break-words">{producto.nombre}</span>
        </h2>

        {/* Subida */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="border rounded px-2 py-1.5 sm:py-2 w-full text-sm"
          />
          <Button
            label={subiendo ? "Subiendo..." : "Subir"}
            color="success"
            disabled={!archivo || subiendo}
            onClick={handleUpload}
          />
        </div>

        {/* Instrucciones para móvil */}
        <div className="mb-4 p-2 sm:p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <p className="text-xs sm:text-sm text-indigo-800">
            💡 <span className="font-semibold">Tip:</span> Mantén presionada una imagen para reorganizar. 
            <span className="hidden sm:inline"> Arrastra para cambiar el orden de visualización.</span>
          </p>
        </div>

        {/* Drag & Drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={imagenes.map((img) => img.id_imagen)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {imagenes.length > 0 ? (
                imagenes.map((img) => (
                  <SortableImage
                    key={img.id_imagen}
                    img={img}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                    onSetMain={handleSetMain}
                  />
                ))
              ) : (
                <div className="col-span-2 sm:col-span-3 md:col-span-4 text-center py-8 sm:py-12">
                  <div className="text-gray-300 text-4xl sm:text-6xl mb-2 sm:mb-4">📷</div>
                  <p className="text-gray-500 text-sm sm:text-base italic">
                    No hay imágenes registradas
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2">
                    Sube la primera imagen del producto
                  </p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>

        <div className="mt-4 sm:mt-6 flex justify-end">
          <Button label="Cerrar" color="info" onClick={onClose} />
        </div>
      </div>
    </div>
  );
}
