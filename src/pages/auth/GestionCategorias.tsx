export default function GestionCategorias() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Categorías</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded mb-4">
          + Nueva Categoría
        </button>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Accesorios</td>
              <td className="border p-2">
                <button className="text-blue-600 mr-2">Editar</button>
                <button className="text-red-600">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  