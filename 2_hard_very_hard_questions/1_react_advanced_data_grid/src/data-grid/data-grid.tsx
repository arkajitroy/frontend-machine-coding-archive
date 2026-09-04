import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useVirtualizer } from "./use-virtualizer";
import type { ColumnDef, DataGridProps } from "./types";

const ROW_HEIGHT = 52;
const HEADER_HEIGHT = 44;
const CHECKBOX_WIDTH = 48;

function getCellValue<T>(row: T, col: ColumnDef<T>): unknown {
  if (col.accessorFn) return col.accessorFn(row);
  if (col.accessorKey) {
    return (row as Record<string, unknown>)[col.accessorKey];
  }
  return undefined;
}

function compareValues(a: unknown, b: unknown, dir: "asc" | "desc"): number {
  const mul = dir === "asc" ? 1 : -1;
  if (a == null && b == null) return 0;
  if (a == null) return -1 * mul;
  if (b == null) return 1 * mul;
  if (typeof a === "number" && typeof b === "number") return (a - b) * mul;
  return (
    String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: "base",
    }) * mul
  );
}

export function DataGrid<T>({
  columns,
  data,
  total,
  loading = false,
  error = null,
  onRetry,
  sorting,
  onSort,
  globalFilter,
  onGlobalFilterChange,
  columnWidths,
  onColumnResize,
  pinned,
  onTogglePin,
  rowSelection,
  onToggleRow,
  onToggleAll,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100, 200],
  getRowId,
  height = "100%",
  className = "",
}: DataGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [resizingColId, setResizingColId] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Track parent element's available width for auto-fitting columns
  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === el) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Client-side multi-sort (if data passed as a page)
  const processedData = useMemo(() => {
    if (!sorting.length) return data;
    const rows = [...data];
    rows.sort((a, b) => {
      for (const s of sorting) {
        if (!s.direction) continue;
        const col = columns.find((c) => c.id === s.id);
        if (!col) continue;
        const res = compareValues(
          getCellValue(a, col),
          getCellValue(b, col),
          s.direction,
        );
        if (res !== 0) return res;
      }
      return 0;
    });
    return rows;
  }, [data, columns, sorting]);

  // Virtualization hook
  const { virtualItems, totalSize, offsetY } = useVirtualizer({
    count: processedData.length,
    estimateSize: ROW_HEIGHT,
    getScrollElement: () => parentRef.current,
  });

  const currentPageIds = useMemo(
    () => processedData.map(getRowId),
    [processedData, getRowId],
  );
  const selectedCurrentPageCount = useMemo(
    () => currentPageIds.filter((id) => rowSelection[id]).length,
    [currentPageIds, rowSelection],
  );
  const isAllPageSelected =
    currentPageIds.length > 0 &&
    selectedCurrentPageCount === currentPageIds.length;
  const isSomePageSelected = selectedCurrentPageCount > 0 && !isAllPageSelected;

  const totalSelectedCount = useMemo(
    () => Object.values(rowSelection).filter(Boolean).length,
    [rowSelection],
  );

  // Column Partitioning (Left pinned, Center normal, Right pinned)
  const leftPinnedCols = useMemo(
    () => columns.filter((c) => pinned[c.id] === "left"),
    [columns, pinned],
  );
  const rightPinnedCols = useMemo(
    () => columns.filter((c) => pinned[c.id] === "right"),
    [columns, pinned],
  );
  const centerCols = useMemo(
    () => columns.filter((c) => !pinned[c.id]),
    [columns, pinned],
  );

  const orderedColumns = useMemo(
    () => [...leftPinnedCols, ...centerCols, ...rightPinnedCols],
    [leftPinnedCols, centerCols, rightPinnedCols],
  );

  // Auto-fit column widths: proportionally distribute available container space so columns fit edge-to-edge
  const effectiveWidths = useMemo(() => {
    const rawTotal = orderedColumns.reduce(
      (sum, c) => sum + (columnWidths[c.id] ?? c.width),
      0,
    );
    const availableWidth = Math.max(0, containerWidth - CHECKBOX_WIDTH);

    if (availableWidth > rawTotal && rawTotal > 0) {
      const ratio = availableWidth / rawTotal;
      const result: Record<string, number> = {};
      let allocated = 0;

      orderedColumns.forEach((c, idx) => {
        if (idx === orderedColumns.length - 1) {
          result[c.id] = Math.max(c.minWidth ?? 40, availableWidth - allocated);
        } else {
          const baseW = columnWidths[c.id] ?? c.width;
          const scaledW = Math.round(baseW * ratio);
          result[c.id] = scaledW;
          allocated += scaledW;
        }
      });
      return result;
    }

    const result: Record<string, number> = {};
    orderedColumns.forEach((c) => {
      result[c.id] = columnWidths[c.id] ?? c.width;
    });
    return result;
  }, [orderedColumns, columnWidths, containerWidth]);

  // Calculate sticky horizontal offsets
  const leftOffsets = useMemo(() => {
    const map: Record<string, number> = {};
    let acc = CHECKBOX_WIDTH;
    leftPinnedCols.forEach((c) => {
      map[c.id] = acc;
      acc += effectiveWidths[c.id] ?? c.width;
    });
    return map;
  }, [leftPinnedCols, effectiveWidths]);

  const rightOffsets = useMemo(() => {
    const map: Record<string, number> = {};
    let acc = 0;
    [...rightPinnedCols].reverse().forEach((c) => {
      map[c.id] = acc;
      acc += effectiveWidths[c.id] ?? c.width;
    });
    return map;
  }, [rightPinnedCols, effectiveWidths]);

  const totalColumnsWidth = useMemo(
    () =>
      Math.max(
        containerWidth,
        CHECKBOX_WIDTH +
          orderedColumns.reduce(
            (sum, c) => sum + (effectiveWidths[c.id] ?? c.width),
            0,
          ),
      ),
    [containerWidth, orderedColumns, effectiveWidths],
  );

  // Resizing Handler
  const handleResizeMouseDown = useCallback(
    (id: string, startX: number, startWidth: number, e: ReactMouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setResizingColId(id);

      const col = columns.find((c) => c.id === id);
      const minW = col?.minWidth ?? 60;
      const maxW = col?.maxWidth ?? 700;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = Math.max(minW, Math.min(maxW, startWidth + deltaX));
        onColumnResize(id, newWidth);
      };

      const onMouseUp = () => {
        setResizingColId(null);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [columns, onColumnResize],
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startRecord = total === 0 ? 0 : page * pageSize + 1;
  const endRecord = Math.min((page + 1) * pageSize, total);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:border-slate-800 dark:bg-slate-900 ${className}`}
      style={{ height }}
      role="region"
      aria-label="Data Grid"
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="relative flex min-w-[240px] max-w-sm flex-1 items-center">
          <svg
            className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="search"
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
            placeholder="Search products, brands, categories…"
            className="h-9 w-full rounded-lg border border-slate-200/90 bg-white pl-9 pr-8 text-sm text-slate-900 placeholder-slate-400 shadow-2xs transition-all focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {globalFilter && (
            <button
              type="button"
              onClick={() => onGlobalFilterChange("")}
              className="absolute right-2.5 flex h-4 w-4 items-center justify-center rounded-full text-xs text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
          {totalSelectedCount > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-2.5 py-1 text-indigo-700 dark:border-indigo-800/80 dark:bg-indigo-950/40 dark:text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              <span>{totalSelectedCount} selected</span>
              <button
                type="button"
                onClick={() => onToggleAll(currentPageIds, false)}
                className="ml-1 text-xs font-semibold text-indigo-800 underline-offset-2 hover:underline dark:text-indigo-200"
              >
                Clear
              </button>
            </div>
          )}

          <span className="tabular-nums">
            {loading ? "Updating…" : `${total.toLocaleString()} total items`}
          </span>
        </div>
      </header>

      <div
        ref={parentRef}
        className="flex-1 min-h-0 overflow-auto relative select-text"
        role="grid"
        aria-rowcount={processedData.length}
        aria-colcount={orderedColumns.length + 1}
        tabIndex={0}
      >
        <div
          className="sticky top-0 z-30 flex border-b border-slate-200/90 bg-slate-50 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          style={{
            width: totalColumnsWidth,
            minWidth: "100%",
            height: HEADER_HEIGHT,
          }}
          role="row"
        >
          <div
            className="sticky left-0 z-40 flex items-center justify-center border-r border-slate-200/80 bg-slate-50 px-3 shrink-0 dark:border-slate-800 dark:bg-slate-900"
            style={{ width: CHECKBOX_WIDTH, height: HEADER_HEIGHT }}
            role="columnheader"
          >
            <input
              type="checkbox"
              checked={isAllPageSelected}
              ref={(el) => {
                if (el) el.indeterminate = isSomePageSelected;
              }}
              onChange={() => onToggleAll(currentPageIds, !isAllPageSelected)}
              aria-label="Select all items on this page"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          {orderedColumns.map((col) => {
            const isLeft = pinned[col.id] === "left";
            const isRight = pinned[col.id] === "right";
            const sort = sorting.find((s) => s.id === col.id);
            const sortIndex =
              sorting.length > 1
                ? sorting.findIndex((s) => s.id === col.id)
                : -1;
            const width = effectiveWidths[col.id] ?? col.width;
            const isResizing = resizingColId === col.id;

            const headerLabel =
              typeof col.header === "function"
                ? col.header({
                    column: col,
                    sort,
                    isPinned: pinned[col.id] ?? false,
                  })
                : col.header;

            return (
              <div
                key={col.id}
                role="columnheader"
                aria-sort={
                  sort?.direction === "asc"
                    ? "ascending"
                    : sort?.direction === "desc"
                      ? "descending"
                      : "none"
                }
                className={`group relative flex items-center justify-between border-r border-slate-200/80 px-3 text-xs font-semibold tracking-wider text-slate-600 uppercase select-none transition-colors dark:border-slate-800 dark:text-slate-400 ${
                  isLeft || isRight
                    ? "z-40 bg-slate-50/95 backdrop-blur-xs dark:bg-slate-900/95"
                    : "bg-slate-50 dark:bg-slate-900"
                } ${
                  isLeft &&
                  leftPinnedCols[leftPinnedCols.length - 1]?.id === col.id
                    ? "shadow-[4px_0_8px_-2px_rgba(0,0,0,0.06)]"
                    : ""
                } ${
                  isRight && rightPinnedCols[0]?.id === col.id
                    ? "shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.06)]"
                    : ""
                }`}
                style={{
                  width,
                  minWidth: width,
                  height: HEADER_HEIGHT,
                  left: isLeft ? leftOffsets[col.id] : undefined,
                  right: isRight ? rightOffsets[col.id] : undefined,
                  position: isLeft || isRight ? "sticky" : "relative",
                }}
              >
                <button
                  type="button"
                  onClick={(e) =>
                    col.sortable !== false && onSort(col.id, e.shiftKey)
                  }
                  disabled={col.sortable === false}
                  title={
                    col.sortable !== false
                      ? `Sort by ${typeof col.header === "string" ? col.header : col.id} (Shift+Click for multi-sort)`
                      : undefined
                  }
                  className={`flex flex-1 items-center gap-1.5 text-left truncate transition-colors ${
                    col.align === "right"
                      ? "justify-end"
                      : col.align === "center"
                        ? "justify-center"
                        : "justify-start"
                  } ${
                    col.sortable !== false
                      ? "cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
                      : "cursor-default"
                  } ${sort ? "text-indigo-600 font-bold dark:text-indigo-400" : ""}`}
                >
                  <span className="truncate">{headerLabel}</span>
                  {col.sortable !== false && (
                    <span className="flex shrink-0 items-center text-slate-400">
                      {sort?.direction === "asc" ? (
                        <svg
                          className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
                            clipRule="evenodd"
                            transform="rotate(180 10 10)"
                          />
                        </svg>
                      ) : sort?.direction === "desc" ? (
                        <svg
                          className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-40"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a.75.75 0 0 1 .55.24l3.25 3.5a.75.75 0 1 1-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 0 1-1.1-1.02l3.25-3.5A.75.75 0 0 1 10 3Zm-3.25 9.74a.75.75 0 0 1 1.1 1.02L10 15.148l2.7-2.908a.75.75 0 1 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0l-3.25-3.5a.75.75 0 0 1 0-1.02Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {sortIndex >= 0 && (
                        <span className="ml-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                          {sortIndex + 1}
                        </span>
                      )}
                    </span>
                  )}
                </button>

                {col.pinned !== false && (
                  <button
                    type="button"
                    onClick={() => onTogglePin(col.id)}
                    className={`ml-1 flex h-6 w-6 items-center justify-center rounded-md text-xs transition-opacity ${
                      isLeft || isRight
                        ? "text-indigo-600 opacity-100 dark:text-indigo-400"
                        : "text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                    title={
                      isLeft
                        ? "Pinned left (click to pin right)"
                        : isRight
                          ? "Pinned right (click to unpin)"
                          : "Pin column"
                    }
                  >
                    {isLeft ? "⇤" : isRight ? "⇥" : "📌"}
                  </button>
                )}

                {col.resizable !== false && (
                  <div
                    className={`absolute right-0 top-0 h-full w-2 cursor-col-resize touch-none select-none ${
                      isResizing
                        ? "bg-indigo-500"
                        : "hover:bg-indigo-400/80 active:bg-indigo-600"
                    }`}
                    onMouseDown={(e) =>
                      handleResizeMouseDown(col.id, e.clientX, width, e)
                    }
                  />
                )}
              </div>
            );
          })}
        </div>

        {loading && processedData.length === 0 ? (
          <div className="p-4 space-y-2" style={{ width: totalColumnsWidth }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex h-12 w-full animate-pulse items-center gap-4 rounded-lg bg-slate-100/80 px-4 dark:bg-slate-800/60"
              >
                <div className="h-4 w-6 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-44 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="ml-auto h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex h-72 flex-col items-center justify-center gap-3 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Failed to load data
              </h4>
              <p className="text-xs text-slate-500 max-w-sm">{error}</p>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-1 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Try again
              </button>
            )}
          </div>
        ) : processedData.length === 0 ? (
          <div className="flex h-72 flex-col items-center justify-center gap-3 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                No records found
              </h4>
              <p className="text-xs text-slate-500">
                {globalFilter
                  ? `No matches found for "${globalFilter}"`
                  : "No data available."}
              </p>
            </div>
            {globalFilter && (
              <button
                type="button"
                onClick={() => onGlobalFilterChange("")}
                className="mt-1 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              height: totalSize,
              position: "relative",
              width: totalColumnsWidth,
            }}
          >
            <div
              style={{
                transform: `translateY(${offsetY}px)`,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              {virtualItems.map((vi) => {
                const row = processedData[vi.index];
                if (!row) return null;
                const id = getRowId(row);
                const selected = !!rowSelection[id];

                return (
                  <div
                    key={id}
                    role="row"
                    aria-rowindex={vi.index + 1}
                    aria-selected={selected}
                    className={`group/row flex border-b border-slate-100/90 transition-colors duration-100 dark:border-slate-800/80 ${
                      selected
                        ? "bg-indigo-50/70 dark:bg-indigo-950/30"
                        : "bg-white hover:bg-slate-50/80 dark:bg-slate-900 dark:hover:bg-slate-800/60"
                    }`}
                    style={{ height: ROW_HEIGHT }}
                  >
                    <div
                      className={`sticky left-0 z-20 flex items-center justify-center border-r border-slate-100 px-3 shrink-0 transition-colors dark:border-slate-800 ${
                        selected
                          ? "bg-indigo-50/95 dark:bg-indigo-950/90"
                          : "bg-white group-hover/row:bg-slate-50/95 dark:bg-slate-900 dark:group-hover/row:bg-slate-800/95"
                      }`}
                      style={{ width: CHECKBOX_WIDTH, height: ROW_HEIGHT }}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onToggleRow(id)}
                        aria-label={`Select row ${vi.index + 1}`}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-800"
                      />
                    </div>

                    {orderedColumns.map((col) => {
                      const isLeft = pinned[col.id] === "left";
                      const isRight = pinned[col.id] === "right";
                      const width = effectiveWidths[col.id] ?? col.width;
                      const value = getCellValue(row, col);

                      return (
                        <div
                          key={col.id}
                          role="gridcell"
                          className={`flex items-center px-3 text-sm text-slate-800 truncate border-r border-slate-100/70 transition-colors dark:border-slate-800/60 dark:text-slate-200 ${
                            isLeft || isRight
                              ? `z-20 ${
                                  selected
                                    ? "bg-indigo-50/95 dark:bg-indigo-950/90"
                                    : "bg-white group-hover/row:bg-slate-50/95 dark:bg-slate-900 dark:group-hover/row:bg-slate-800/95"
                                }`
                              : ""
                          } ${
                            isLeft &&
                            leftPinnedCols[leftPinnedCols.length - 1]?.id ===
                              col.id
                              ? "shadow-[4px_0_8px_-2px_rgba(0,0,0,0.06)]"
                              : ""
                          } ${
                            isRight && rightPinnedCols[0]?.id === col.id
                              ? "shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.06)]"
                              : ""
                          } ${
                            col.align === "right"
                              ? "justify-end"
                              : col.align === "center"
                                ? "justify-center"
                                : "justify-start"
                          }`}
                          style={{
                            width,
                            minWidth: width,
                            height: ROW_HEIGHT,
                            left: isLeft ? leftOffsets[col.id] : undefined,
                            right: isRight ? rightOffsets[col.id] : undefined,
                            position: isLeft || isRight ? "sticky" : "relative",
                          }}
                        >
                          {col.cell
                            ? col.cell({ row, value, getValue: () => value })
                            : String(value ?? "")}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200/70 bg-slate-50/80 px-4 py-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(0);
            }}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="tabular-nums font-medium">
            {total > 0
              ? `${startRecord}–${endRecord} of ${total.toLocaleString()}`
              : "0 of 0"}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 0 || loading}
              onClick={() => onPageChange(0)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              title="First page"
            >
              «
            </button>
            <button
              type="button"
              disabled={page === 0 || loading}
              onClick={() => onPageChange(page - 1)}
              className="flex h-8 px-2.5 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              title="Previous page"
            >
              <span>‹</span>
              <span className="hidden sm:inline">Prev</span>
            </button>

            <span className="px-2 font-medium tabular-nums text-slate-700 dark:text-slate-200">
              Page {page + 1} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page + 1 >= totalPages || loading}
              onClick={() => onPageChange(page + 1)}
              className="flex h-8 px-2.5 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              title="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <span>›</span>
            </button>
            <button
              type="button"
              disabled={page + 1 >= totalPages || loading}
              onClick={() => onPageChange(totalPages - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              title="Last page"
            >
              »
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const MemoDataGrid = memo(DataGrid) as typeof DataGrid;
