import React, { useEffect, useState } from "react";
import "../../styles/gestionarCategoria.css";

type Categoria = {
  id: string;
  nombre: string;
  descripcion: string;
};

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // URL de tu backend Django (puede ser http://127.0.0.1:8000/api/categorias/)
  const API_URL = "http://127.0.0.1:8000/api/categorias/";

  // Cargar categorías desde el backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setCategorias(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Eliminar categoría
  const eliminarCategoria = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      setCategorias(categorias.filter((cat) => cat.id !== id));
    }
  };

  return (
    <div className="categorias-container">
      <h2>Gestión de Categorías</h2>
      <button className="btn-nueva">+ Nueva Categoría</button>

      {loading ? (
        <p>Cargando categorías...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID de categoría</th>
              <th>Nombre Categoría</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.nombre}</td>
                <td>{cat.descripcion}</td>
                <td>
                  <button className="btn-editar">Editar</button>
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarCategoria(cat.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Categorias;
