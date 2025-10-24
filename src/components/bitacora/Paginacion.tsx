import { type PaginationInfo } from '../../services/bitacora/bitacoraService';

interface PaginacionProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export default function Paginacion({ pagination, onPageChange, loading }: PaginacionProps) {
  const { currentPage, totalPages, hasNext, hasPrevious, totalItems } = pagination;

  if (totalPages <= 1) return null;

  const pagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

  if (endPage - startPage + 1 < pagesToShow) {
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-3 sm:px-4 py-3 gap-3 rounded-b-lg">
      {/* Información de paginación */}
      <div className="text-center sm:text-left w-full sm:w-auto">
        <p className="text-xs sm:text-sm text-gray-700">
          Mostrando{' '}
          <span className="font-medium">
            {((currentPage - 1) * pagination.pageSize) + 1}
          </span>{' '}
          a{' '}
          <span className="font-medium">
            {Math.min(currentPage * pagination.pageSize, totalItems)}
          </span>{' '}
          de <span className="font-medium">{totalItems}</span> resultados
        </p>
      </div>

      {/* Botones de paginación */}
      <div className="flex flex-wrap justify-center gap-1 sm:gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious || loading}
          className="relative inline-flex items-center rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        {/* Mostrar menos páginas en móvil */}
        <div className="hidden sm:flex gap-1">
          {pages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={loading}
              className={`relative inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold ${
                page === currentPage
                  ? 'bg-purple-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              } rounded-md disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Indicador de página actual en móvil */}
        <div className="sm:hidden inline-flex items-center px-3 py-2 text-xs font-semibold bg-purple-100 text-purple-800 rounded-md">
          {currentPage} / {totalPages}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext || loading}
          className="relative inline-flex items-center rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}