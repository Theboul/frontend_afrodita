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
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
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

        <div className="flex gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevious || loading}
            className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          {pages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={loading}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                page === currentPage
                  ? 'bg-purple-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              } rounded-md disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext || loading}
            className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}