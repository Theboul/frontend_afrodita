import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getInventario,
  createInventario,
  updateInventario,
  deleteInventario,
} from "../../services/inventario/inventarioService";
import type { InventarioData } from "../../services/inventario/inventarioService";

const GestionInventario: React.FC = () => {
  const [inventarios, setInventarios] = useState<any[]>([]);
  const [producto, setProducto] = useState("");
  const [cantidad_actual, setCantidadActual] = useState<number>(0);
  const [stock_minimo, setStockMinimo] = useState<number>(0);
  const [ubicacion, setUbicacion] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // 🔄 Cargar inventario
  const loadInventario = async () => {
    try {
      const data = await getInventario();
      setInventarios(data);
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    }
  };

  useEffect(() => {
    loadInventario();
  }, []);

  // 💾 Guardar o actualizar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevo: InventarioData = {
      producto,
      cantidad_actual,
      stock_minimo,
      ubicacion,
    };

    try {
      if (modoEdicion && idSeleccionado) {
        await updateInventario(idSeleccionado, nuevo);
        Swal.fire("Actualizado", "Inventario modificado correctamente", "success");
      } else {
        await createInventario(nuevo);
        Swal.fire("Guardado", "Inventario registrado correctamente", "success");
      }
      loadInventario();
      resetForm();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema al guardar", "error");
    }
  };

  // ✏️ Cargar datos para edición
  const handleEdit = (inv: any) => {
    setProducto(inv.producto);
    setCantidadActual(inv.cantidad_actual);
    setStockMinimo(inv.stock_minimo);
    setUbicacion(inv.ubicacion);
    setIdSeleccionado(inv.id_inventario);
    setModoEdicion(true);
  };

  // ❌ Eliminar registro
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar?",
      text: "No podrás recuperar este registro",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteInventario(id);
        Swal.fire("Eliminado", "Registro eliminado correctamente", "success");
        loadInventario();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el registro", "error");
      }
    }
  };

  // 🔄 Reset formulario
  const resetForm = () => {
    setProducto("");
    setCantidadActual(0);
    setStockMinimo(0);
    setUbicacion("");
    setModoEdicion(false);
    setIdSeleccionado(null);
  };

  // 🔍 Filtrado dinámico
  const inventariosFiltrados = inventarios.filter((inv) => {
  const textoBusqueda = busqueda.toLowerCase();
  return (
    inv.producto.toLowerCase().includes(textoBusqueda) ||
    (inv.producto_nombre &&
      inv.producto_nombre.toLowerCase().includes(textoBusqueda)) ||
    inv.ubicacion.toLowerCase().includes(textoBusqueda)
  );
});

return (
  <div className="container mt-4">
    <h4 className="text-center fw-bold mb-4" style={{ color: "#b72862" }}>
      Gestión de Inventario
    </h4>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-4 shadow-sm mx-auto"
        style={{
          maxWidth: "900px",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          border: "2px solid #f8d2e1",
        }}
      >
        <div>
          <label className="form-label fw-semibold text-secondary">
            Producto <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            placeholder="Ej. P002"
            style={{
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              padding: "10px",
            }}
            required
          />
        </div>

        <div>
          <label className="form-label fw-semibold text-secondary">
            Cantidad Actual <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            value={cantidad_actual}
            onChange={(e) => setCantidadActual(Number(e.target.value))}
            placeholder="Ej. 50"
            style={{
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              padding: "10px",
            }}
            required
          />
        </div>

        <div>
          <label className="form-label fw-semibold text-secondary">
            Stock Mínimo <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            value={stock_minimo}
            onChange={(e) => setStockMinimo(Number(e.target.value))}
            placeholder="Ej. 10"
            style={{
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              padding: "10px",
            }}
            required
          />
        </div>

        <div>
          <label className="form-label fw-semibold text-secondary">
            Ubicación <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="Ej. Depósito Central"
            style={{
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              padding: "10px",
            }}
            required
          />
        </div>

        <div
          className="col-12 mt-3"
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            type="submit"
            className="btn text-white fw-semibold px-4 py-2"
            style={{
              backgroundColor: modoEdicion ? "#f7a700" : "#4CAF50",
              borderRadius: "10px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
            }}
          >
            {modoEdicion ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>

      {/* 🔍 Buscador debajo del formulario */}
      <div className="mt-4 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por producto o ubicación..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: "300px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            padding: "10px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {/* TABLA */}
      <div
        className="table-responsive shadow-sm rounded-4"
        style={{ border: "2px solid #f8d2e1" }}
      >
        <table className="table table-striped table-bordered">
          <thead style={{ backgroundColor: "#f8d2e1", color: "#a22c5f" }}>
            <tr>
              <th>ID</th>
              <th>ID PRODUCTO</th>
              <th>Producto</th>
              <th>Cantidad Actual</th>
              <th>Stock Mínimo</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventariosFiltrados.length > 0 ? (
              inventariosFiltrados.map((inv) => (
                <tr key={inv.id_inventario}>
                  <td>{inv.id_inventario}</td>
                  <td>{inv.producto}</td>
                  <td>{inv.producto_nombre}</td>
                  <td>{inv.cantidad_actual}</td>
                  <td>{inv.stock_minimo}</td>
                  <td>{inv.ubicacion}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(inv)}
                      className="btn text-white fw-semibold me-2"
                      style={{
                        backgroundColor: "#f7a700",
                        borderRadius: "10px",
                        minWidth: "90px",
                      }}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(inv.id_inventario)}
                      className="btn btn-danger fw-semibold"
                      style={{
                        borderRadius: "10px",
                        minWidth: "90px",
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-muted py-3">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionInventario;
