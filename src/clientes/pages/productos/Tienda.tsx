import { motion } from "framer-motion";
import { useCarritoStore } from "../../stores/useCarritoStore";
import { ShoppingCart } from "lucide-react";
import Header  from "../../components/common/Header";   
import Footer  from "../../components/common/Footer";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
}

const productos: Producto[] = [
  {
    id: 1,
    nombre: "Lentes de Contacto AquaVision",
    descripcion: "Hidratación prolongada y visión nítida todo el día.",
    imagen: "/img/aquavision.jpg",
    precio: 120.5,
  },
  {
    id: 2,
    nombre: "Lentes de Color BlueDream",
    descripcion: "Cambia tu mirada con tonos azules naturales.",
    imagen: "/img/bluedream.jpg",
    precio: 135.0,
  },
  {
    id: 3,
    nombre: "Lentes Diarias SoftEyes",
    descripcion: "Comodidad extrema, ideales para uso diario.",
    imagen: "/img/softeyes.jpg",
    precio: 110.0,
  },
];

export default function Tienda() {
  const { agregarProducto, productos: carrito } = useCarritoStore();

  const handleAgregar = (p: Producto) => {
    agregarProducto({ ...p, cantidad: 1 });
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <Header />
      


      <main className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Lentes de Contacto Afrodita
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
            >
              <img
                src={p.imagen}
                alt={p.nombre}
                className="h-56 w-full object-cover"
              />
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {p.nombre}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {p.descripcion}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-pink-600 font-bold text-lg">
                    Bs {p.precio.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleAgregar(p)}
                    className="w-full mt-2 bg-pink-600 text-white py-2 rounded-xl hover:bg-pink-700 transition"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
