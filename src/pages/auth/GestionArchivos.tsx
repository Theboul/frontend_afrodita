export default function GestionArchivos() {
  return (
    <div className="p-6 bg-[#FDF2F6] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black">Gestión de Archivos del Catálogo</h1>
      <button className="bg-[#16a34a] text-white px-4 py-2 rounded mb-4 hover:bg-[#15803d] transition">
        + Nuevo Archivo
      </button>
      <table className="w-full border">
        <thead className="bg-[#FFC7C5]">
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 bg-white">catalogo.pdf</td>
            <td className="border p-2 bg-white">PDF</td>
            <td className="border p-2 bg-white">
              {/* BOTONES CENTRADOS CON ESTILOS DEL PRIMER CÓDIGO */}
              <div className="flex justify-center items-center space-x-2">
                <button
                  className="px-3 py-1 bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition"
                >
                  Ver
                </button>
                <button
                  className="px-3 py-1 bg-[#EF4444] text-white rounded-md hover:bg-[#DC2626] transition"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}