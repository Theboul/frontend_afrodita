import { useEffect, useState } from "react";
import { ventasService } from "../../services/ventas/ventasService";
import debounce from "lodash.debounce";

type ClienteItem = {
  id_cliente: number;
  nombre_completo: string;
  correo: string;
  telefono?: string | null;
};

type ProductoItem = {
  id_producto: string;
  nombre: string;
  precio: number;
};

type ItemVenta = {
  id_producto: string;
  nombre: string;
  precio: number;
  cantidad: number;
  sub_total: number;
};

type MetodoPago = {
  id_metodo_pago: number;
  tipo: string;
  categoria: string;
  requiere_pasarela: boolean;
  activo: boolean;
};

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

// Detecta automáticamente el tipo de respuesta
function extraerResultadosProductos(res: any) {
  // Caso 1 → respuesta plana de DRF: { count, results }
  if (res && Array.isArray(res.results)) {
    return res.results;
  }

  // Caso 2 → respuesta APIResponse: { data: { count, results } }
  if (res?.data && Array.isArray(res.data.results)) {
    return res.data.results;
  }

  // Caso 3 → respuesta directamente la lista
  if (Array.isArray(res)) {
    return res;
  }

  return [];
}


export default function VentaPresencialForm({ onClose, onSuccess }: Props) {
  const [cliente, setCliente] = useState<ClienteItem | null>(null);
  const [clienteSearch, setClienteSearch] = useState("");

  const [clientesEncontrados, setClientesEncontrados] = useState<ClienteItem[]>([]);
  const [productosEncontrados, setProductosEncontrados] = useState<ProductoItem[]>([]);
  const [itemsVenta, setItemsVenta] = useState<ItemVenta[]>([]);

  const [productoSearch, setProductoSearch] = useState("");

  const [metodosPago, setMetodosPago] = useState<any[]>([]);
  const [idMetodoPago, setIdMetodoPago] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);


  // ============================================================
  // Cargar métodos de pago (solo los que NO usan pasarela)
  // ============================================================
useEffect(() => {
  ventasService.listarMetodosPago()
    .then((res) => {
      const methods: MetodoPago[] = res.data.methods;
      console.log("METODOS RAW:", methods);

      const filtrados = methods.filter(m => !m.requiere_pasarela);
      console.log("FILTRADOS:", filtrados);

      setMetodosPago(filtrados);
    })
    .catch((err) => {
      console.error("Error cargando métodos:", err);
      setMetodosPago([]);
    });
}, []);

  // ============================================================
  // Buscar cliente en vivo
  // ============================================================
  const buscarClienteLive = debounce(async (texto) => {
    if (!texto.trim()) return setClientesEncontrados([]);

    const res = await ventasService.buscarClientes(texto);
    setClientesEncontrados(Array.isArray(res.data) ? res.data : []);
  }, 300);

  const handleClienteInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClienteSearch(e.target.value);
    buscarClienteLive(e.target.value);
  };

  // ============================================================
  // Buscar producto en vivo
  // ============================================================
  const buscarProductoLive = debounce(async (texto: string) => {
  if (!texto.trim()) return setProductosEncontrados([]);

  try {
    const res = await ventasService.buscarProductos(texto);

    console.log("RESPUESTA PRODUCTOS (raw):", res);

    const lista = extraerResultadosProductos(res);

    console.log("🔥 PRODUCTOS PROCESADOS:", lista);

    setProductosEncontrados(lista);
  } catch (e) {
    console.error("Error buscando productos:", e);
    setProductosEncontrados([]);
  }
}, 300);


  const handleProductoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductoSearch(e.target.value);
    buscarProductoLive(e.target.value);
  };

  // ============================================================
  // Agregar producto
  // ============================================================
  const agregarProducto = (prod: ProductoItem) => {
    const existe = itemsVenta.find((i) => i.id_producto === prod.id_producto);
    if (existe) return alert("Este producto ya está agregado");

    setItemsVenta([
      ...itemsVenta,
      {
        id_producto: prod.id_producto,
        nombre: prod.nombre,
        precio: Number(prod.precio),
        cantidad: 1,
        sub_total: Number(prod.precio)
      },
    ]);
  };

  // ============================================================
  // Actualizar cantidad
  // ============================================================
  const actualizarCantidad = (id: string, nuevaCantidad: number) => {
    setItemsVenta((prev) =>
      prev.map((item) =>
        item.id_producto === id
          ? {
              ...item,
              cantidad: nuevaCantidad,
              sub_total: nuevaCantidad * item.precio,
            }
          : item
      )
    );
  };

  // ============================================================
  // Eliminar producto
  // ============================================================
  const eliminarItem = (id: string) => {
    setItemsVenta((prev) => prev.filter((i) => i.id_producto !== id));
  };

  const total = itemsVenta.reduce((s, x) => s + x.sub_total, 0);

  // ============================================================
  // Registrar venta
  // ============================================================
  const procesarVenta = async () => {
    if (!idMetodoPago) return alert("Seleccione un método de pago");
    if (itemsVenta.length === 0) return alert("Agregue productos");

    setLoading(true);

    try {
      await ventasService.registrarPresencial({
        cliente_id: cliente ? cliente.id_cliente : null,
        metodo_pago: idMetodoPago,
        productos: itemsVenta.map((i) => ({
          id_producto: i.id_producto,
          cantidad: i.cantidad,
        })),
      });

      alert("Venta registrada");
      onSuccess();
    } catch (e) {
      console.error(e);
      alert("Error al registrar venta");
    }

    setLoading(false);
  };

  return (
    <div className="p-4">

      {/* CLIENTE */}
      <h3 className="text-lg font-bold text-pink-600 mb-2">Cliente</h3>
      <input
        type="text"
        value={clienteSearch}
        onChange={handleClienteInput}
        placeholder="Escribe para buscar..."
        className="w-full border px-3 py-2 rounded-lg"
      />

      {clientesEncontrados.length > 0 && (
        <div className="border rounded-lg mt-2 bg-white max-h-40 overflow-y-auto">
          {clientesEncontrados.map((c) => (
            <div
              key={c.id_cliente}
              className="px-3 py-2 hover:bg-pink-50 cursor-pointer"
              onClick={() => {
                setCliente(c);
                setClienteSearch(c.nombre_completo);
                setClientesEncontrados([]);
              }}
            >
              {c.nombre_completo} — {c.correo}
            </div>
          ))}
        </div>
      )}

      {cliente && (
        <div className="mt-3 p-3 border rounded-lg bg-pink-50">
          <p><b>{cliente.nombre_completo}</b></p>
          <p>{cliente.correo}</p>
          <p>{cliente.telefono}</p>
          <button
            className="text-sm text-pink-600 underline mt-1"
            onClick={() => setCliente(null)}
          >
            Cambiar cliente
          </button>
        </div>
      )}

      {/* PRODUCTOS */}
      <h3 className="text-lg font-bold text-pink-600 mt-6 mb-2">Productos</h3>
      <input
        type="text"
        value={productoSearch}
        onChange={handleProductoInput}
        placeholder="Buscar producto..."
        className="w-full border px-3 py-2 rounded-lg"
      />

      {productosEncontrados.length > 0 && (
        <div className="border rounded-lg mt-2 bg-white max-h-40 overflow-y-auto">
          {productosEncontrados.map((p) => (
            <div
              key={p.id_producto}
              className="px-3 py-2 hover:bg-pink-50 cursor-pointer"
              onClick={() => agregarProducto(p)}
            >
              {p.nombre} — Bs {p.precio}
            </div>
          ))}
        </div>
      )}

      {/* DETALLE */}
      <h3 className="text-lg font-bold text-pink-600 mt-6 mb-2">Detalle</h3>

      {itemsVenta.length === 0 ? (
        <p className="text-gray-500">No hay productos agregados</p>
      ) : (
        <div className="space-y-3">
          {itemsVenta.map((item) => (
            <div
              key={item.id_producto}
              className="border p-3 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{item.nombre}</p>
                <p className="text-sm">Bs {item.precio}</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={item.cantidad}
                  onChange={(e) =>
                    actualizarCantidad(
                      item.id_producto,
                      Number(e.target.value)
                    )
                  }
                  className="border px-2 py-1 w-16 rounded-lg"
                />

                <p className="font-bold text-pink-600">
                  Bs {item.sub_total.toFixed(2)}
                </p>

                <button
                  onClick={() => eliminarItem(item.id_producto)}
                  className="text-red-500 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MÉTODO DE PAGO */}
      <h3 className="text-lg font-bold text-pink-600 mt-6 mb-2">Método de Pago</h3>

      <select
        className="w-full border px-3 py-2 rounded-lg"
        value={idMetodoPago || ""}
        onChange={(e) => setIdMetodoPago(Number(e.target.value))}
      >
        <option value="">Seleccione...</option>
        {metodosPago.map((m) => (
          <option key={m.id_metodo_pago} value={m.id_metodo_pago}>
            {m.tipo} — {m.categoria}
          </option>
        ))}
      </select>

      {/* TOTAL */}
      <p className="text-right mt-6 text-xl font-bold text-pink-600">
        Total: Bs {total.toFixed(2)}
      </p>

      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={onClose}
          className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>

        <button
          disabled={loading}
          onClick={procesarVenta}
          className="bg-pink-500 text-white px-5 py-2 rounded-lg hover:bg-pink-600"
        >
          {loading ? "Procesando..." : "Registrar Venta"}
        </button>
      </div>
    </div>
  );
}
