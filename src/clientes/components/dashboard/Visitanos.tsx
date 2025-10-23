import { MapPin, Truck, Home } from "lucide-react";

export default function Visitanos() {
  return (
    <section className="bg-white py-10 px-6 md:px-20">
      <h2 className="text-2xl font-semibold text-purple-700 mb-6">
        Visítanos
      </h2>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Lado Izquierdo - Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-purple-600" />
            <div>
              <p className="font-semibold text-purple-600">Tienda Física</p>
              <p className="text-gray-700">2do anillo av. Libertad, 324</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Truck className="w-6 h-6 text-purple-600" />
            <div>
              <p className="font-semibold text-purple-600">
                Envíos a Todo el País
              </p>
              <p className="text-gray-700">por Transportadoras</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Home className="w-6 h-6 text-purple-600" />
            <div>
              <p className="font-semibold text-purple-600">
                Envíos a Domicilio
              </p>
              <p className="text-gray-700">por Yango</p>
            </div>
          </div>
        </div>

        {/* Lado Derecho - Imágenes */}
        <div className="flex flex-wrap justify-center gap-4">
          <img
            src="../../../../public/assets/tienda1.png"
            alt="Producto 1"
            className="w-40 md:w-48 rounded-lg shadow"
          />
          <img
            src="../../../../public/assets/tienda2.png"
            alt="Producto 2"
            className="w-40 md:w-48 rounded-lg shadow"
          />
          <img
            src="../../../../public/assets/tienda3.png"
            alt="Producto 3"
            className="w-40 md:w-48 rounded-lg shadow"
          />
        </div>
      </div>
    </section>
  );
}
