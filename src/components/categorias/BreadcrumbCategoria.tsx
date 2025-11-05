import { type Categoria } from "../../services/categorias/categoriaService";

interface Props {
  ruta: Categoria[];
  onNavigate: (categoria: Categoria) => void;
}

export default function BreadcrumbCategoria({ ruta, onNavigate }: Props) {
  if (!ruta || ruta.length === 0) return null;

  const mostrarReducido = ruta.length > 4;
  const visibleRuta = mostrarReducido
    ? [ruta[0], { id_categoria: -1, nombre: "..." } as Categoria, ...ruta.slice(-2)]
    : ruta;

  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center flex-wrap gap-1 text-xs sm:text-sm text-gray-700 mb-3 p-2 bg-gray-50 rounded-md"
    >
      {visibleRuta.map((cat, i) => {
        const isLast = i === visibleRuta.length - 1;
        const esOmitido = cat.nombre === "...";
        return (
          <div key={`breadcrumb-${cat.id_categoria}-${i}`} className="flex items-center">
            {!esOmitido ? (
              <span
                className={`${
                  isLast
                    ? "font-semibold text-pink-700"
                    : "hover:underline cursor-pointer text-gray-600 hover:text-gray-900"
                } transition-colors truncate max-w-[120px] sm:max-w-[200px]`}
                onClick={() => !isLast && onNavigate(cat)}
                title={cat.nombre}
              >
                {cat.nombre}
              </span>
            ) : (
              <span className="text-gray-400">...</span>
            )}
            {!isLast && <span className="px-1 text-gray-400">›</span>}
          </div>
        );
      })}
    </nav>
  );
}
