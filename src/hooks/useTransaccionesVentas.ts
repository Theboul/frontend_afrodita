import { useCallback, useEffect, useState } from "react";
import {
  transaccionesService,
  type ListParams,
  type TransaccionVenta,
  type TransaccionesResponse,
} from "../services/ventas/transaccionesService";

interface PaginationState {
  page: number;
  pageSize: number;
  count: number;
  next: string | null;
  previous: string | null;
}

const getPageFromUrl = (url: string | null): number | null => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const p = parsed.searchParams.get("page");
    return p ? Number(p) : null;
  } catch {
    return null;
  }
};

export function useTransaccionesVentas(initialPageSize = 20) {
  const [transacciones, setTransacciones] = useState<TransaccionVenta[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: initialPageSize,
    count: 0,
    next: null,
    previous: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(
    async (params?: Partial<ListParams>) => {
      setLoading(true);
      setError(null);
      try {
        const page = params?.page ?? pagination.page;
        const pageSize = params?.page_size ?? pagination.pageSize;
        const res: TransaccionesResponse = await transaccionesService.list({
          page,
          page_size: pageSize,
        });
        setTransacciones(res.results ?? []);
        setPagination({
          page,
          pageSize,
          count: res.count ?? 0,
          next: res.next ?? null,
          previous: res.previous ?? null,
        });
      } catch (err: any) {
        const msg = err?.message ?? "No se pudieron cargar las transacciones";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize]
  );

  const nextPage = useCallback(() => {
    const nextPageNumber = getPageFromUrl(pagination.next);
    if (nextPageNumber) {
      cargar({ page: nextPageNumber });
    }
  }, [pagination.next, cargar]);

  const prevPage = useCallback(() => {
    const prevPageNumber = getPageFromUrl(pagination.previous);
    if (prevPageNumber) {
      cargar({ page: prevPageNumber });
    }
  }, [pagination.previous, cargar]);

  const changePageSize = useCallback(
    (size: number) => {
      setPagination((prev) => ({ ...prev, pageSize: size, page: 1 }));
      cargar({ page: 1, page_size: size });
    },
    [cargar]
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  return {
    transacciones,
    pagination,
    loading,
    error,
    cargar,
    nextPage,
    prevPage,
    changePageSize,
  };
}
