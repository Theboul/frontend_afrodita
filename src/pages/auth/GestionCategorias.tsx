export default function GestionCategorias() {
    return (
      <div className="p-6 bg-[#FDF2F6] min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Gestión de Categorías</h1>
        <button className="bg-[#16a34a] text-white px-4 py-2 rounded mb-4 hover:bg-[#15803d] transition">
          + Nueva Categoría
        </button>
        <table className="w-full border">
          <thead className="bg-[#FFC7C5]">
            <tr>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 bg-white">Accesorios</td>
              <td className="border p-2 bg-white">
                <div className="flex justify-center items-center space-x-2">
                  <button className="px-3 py-1 bg-[#EAB308] text-white rounded-md hover:bg-[#CA8A04] transition">
                    Editar
                  </button>
                  <button className="px-3 py-1 bg-[#EF4444] text-white rounded-md hover:bg-[#DC2626] transition">
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
  