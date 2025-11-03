// modules/soporte/components/TicketEstadoBadge.tsx
export default function TicketEstadoBadge({ estado }: { estado: string }) {
  const colorMap: Record<string, string> = {
    PENDIENTE: "bg-yellow-100 text-yellow-800",
    EN_PROCESO: "bg-blue-100 text-blue-800",
    RESPONDIDO: "bg-green-100 text-green-800",
    CERRADO: "bg-gray-200 text-gray-700",
  };

  const labelMap: Record<string, string> = {
    PENDIENTE: "Pendiente",
    EN_PROCESO: "En proceso",
    RESPONDIDO: "Respondido",
    CERRADO: "Cerrado",
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
        colorMap[estado] || "bg-gray-100 text-gray-700"
      }`}
    >
      {labelMap[estado] || estado}
    </span>
  );
}
