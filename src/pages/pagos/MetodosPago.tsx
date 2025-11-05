import { useMemo, useState } from "react";
import { useMetodosPago, type TriState } from "../../hooks/useMetodosPago";
import MetodoPagoForm from "../../components/pago/MetodoPagoForm";
import Badge from "../../components/ui/Badge";
import SearchBar from "../../components/ui/SearchBar";

export default function MetodosPagoPage() {
  const { metodos, loading, error, filtros, setFiltros, crear, actualizar, activar, desactivar } = useMetodosPago();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const metodoEdit = useMemo(() => metodos.find(m => m.id === editingId) || null, [metodos, editingId]);

  const handleToggleEstado = async (id: number, activo: boolean) => {
    if (activo) {
      if (confirm("Desactivar este método de pago?")) await desactivar(id);
    } else {
      await activar(id);
    }
  };

  const setTri = (key: "requiere_pasarela" | "activo") => (v: TriState) => setFiltros(prev => ({ ...prev, [key]: v }));

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Métodos de Pago</h1>
        <button onClick={() => { setEditingId(null); setShowForm(true); }} className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700">
          + Nuevo Método
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <SearchBar value={filtros.search} onChange={(v) => setFiltros(prev => ({ ...prev, search: v }))} placeholder="Buscar por tipo o descripción" />
          <div className="flex flex-col sm:flex-row gap-2">
            <input value={filtros.tipo} onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))} placeholder="Tipo" className="w-full sm:w-40 border rounded px-3 py-2 text-sm" />
            <input value={filtros.categoria} onChange={(e) => setFiltros(prev => ({ ...prev, categoria: e.target.value.toUpperCase() }))} placeholder="Categoría" className="w-full sm:w-40 border rounded px-3 py-2 text-sm" />
            <select value={filtros.requiere_pasarela} onChange={(e) => setTri("requiere_pasarela")(e.target.value as TriState)} className="w-full sm:w-40 border rounded px-3 py-2 text-sm">
              <option value="all">Pasarela: Todos</option>
              <option value="true">Requiere</option>
              <option value="false">No requiere</option>
            </select>
            <select value={filtros.activo} onChange={(e) => setTri("activo")(e.target.value as TriState)} className="w-full sm:w-40 border rounded px-3 py-2 text-sm">
              <option value="all">Estado: Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-pink-300 text-black">
            <tr>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Categoría</th>
              <th className="px-4 py-2 text-left">Pasarela</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">Cargando...</td></tr>
            ) : error ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-red-600">{error}</td></tr>
            ) : metodos.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">Sin resultados</td></tr>
            ) : (
              metodos.map((m) => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{m.tipo}</td>
                  <td className="px-4 py-2">{m.categoria}</td>
                  <td className="px-4 py-2">
                    {m.requiere_pasarela ? <Badge variant="info" size="sm">Requiere</Badge> : <Badge variant="default" size="sm">No requiere</Badge>}
                  </td>
                  <td className="px-4 py-2">
                    {m.activo ? <Badge variant="success" size="sm">Activo</Badge> : <Badge variant="warning" size="sm">Inactivo</Badge>}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-sm" onClick={() => { setEditingId(m.id); setShowForm(true); }}>Editar</button>
                      <button className={`px-3 py-1 rounded text-white text-sm ${m.activo ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`} onClick={() => handleToggleEstado(m.id, m.activo)}>{m.activo ? "Desactivar" : "Activar"}</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && <MetodoPagoForm metodo={metodoEdit} onSubmit={async (data) => { if (metodoEdit) await actualizar(metodoEdit.id, data); else await crear(data); setShowForm(false); setEditingId(null); }} onCancel={() => { setShowForm(false); setEditingId(null); }} />}
    </div>
  );
}