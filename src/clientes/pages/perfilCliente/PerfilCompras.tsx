import { Table } from "../../../components/ui/Table";
import { EmptyState } from "../../../components/ui/EmptyState";

export default function PerfilCompras() {
  const compras = [
    { id: 1, fecha: "2025-10-21", total: 150.5, estado: "Completado" },
    { id: 2, fecha: "2025-09-10", total: 89.99, estado: "En proceso" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Mis Compras</h2>
      {compras.length === 0 ? (
        <EmptyState title="Sin compras registradas" description="Aún no realizaste ninguna compra." />
      ) : (
        <Table
          headers={["#", "Fecha", "Total", "Estado"]}
          children={compras.map((c) => [c.id, c.fecha, `Bs. ${c.total}`, c.estado])}
        />
      )}
    </div>
  );
}
