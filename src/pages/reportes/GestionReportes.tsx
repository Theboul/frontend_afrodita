import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  type FrecuenciaReporte,
  type GenerarReportePayload,
  type TipoReporte,
} from "../../services/reportes/reportesService";
import { useReportes } from "../../hooks/useReportes";
import {
  paymentService,
  type MetodoPago,
} from "../../services/ventas/paymentService";

const CHART_CONTAINER_HEIGHT = 320; // px
const MIN_BAR_HEIGHT_PERCENT = 3;
const BITACORA_TABLE_MAX_WIDTH = 1100; // px, limita el contenedor para scroll interno
const BITACORA_CARD_MAX_WIDTH = BITACORA_TABLE_MAX_WIDTH + 60;
const BITACORA_CHART_MAX_WIDTH = BITACORA_TABLE_MAX_WIDTH + 60;

const ensureUtf8Text = (value: string): string => {
  if (!value) return "";
  try {
    if (typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined") {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder("utf-8");
      return decoder.decode(encoder.encode(value));
    }
  } catch {
    // ignore and fallback to normalization
  }
  return value.normalize ? value.normalize("NFC") : value;
};

const formatCellValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";

  if (typeof value === "string") {
    const isIsoDate = /^\d{4}-\d{2}-\d{2}/.test(value);
    if (isIsoDate) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return ensureUtf8Text(parsed.toLocaleString());
      }
    }
    return ensureUtf8Text(value);
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value.toString() : "";
  }

  if (typeof value === "boolean") {
    return ensureUtf8Text(value ? "Sí" : "No");
  }

  if (value instanceof Date) {
    return ensureUtf8Text(value.toLocaleString());
  }

  try {
    return ensureUtf8Text(JSON.stringify(value));
  } catch {
    return ensureUtf8Text(String(value));
  }
};

const formatChartNumber = (value: number): string => {
  if (!Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
};

const formatChartLabel = (value: string | null | undefined): string =>
  ensureUtf8Text(value ? String(value) : "");

const getChartPointValue = (point: Record<string, any>): number => {
  if (typeof point.total === "number") {
    return Number(point.total);
  }

  const candidates = [
    "monto_total",
    "total_ventas",
    "cantidad",
    "total",
    "valor",
  ];

  for (const key of candidates) {
    if (typeof point[key] === "number") {
      return Number(point[key]);
    }
  }

  const dynamicKey = Object.keys(point).find(
    (key) => key !== "etiqueta" && typeof point[key] === "number"
  );

  return dynamicKey ? Number(point[dynamicKey]) : 0;
};

const DEFAULT_TIPO: TipoReporte = "VENTAS";
const PAGE_SIZE = 20;

export default function GestionReportes() {
  const {
    tipos,
    reporte,
    loadingTipos,
    loadingReporte,
    error,
    accionesBitacora,
    usuariosSugeridos,
    loadTipos,
    generarReporte,
    buscarUsuarios,
    clearError,
  } = useReportes();

  const [tipoReporte, setTipoReporte] = useState<TipoReporte>(DEFAULT_TIPO);
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");
  const [frecuencia, setFrecuencia] = useState<FrecuenciaReporte>("MENSUAL");
  const [topN, setTopN] = useState<number>(10);
  const [soloStockBajo, setSoloStockBajo] = useState<boolean>(false);
  const [estadoPromocion, setEstadoPromocion] =
    useState<"ACTIVAS" | "EXPIRADAS" | "TODAS">("TODAS");

  // Ventas: filtros adicionales
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<
    number | undefined
  >(undefined);
  const [clienteFiltro, setClienteFiltro] = useState<string>("");

  // Bitácora
  const [accionBitacora, setAccionBitacora] = useState<string>("");
  const [usuarioBusqueda, setUsuarioBusqueda] = useState<string>("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<{
    id_usuario: number;
    nombre_usuario: string;
  } | null>(null);

  // Paginación
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadTipos();

    // Cargar métodos de pago para el filtro de ventas
    (async () => {
      try {
        const res = await paymentService.getMetodosPago();
        if (res.success && res.data?.methods) {
          setMetodosPago(res.data.methods);
        }
      } catch {
        // silencioso, el reporte sigue funcionando sin este filtro
      }
    })();
  }, [loadTipos]);

  useEffect(() => {
    setPage(1);
  }, [tipoReporte]);

  const puedeExportar = useMemo(
    () =>
      !!reporte &&
      Array.isArray(reporte.resultados) &&
      reporte.resultados.length > 0,
    [reporte]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: GenerarReportePayload = {
      tipo_reporte: tipoReporte,
      fecha_desde: fechaDesde || undefined,
      fecha_hasta: fechaHasta || undefined,
    };

    if (tipoReporte === "VENTAS") {
      payload.frecuencia = frecuencia;
      if (metodoPagoSeleccionado) {
        payload.id_metodo_pago = metodoPagoSeleccionado;
      }
      if (clienteFiltro.trim()) {
        payload.cliente = clienteFiltro.trim();
      }
    }

    if (tipoReporte === "PRODUCTOS_MAS_VENDIDOS") {
      payload.top = topN;
    }

    if (tipoReporte === "INVENTARIO") {
      payload.solo_stock_bajo = soloStockBajo;
    }

    if (tipoReporte === "PROMOCIONES") {
      payload.estado_promocion = estadoPromocion;
    }

    if (tipoReporte === "BITACORA") {
      payload.accion = accionBitacora || undefined;
      if (usuarioSeleccionado) {
        payload.usuario_id = usuarioSeleccionado.id_usuario;
      }
    }

    setPage(1);
    generarReporte(payload);
  };

  const handleExportCsv = () => {
    if (!reporte || !reporte.resultados.length) return;

    const rows = reporte.resultados;
    const headers =
      columnas.length > 0 ? columnas : Object.keys(rows[0] ?? {});
    const csvRows: string[] = [];

    csvRows.push(
      headers
        .map((header) => ensureUtf8Text(header).replace(/"/g, '""'))
        .join(";")
    );

    for (const row of rows) {
      const values = headers.map((h) => {
        const value = formatCellValue(row[h]);
        return `"${value.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(";"));
    }

    const csvContent = "\ufeff" + csvRows.join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_${reporte.tipo_reporte.toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columnas = useMemo(() => {
    if (!reporte || !reporte.resultados.length) return [];

    if (tipoReporte === "BITACORA") {
      const ordenPreferido = [
        "id_bitacora",
        "fecha_hora",
        "accion",
        "descripcion",
        "ip",
        "id_usuario",
        "nombre_usuario",
      ];
      const keys = Object.keys(reporte.resultados[0]);
      return ordenPreferido.filter((c) => keys.includes(c));
    }

    return Object.keys(reporte.resultados[0]);
  }, [reporte, tipoReporte]);

  const paginatedResultados = useMemo(() => {
    if (!reporte) return [];
    const start = (page - 1) * PAGE_SIZE;
    return reporte.resultados.slice(start, start + PAGE_SIZE);
  }, [reporte, page]);

  const totalPages = useMemo(() => {
    if (!reporte) return 1;
    return Math.max(1, Math.ceil(reporte.resultados.length / PAGE_SIZE));
  }, [reporte]);

  const serieGrafico: {
    tipo: string;
    eje_x: string;
    eje_y: string;
    puntos: Array<Record<string, any>>;
  } | null = useMemo(() => {
    if (!reporte || !reporte.resumen) return null;
    const anyResumen = reporte.resumen as any;
    const serie = anyResumen?.serie_grafico;
    if (!serie || !Array.isArray(serie.puntos)) return null;
    return serie;
  }, [reporte]);

  const chartMetrics = useMemo(() => {
    if (!serieGrafico) {
      return { values: [] as number[], max: 1 };
    }
    const values = serieGrafico.puntos.map((point) => getChartPointValue(point));
    return {
      values,
      max: Math.max(...values, 1),
    };
  }, [serieGrafico]);

  const chartValues = chartMetrics.values;
  const chartMaxValue = chartMetrics.max;

  const handleExportChartCsv = () => {
    if (!serieGrafico) return;
    const rows = serieGrafico.puntos;
    const csvRows: string[] = [];
    csvRows.push(
      `${ensureUtf8Text(serieGrafico.eje_x)};${ensureUtf8Text(serieGrafico.eje_y)}`
    );
    rows.forEach((p, idx) => {
      const value = chartValues[idx] ?? 0;
      csvRows.push(
        `"${formatChartLabel(p.etiqueta)
          .replace(/"/g, '""')}";${formatChartNumber(value)}`
      );
    });
    const blob = new Blob(["\ufeff" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_${reporte?.tipo_reporte.toLowerCase()}_grafico.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportChartPdf = () => {
    if (!serieGrafico || !reporte) return;

    try {
      const orientation =
        serieGrafico.puntos.length > 8 ? "landscape" : "portrait";
      const doc = new jsPDF({ orientation, unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginX = 40;
      const chartHeight = 220;
      const chartTop = 90;
      const chartBottom = chartTop + chartHeight;
      const gap = 12;
      const points = serieGrafico.puntos;
      const safeMax = chartMaxValue <= 0 ? 1 : chartMaxValue;
      const title = ensureUtf8Text(`Gráfico de ${reporte.tipo_reporte}`);
      const subtitle = ensureUtf8Text(
        `${serieGrafico.eje_y} vs ${serieGrafico.eje_x}`
      );

      doc.setFont("helvetica", "normal");
      doc.setProperties({
        title,
        author: "Afrodita",
        subject: "Reporte de gráficos",
      });

      doc.setFontSize(16);
      doc.text(title, marginX, 40);
      doc.setFontSize(11);
      doc.text(subtitle, marginX, 60);

      const availableWidth = pageWidth - marginX * 2;
      const barWidth =
        points.length > 0
          ? Math.max(
              18,
              Math.min(
                60,
                (availableWidth - gap * Math.max(points.length - 1, 0)) /
                  points.length
              )
            )
          : 40;

      doc.setDrawColor(209, 213, 219);
      doc.line(marginX, chartBottom, pageWidth - marginX, chartBottom);

      points.forEach((p, idx) => {
        const value = chartValues[idx] ?? 0;
        const basePercent = safeMax > 0 ? (value / safeMax) * 100 : 5;
        const heightPercent = Math.max(basePercent, MIN_BAR_HEIGHT_PERCENT);
        const height = (heightPercent / 100) * chartHeight;
        const x = marginX + idx * (barWidth + gap);
        const y = chartBottom - height;
        doc.setFillColor(79, 70, 229);
        doc.rect(x, y, barWidth, Math.max(height, 2), "F");
        doc.setFontSize(9);
        const valueLabel = ensureUtf8Text(formatChartNumber(value));
        doc.text(valueLabel, x + barWidth / 2, y - 4, {
          align: "center",
        });
        doc.setFontSize(8);
        const safeLabel = formatChartLabel(p.etiqueta);
        doc.text(safeLabel, x + barWidth / 2, chartBottom + 12, {
          maxWidth: barWidth + 12,
          align: "center",
        });
      });

      doc.save(`reporte_${reporte.tipo_reporte.toLowerCase()}_grafico.pdf`);
    } catch (err) {
      console.error("No se pudo exportar el gráfico en PDF", err);
    }
  };

  const handleExportPdf = () => {
    if (!reporte || !columnas.length) return;

    try {
      const orientation =
        tipoReporte === "BITACORA" || columnas.length > 6
          ? "landscape"
          : "portrait";
      const doc = new jsPDF({ orientation, unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginX = 40;
      const title = ensureUtf8Text(`Reporte de ${reporte.tipo_reporte}`);
      const filtrosEntries = Object.entries(reporte.filtros || {}).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      );

      doc.setFont("helvetica", "normal");
      doc.setProperties({
        title,
        author: "Afrodita",
        subject: "Reporte de datos",
      });

      doc.setFontSize(16);
      doc.text(title, marginX, 40);

      let startY = 60;
      if (filtrosEntries.length) {
        doc.setFontSize(11);
        doc.text("Filtros aplicados:", marginX, startY);
        startY += 14;
        const filtrosTexto = filtrosEntries
          .map(([key, value]) => `${key}: ${formatCellValue(value)}`)
          .join(" | ");
        const wrapped = doc.splitTextToSize(
          filtrosTexto,
          pageWidth - marginX * 2
        );
        doc.text(wrapped, marginX, startY);
        startY += wrapped.length * 12 + 4;
      }

      const head = [columnas];
      const body = reporte.resultados.map((row) =>
        columnas.map((col) => formatCellValue(row[col]))
      );

      const columnStyles: Record<number, any> = {};
      columnas.forEach((col, idx) => {
        if (col === "descripcion") {
          columnStyles[idx] = { cellWidth: 220 };
        } else if (col.toLowerCase().includes("fecha")) {
          columnStyles[idx] = { cellWidth: 90 };
        }
      });

      autoTable(doc, {
        head,
        body,
        startY,
        margin: { left: marginX, right: marginX, bottom: 40 },
        styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak" },
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        columnStyles,
        didDrawPage: (data) => {
          doc.setFontSize(8);
          doc.text(
            `Generado: ${new Date().toLocaleString()}`,
            data.settings.margin.left,
            doc.internal.pageSize.getHeight() - 10
          );
        },
      });

      doc.save(`reporte_${reporte.tipo_reporte.toLowerCase()}.pdf`);
    } catch (err) {
      console.error("No se pudo exportar el PDF del reporte", err);
    }
  };

  const handleExportXlsx = () => {
    if (!reporte || !reporte.resultados.length) return;

    try {
      const headers =
        columnas.length > 0 ? columnas : Object.keys(reporte.resultados[0] ?? {});
      const sheetData = [
        headers.map((header) => ensureUtf8Text(header)),
        ...reporte.resultados.map((row) =>
          headers.map((col) => formatCellValue(row[col]))
        ),
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
      XLSX.writeFile(
        workbook,
        `reporte_${reporte.tipo_reporte.toLowerCase()}.xlsx`,
        { bookType: "xlsx", compression: true }
      );
    } catch (err) {
      console.error("No se pudo exportar el archivo XLSX del reporte", err);
    }
  };

  return (
    <div className="space-y-6 px-3 sm:px-6 md:px-8 py-4 overflow-x-hidden">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Gestión de Reportes
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Genera reportes sobre ventas, clientes, envíos, inventario,
            promociones y bitácora.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!puedeExportar}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
          >
            Exportar a CSV (Excel)
          </button>

          <button
            type="button"
            onClick={handleExportXlsx}
            disabled={!puedeExportar}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium"
          >
            Exportar Excel (.xlsx)
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={!puedeExportar}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-medium"
          >
            Exportar PDF
          </button>
        </div>
      </header>

      <section
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6"
        style={
          tipoReporte === "BITACORA"
            ? {
                maxWidth: `min(${BITACORA_CARD_MAX_WIDTH}px, calc(100vw - 3rem))`,
              }
            : undefined
        }
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Tipo de reporte
            </label>
            <select
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value as TipoReporte)}
              className="border rounded-md px-3 py-2 text-sm"
              disabled={loadingTipos}
            >
              {tipos.length === 0 && (
                <option value={DEFAULT_TIPO}>Ventas</option>
              )}
              {tipos.map((t) => (
                <option key={t.codigo} value={t.codigo}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Fecha desde
            </label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Fecha hasta
            </label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {tipoReporte === "VENTAS" && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Frecuencia
                </label>
                <select
                  value={frecuencia}
                  onChange={(e) =>
                    setFrecuencia(e.target.value as FrecuenciaReporte)
                  }
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="DIARIO">Diario</option>
                  <option value="MENSUAL">Mensual</option>
                  <option value="ANUAL">Anual</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Método de pago
                </label>
                <select
                  value={metodoPagoSeleccionado ?? ""}
                  onChange={(e) =>
                    setMetodoPagoSeleccionado(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  {metodosPago.map((m) => (
                    <option key={m.id_metodo_pago} value={m.id_metodo_pago}>
                      {m.tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Cliente (ID o nombre)
                </label>
                <input
                  type="text"
                  value={clienteFiltro}
                  onChange={(e) => setClienteFiltro(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm"
                  placeholder="Ej: 15 o Juan Pérez"
                />
              </div>
            </>
          )}

          {tipoReporte === "PRODUCTOS_MAS_VENDIDOS" && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Top N productos
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={topN}
                onChange={(e) => setTopN(Number(e.target.value) || 10)}
                className="border rounded-md px-3 py-2 text-sm"
              />
            </div>
          )}

          {tipoReporte === "INVENTARIO" && (
            <div className="flex items-center gap-2 mt-2 md:mt-6">
              <input
                id="solo_stock_bajo"
                type="checkbox"
                checked={soloStockBajo}
                onChange={(e) => setSoloStockBajo(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label
                htmlFor="solo_stock_bajo"
                className="text-sm text-gray-700"
              >
                Solo productos con bajo stock (≤ 10)
              </label>
            </div>
          )}

          {tipoReporte === "PROMOCIONES" && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Estado de promociones
              </label>
              <select
                value={estadoPromocion}
                onChange={(e) =>
                  setEstadoPromocion(
                    e.target.value as "ACTIVAS" | "EXPIRADAS" | "TODAS"
                  )
                }
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="TODAS">Todas</option>
                <option value="ACTIVAS">Solo activas</option>
                <option value="EXPIRADAS">Solo expiradas</option>
              </select>
            </div>
          )}

          {tipoReporte === "BITACORA" && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Acción
                </label>
                <select
                  value={accionBitacora}
                  onChange={(e) => setAccionBitacora(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Todas</option>
                  {accionesBitacora.map((a) => (
                    <option key={a.codigo} value={a.codigo}>
                      {a.codigo} - {a.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Usuario (nombre de usuario)
                </label>
                <input
                  type="text"
                  value={usuarioBusqueda}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUsuarioBusqueda(value);
                    setUsuarioSeleccionado(null);
                    buscarUsuarios(value);
                  }}
                  className="border rounded-md px-3 py-2 text-sm"
                  placeholder="Buscar por nombre de usuario"
                />
                {usuariosSugeridos.length > 0 && !usuarioSeleccionado && (
                  <div className="mt-1 border rounded-md bg-white shadow max-h-40 overflow-y-auto text-sm z-10">
                    {usuariosSugeridos.map((u) => (
                      <button
                        key={u.id_usuario}
                        type="button"
                        onClick={() => {
                          setUsuarioSeleccionado({
                            id_usuario: u.id_usuario,
                            nombre_usuario: u.nombre_usuario,
                          });
                          setUsuarioBusqueda(u.nombre_usuario);
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-gray-100"
                      >
                        {u.nombre_usuario} ({u.nombre_completo})
                      </button>
                    ))}
                  </div>
                )}
                {usuarioSeleccionado && (
                  <p className="text-xs text-gray-600 mt-1">
                    Seleccionado:{" "}
                    <span className="font-semibold">
                      {usuarioSeleccionado.nombre_usuario} (
                      {usuarioSeleccionado.id_usuario})
                    </span>
                  </p>
                )}
              </div>
            </>
          )}

          <div className="md:col-span-4 flex justify-start mt-2">
            <button
              type="submit"
              disabled={loadingReporte}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              {loadingReporte ? "Generando..." : "Generar reporte"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex justify-between items-center">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={clearError}
              className="text-red-600 hover:text-red-800 text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Resultado del reporte
        </h2>

        {!reporte && !loadingReporte && (
          <p className="text-sm text-gray-500">
            Completa los filtros y genera un reporte para ver los resultados.
          </p>
        )}

            {reporte && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-sm text-gray-700">
                <p className="font-medium">
                  Tipo:{" "}
                  <span className="font-normal">{reporte.tipo_reporte}</span>
                </p>
                <p className="mt-1">
                  Registros:{" "}
                  <span className="font-semibold">
                    {reporte.resultados.length}
                  </span>
                </p>
              </div>
            </div>

            {columnas.length > 0 && (
              <div className="w-full">
                <div className="rounded-lg border border-gray-200">
                  <div
                    className="w-full overflow-x-auto"
                    style={
                      tipoReporte === "BITACORA"
                        ? {
                            width: "100%",
                            maxWidth: `min(${BITACORA_TABLE_MAX_WIDTH}px, calc(100vw - 4rem))`,
                            marginLeft: 0,
                          }
                        : undefined
                    }
                  >
                    <table
                      className={
                        "text-xs sm:text-sm border border-gray-100" +
                        (tipoReporte === "BITACORA"
                          ? " min-w-[1000px]"
                          : " w-full table-auto")
                      }
                      >
                      <thead className="bg-gray-100">
                        <tr>
                          {columnas.map((col) => (
                            <th
                              key={col}
                              className={`text-left font-semibold text-gray-700 border-b ${
                                tipoReporte === "BITACORA"
                                  ? "px-0.5 py-0.5 text-[9px] sm:text-[10px]"
                                  : "px-2 py-1 text-xs sm:text-sm"
                              }`}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedResultados.map((row, idx) => (
                          <tr key={idx} className="border-b last:border-b-0">
                            {columnas.map((col) => {
                              const isBitacora = tipoReporte === "BITACORA";
                              const baseClasses =
                                isBitacora
                                  ? "px-0.5 py-0.5 text-[9px] sm:text-[10px] align-top"
                                  : "px-2 py-1 text-[11px] sm:text-xs align-top";

                              let wrapClasses = "whitespace-nowrap";

                              // En BITÁCORA permitimos que ciertas columnas se partan en varias líneas
                              if (
                                isBitacora &&
                                (col === "descripcion" || col === "fecha_hora")
                              ) {
                                wrapClasses =
                                  "whitespace-normal break-words break-all" +
                                  (col === "descripcion" ? " max-w-[34ch]" : "");
                              }

                              return (
                                <td
                                  key={col}
                                  className={`${baseClasses} ${wrapClasses}`}
                                >
                                  {formatCellValue(row[col])}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {reporte && totalPages > 1 && (
              <div className="flex items-center justify-between text-xs sm:text-sm mt-2">
                <span>
                  Página {page} de {totalPages}
                </span>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={page === totalPages}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {serieGrafico && (
        <section
          className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6"
          style={
            tipoReporte === "BITACORA"
              ? {
                  maxWidth: `min(${BITACORA_CHART_MAX_WIDTH}px, calc(100vw - 3rem))`,
                }
              : undefined
          }
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Gráfico estadístico
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                {serieGrafico.eje_y} vs {serieGrafico.eje_x}
              </p>
            </div>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={handleExportChartCsv}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Exportar datos (CSV/Excel)
              </button>
              <button
                type="button"
                onClick={handleExportChartPdf}
                className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
              >
                Exportar gráfico (PDF)
              </button>
            </div>
          </div>

          <div
            className="w-full overflow-x-auto"
            style={
              tipoReporte === "BITACORA"
                ? {
                    width: "100%",
                    maxWidth: `min(${BITACORA_CHART_MAX_WIDTH}px, calc(100vw - 3rem))`,
                  }
                : undefined
            }
          >
            <div
              className="border border-gray-200 flex items-end px-4 py-4 gap-2 rounded-md bg-white"
              style={{
                minHeight: `${CHART_CONTAINER_HEIGHT}px`,
                height: `${CHART_CONTAINER_HEIGHT}px`,
                minWidth:
                  serieGrafico.puntos.length > 8
                    ? `${serieGrafico.puntos.length * 72}px`
                    : "100%",
              }}
            >
              {serieGrafico.puntos.map((p, idx) => {
                const value = chartValues[idx] ?? 0;
                const basePercent =
                  chartMaxValue > 0 ? (value / chartMaxValue) * 100 : 0;
                const height = Math.max(basePercent, MIN_BAR_HEIGHT_PERCENT);
                const safeLabel = formatChartLabel(p.etiqueta);
                return (
                  <div
                    key={`${safeLabel || idx}-${idx}`}
                    className="flex flex-col items-center justify-end"
                  >
                    <div
                      className="bg-indigo-600 w-6 sm:w-8"
                      style={{ height: `${height}%` }}
                    />
                    <div className="mt-1 text-[10px] sm:text-xs max-w-[72px] text-center break-words">
                      {safeLabel}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-700">
                      {formatChartNumber(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
