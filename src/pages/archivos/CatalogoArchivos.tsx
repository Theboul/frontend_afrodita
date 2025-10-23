import { useEffect, useState } from "react";
import ModuleLayout from "../../layouts/ModuleLayout";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import { axiosInstance } from "../../services/axiosConfig";
import { ProductImagesModal } from "./ProductImagesModal";

export default function GestionArchivos() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const loadProductos = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/productos/");
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setProductos(data || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  return (
    <ModuleLayout title="Gestión de Archivos del Catálogo">
      <div className="flex justify-end mb-4">
        <Button
          label="🔄 Actualizar"
          color="info"
          onClick={loadProductos}
          disabled={loading}
        />
      </div>

      <Table
        headers={["Código", "Producto", "Imágenes", "Estado", "Acciones"]}
      >
        {productos.map((p) => (
          <tr key={p.id_producto}>
            <td className="px-4 py-2 bg-white">{p.id_producto}</td>
            <td className="px-4 py-2 bg-white font-semibold">{p.nombre}</td>
            <td className="px-4 py-2 bg-white text-center">
              {p.imagenes && p.imagenes.length > 0 ? (
                <div className="flex justify-center gap-2">
                  {p.imagenes.slice(0, 3).map((img: any) => (
                    <img
                      key={img.id_imagen}
                      src={img.url}
                      className={`w-10 h-10 rounded border object-cover ${
                        img.es_principal ? "ring-2 ring-green-500" : ""
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 text-sm italic">
                  Sin imágenes
                </span>
              )}
            </td>
            <td className="px-4 py-2 bg-white text-center">
              <span
                className={`px-2 py-1 text-xs rounded ${
                  p.estado_producto === "ACTIVO"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {p.estado_producto}
              </span>
            </td>
            <td className="px-4 py-2 bg-white text-center space-x-2">
              <Button label="Ver" color="info" onClick={() => setSelected(p)} />
            </td>
          </tr>
        ))}
      </Table>

      {!loading && productos.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No hay productos registrados
        </p>
      )}

      {selected && (
        <ProductImagesModal
          producto={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </ModuleLayout>
  );
}
