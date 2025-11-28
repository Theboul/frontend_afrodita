import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCarritoStore } from "../stores/useCarritoStore";
import type { ProductoCarrito } from "../stores/useCarritoStore";


interface ProductoCardProps {
  producto: ProductoCarrito & { stock?: number }; // agregamos stock opcional
}

const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
  const {
    productos,
    agregarProducto,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
  } = useCarritoStore();

  const itemEnCarrito = productos.find((i) => i.id === producto.id);
  const [agregado, setAgregado] = useState(false);
  const [errorStock, setErrorStock] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAgregar = async () => {
    if (producto.stock && producto.stock <= 0) {
      setErrorStock("No hay stock disponible");
      return;
    }

    setLoading(true);
    try {
      await agregarProducto(producto);
      setAgregado(true);
      setErrorStock(null);
    } catch (err) {
      setErrorStock("Error al agregar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleAumentar = async () => {
    if (itemEnCarrito && producto.stock && itemEnCarrito.cantidad >= producto.stock) {
      setErrorStock("No hay más stock disponible");
      return;
    }

    setLoading(true);
    try {
      if (itemEnCarrito) await aumentarCantidad(itemEnCarrito.id);
      setErrorStock(null);
    } catch (err) {
      setErrorStock("Error al actualizar cantidad");
    } finally {
      setLoading(false);
    }
  };

  const mostrarContador = itemEnCarrito || agregado;

  return (
    <div className="p-4 bg-white shadow-md rounded-xl flex flex-col items-center hover:scale-105 transform transition">
      <div className="w-full aspect-square rounded-lg overflow-hidden">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="font-bold mt-2 text-center">{producto.nombre}</h3>
      <p className="text-gray-600 text-sm text-center mt-1 line-clamp-2">
        {producto.descripcion}
      </p>
      <p className="text-pink-600 font-semibold mt-1">Bs {producto.precio}</p>

      {errorStock && <p className="text-red-500 text-sm mt-1">{errorStock}</p>}

      {mostrarContador ? (
        <div className="flex items-center gap-2 mt-3 w-full justify-center">
          <button
            onClick={() => disminuirCantidad(producto.id)}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            -
          </button>
          <span className="font-semibold text-gray-700">
            {itemEnCarrito?.cantidad || 1}
          </span>
          <button
            onClick={handleAumentar}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            +
          </button>
          <button
            onClick={() => {
              eliminarProducto(producto.id);
              setAgregado(false);
            }}
            className="ml-2 px-2 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      ) : (
        <div className="mt-3 w-full space-y-2">
          <button
            onClick={handleAgregar}
            className="w-full py-2 rounded-lg transition bg-pink-600 text-white hover:bg-pink-700"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Agregar al carrito"}
          </button>
          <Link
            to={`/clientes/productos/${producto.id}`}
            className="block w-full text-center py-2 rounded-lg border border-pink-200 text-pink-700 hover:bg-pink-50 transition"
          >
            Ver detalles y reseñas
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductoCard;
