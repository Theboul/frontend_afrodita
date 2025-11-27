// src/pages/devoluciones/GestionarDevoluciones.tsx
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useDevolucionesStore } from "../../stores/devolucionesStore";
import { TablaDevoluciones } from "../../components/devoluciones/TablaDevoluciones";

const GestionarDevoluciones: React.FC = () => {
  const {
    items,
    fetchTodas,
    aprobar,
    rechazar,
    loading,
    error,
  } = useDevolucionesStore();

  useEffect(() => {
    fetchTodas();
  }, [fetchTodas]);

  const handleAprobar = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Aprobar devolución?",
      text: `Confirmar aprobación de la devolución #${id}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      background: "#fff",
    });

    if (!confirm.isConfirmed) return;

    await aprobar(id);

    Swal.fire({
      title: "Aprobada",
      text: "La devolución fue aprobada correctamente",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#6c5ce7",
    });
  };

  const handleRechazar = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Rechazar devolución?",
      text: `Confirmar rechazo de la devolución #${id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, rechazar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      background: "#fff",
    });

    if (!confirm.isConfirmed) return;

    await rechazar(id);

    Swal.fire({
      title: "Rechazada",
      text: "La devolución fue rechazada correctamente",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#6c5ce7",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">
        Gestionar devoluciones y reembolsos
      </h1>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <TablaDevoluciones
        devoluciones={items}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
      />
    </div>
  );
};

export default GestionarDevoluciones;
