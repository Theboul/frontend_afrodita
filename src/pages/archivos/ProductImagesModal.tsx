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
          className="w-full h-40 object-cover"
        />
        {img.estado_imagen === "INACTIVA" && (
          <div className="absolute inset-0 bg-gray-800/40 flex items-center justify-center">
            <span className="text-white text-sm font-semibold bg-gray-700/80 px-2 py-1 rounded">
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
              <Button label="⭐" color="info" onClick={() => onSetMain(img.id_imagen)} />
            )}
            <Button label="🗑️" color="danger" onClick={() => onDelete(img.id_imagen)} />
          </>
        ) : (
          <Button label="♻️" color="success" onClick={() => onRestore(img.id_imagen)} />
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[700px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-3">
          Imágenes de <span className="text-indigo-600">{producto.nombre}</span>
        </h2>

        {/* Subida */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="border rounded px-2 py-1 w-full"
          />
          <Button
            label={subiendo ? "Subiendo..." : "Subir"}
            color="success"
            disabled={!archivo || subiendo}
            onClick={handleUpload}
          />
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
            <div className="grid grid-cols-3 gap-4">
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
                <p className="col-span-3 text-center text-gray-500 italic">
                  No hay imágenes registradas
                </p>
              )}
            </div>
          </SortableContext>
        </DndContext>

        <div className="mt-6 flex justify-end">
          <Button label="Cerrar" color="info" onClick={onClose} />
        </div>
      </div>
    </div>
  );
}
