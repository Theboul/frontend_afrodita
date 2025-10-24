import { useEffect, useState } from "react";
import ModuleLayout from "../../layouts/ModuleLayout";
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
        <Button label="Actualizar" color="primary" onClick={loadProductos} />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto shadow-sm rounded-lg border border-pink-200">
        <table className="min-w-full divide-y divide-pink-200">
          <thead className="bg-pink-50">
            <tr>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-pink-600 uppercase tracking-wider">Código</th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-pink-600 uppercase tracking-wider">Producto</th>
              <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-pink-600 uppercase tracking-wider">Imágenes</th>
              <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-pink-600 uppercase tracking-wider">Estado</th>
              <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-pink-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-pink-100">
            {productos.map((p) => (
              <tr key={p.id_producto} className="hover:bg-pink-50 transition-colors">
                <td className="px-3 sm:px-4 py-2 text-sm text-pink-700 whitespace-nowrap">{p.id_producto}</td>
                <td className="px-3 sm:px-4 py-2 text-sm font-semibold text-pink-800">{p.nombre}</td>
                <td className="px-3 sm:px-4 py-2 text-center">
                  {p.imagenes && p.imagenes.length > 0 ? (
                    <div className="flex justify-center gap-2 flex-wrap">
                      {p.imagenes.slice(0, 3).map((img: any) => (
                        <img
                          key={img.id_imagen}
                          src={img.url}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded border object-cover ${img.es_principal ? "ring-2 ring-pink-400" : ""}`}
                        />
                      ))}
                      {p.imagenes.length > 3 && (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded border bg-pink-100 flex items-center justify-center">
                          <span className="text-xs text-pink-600 font-semibold">+{p.imagenes.length - 3}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-pink-300 text-sm italic">Sin imágenes</span>
                  )}
                </td>
                <td className="px-3 sm:px-4 py-2 text-center">
                  <span className={`px-2 py-1 text-xs rounded ${p.estado_producto === "ACTIVO" ? "bg-pink-100 text-pink-700" : "bg-pink-50 text-pink-400"}`}>
                    {p.estado_producto}
                  </span>
                </td>
                <td className="px-3 sm:px-4 py-2 text-center space-x-2">
                  <Button label="Ver" color="primary" onClick={() => setSelected(p)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 sm:space-y-4">
        {productos.map((p) => (
          <div key={p.id_producto} className="bg-white shadow-sm rounded-lg p-3 sm:p-4 border border-pink-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <span className="text-xs text-pink-500 font-medium">#{p.id_producto}</span>
                <h3 className="text-sm sm:text-base font-semibold text-pink-800 truncate">{p.nombre}</h3>
              </div>
              <span className={`px-2 py-1 text-xs rounded flex-shrink-0 ${p.estado_producto === "ACTIVO" ? "bg-pink-100 text-pink-700" : "bg-pink-50 text-pink-400"}`}>
                {p.estado_producto}
              </span>
            </div>
            
            {/* Grid de imágenes */}
            <div className="flex gap-2 flex-wrap justify-center mb-3">
              {p.imagenes && p.imagenes.length > 0 ? (
                <>
                  {p.imagenes.slice(0, 4).map((img: any) => (
                    <img
                      key={img.id_imagen}
                      src={img.url}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded border object-cover ${img.es_principal ? "ring-2 ring-pink-400" : ""}`}
                    />
                  ))}
                  {p.imagenes.length > 4 && (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded border bg-pink-100 flex items-center justify-center">
                      <span className="text-xs text-pink-600 font-semibold">+{p.imagenes.length - 4}</span>
                    </div>
                  )}
                </>
              ) : (
                <span className="text-pink-300 text-sm italic py-4">Sin imágenes</span>
              )}
            </div>
            
            <Button label="Ver Imágenes" color="primary" onClick={() => setSelected(p)} />
          </div>
        ))}
      </div>

      {!loading && productos.length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-pink-50 rounded-lg mt-4">
          <div className="text-pink-300 text-4xl sm:text-6xl mb-4">📁</div>
          <p className="text-pink-400 text-base sm:text-lg font-medium">No hay productos registrados</p>
          <p className="text-pink-300 text-sm mt-2">Crea productos para gestionar sus imágenes</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 sm:py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm sm:text-base">Cargando productos...</p>
          </div>
        </div>
      )}

      {selected && <ProductImagesModal producto={selected} onClose={() => setSelected(null)} />}
    </ModuleLayout>
  );
}