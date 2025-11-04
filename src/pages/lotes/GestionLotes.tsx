import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getLotes,
  createLote,
  updateLote,
  deleteLote,
  type LoteData,
} from "../../services/lotes/loteService";

const GestionLotes: React.FC = () => {
  const [lotes, setLotes] = useState<any[]>([]);
  const [id_lote, setIdLote] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState<number>(0);
  const [fecha_vencimiento, setFechaVencimiento] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // 🔄 Cargar lotes
  const loadLotes = async () => {
    try {
      const data = await getLotes();
      setLotes(data);
    } catch (error) {
      console.error("Error al cargar lotes:", error);
    }
  };

  useEffect(() => {
    loadLotes();
  }, []);

  // 💾 Guardar o actualizar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevo: LoteData = {
      id_lote,
      producto,
      cantidad,
      fecha_vencimiento,
    };

    try {
      if (modoEdicion && idSeleccionado) {
        await updateLote(idSeleccionado, nuevo);
        Swal.fire("Actualizado", "Lote modificado correctamente", "success");
      } else {
        await createLote(nuevo);
        Swal.fire("Guardado", "Lote registrado correctamente", "success");
      }
      loadLotes();
      resetForm();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema al guardar", "error");
    }
  };

  // ✏️ Cargar datos para edición
  const handleEdit = (lote: any) => {
    setIdLote(lote.id_lote);
    setProducto(lote.producto);
    setCantidad(lote.cantidad);
    setFechaVencimiento(lote.fecha_vencimiento);
    setIdSeleccionado(lote.id_lote);
    setModoEdicion(true);
  };

  // ❌ Eliminar registro
  const handleDelete = async (id: string) => {
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
        await deleteLote(id);
        Swal.fire("Eliminado", "Registro eliminado correctamente", "success");
        loadLotes();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el registro", "error");
      }
    }
  };

  // 🔄 Reset formulario
  const resetForm = () => {
    setIdLote("");
    setProducto("");
    setCantidad(0);
    setFechaVencimiento("");
    setModoEdicion(false);
    setIdSeleccionado(null);
  };

  // 🔍 Filtrado dinámico
  const lotesFiltrados = lotes.filter((lote) => {
    const textoBusqueda = busqueda.toLowerCase();
    return (
      lote.id_lote.toLowerCase().includes(textoBusqueda) ||
      (lote.producto_nombre &&
        lote.producto_nombre.toLowerCase().includes(textoBusqueda)) ||
      (lote.producto &&
        lote.producto.toLowerCase().includes(textoBusqueda))
    );
  });

  return (
    <div className="container mt-4">
      <h4 className="text-center fw-bold mb-4" style={{ color: "#b72862" }}>
        Gestión de Lotes y Caducidades
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
            ID Lote <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            value={id_lote}
            onChange={(e) => setIdLote(e.target.value)}
            placeholder="Ej. L0007"
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
            Producto <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            placeholder="Ej. P001"
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
            Cantidad <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            placeholder="Ej. 30"
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
            Fecha Vencimiento <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className="form-control"
            value={fecha_vencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
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
          placeholder="Buscar por lote o producto..."
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
              <th>ID Lote</th>
              <th>ID Producto</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Fecha Vencimiento</th>
              <th>Estado</th>
              <th>Días por Vencer</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lotesFiltrados.length > 0 ? (
              lotesFiltrados.map((lote) => (
                <tr key={lote.id_lote}>
                  <td>{lote.id_lote}</td>
                  <td>{lote.producto}</td>
                  <td>{lote.producto_nombre || lote.producto}</td>
                  <td>{lote.cantidad}</td>
                  <td>{lote.fecha_vencimiento}</td>
                  <td>
                    {lote.esta_vencido ? (
                      <span className="text-danger fw-bold">Vencido</span>
                    ) : (
                      <span className="text-success fw-bold">Activo</span>
                    )}
                  </td>
                  <td>{lote.dias_por_vencer}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(lote)}
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
                      onClick={() => handleDelete(lote.id_lote)}
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
                <td colSpan={7} className="text-center text-muted py-3">
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

export default GestionLotes;
