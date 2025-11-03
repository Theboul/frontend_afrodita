import React, { useState } from "react";
import { useCarritoStore } from "../stores/useCarritoStore";

interface ProductoCardProps {
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    precio: number;
    cantidad: number;
  };
}

const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
  const { agregarProducto } = useCarritoStore();
  const [cantidad, setCantidad] = useState<number>(1);

  const aumentar = () => setCantidad(c => c + 1);
  const disminuir = () => setCantidad(c => (c > 1 ? c - 1 : 1));
  const agregarAlCarrito = () => {
    agregarProducto({ ...producto, cantidad });
  };

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
      <p className="text-gray-600 text-sm text-center mt-1 line-clamp-2">{producto.descripcion}</p>
      <p className="text-pink-600 font-semibold mt-1">Bs {producto.precio}</p>

      {/* Contador */}
      <div className="flex items-center mt-2 space-x-2">
        <button
          onClick={disminuir}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          -
        </button>
        <span>{cantidad}</span>
        <button
          onClick={aumentar}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </button>
      </div>

      <button
        onClick={agregarAlCarrito}
        className="mt-2 w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductoCard;
