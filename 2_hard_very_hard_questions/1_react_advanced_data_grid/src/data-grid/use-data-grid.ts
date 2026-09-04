import { useCallback, useState } from "react";
import type { ColumnDef, SortState, PinSide } from "./types";

interface UseDataGridOptions<T> {
    initialPageSize?: number;
    initialSorting?: SortState[];
    initialPinned?: Record<string, PinSide>;
    columns: ColumnDef<T>[];
}

export function useDataGrid<T>(
    columnsOrOptions: ColumnDef<T>[] | UseDataGridOptions<T>,
) {
    const isOptions = !Array.isArray(columnsOrOptions);
    const columns = isOptions ? columnsOrOptions.columns : columnsOrOptions;
    const initialPageSize = isOptions ? (columnsOrOptions.initialPageSize ?? 50) : 50;
    const initialSorting = isOptions ? (columnsOrOptions.initialSorting ?? []) : [];
    const initialPinned = isOptions ? (columnsOrOptions.initialPinned ?? {}) : {};

    const [sorting, setSorting] = useState<SortState[]>(initialSorting);
    const [globalFilter, setGlobalFilterState] = useState("");
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() =>
        Object.fromEntries(columns.map((c) => [c.id, c.width])),
    );
    const [pinned, setPinned] = useState<Record<string, PinSide>>(initialPinned);
    const [rowSelection, setRowSelection] = useState<Record<string | number, boolean>>({});
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const setGlobalFilter = useCallback((v: string) => {
        setGlobalFilterState(v);
        setPage(0); // Reset to first page on search query change
    }, []);

    const toggleSort = useCallback((id: string, multi = false) => {
        setSorting((prev) => {
            const existing = prev.find((s) => s.id === id);
            if (!existing) {
                const next: SortState = { id, direction: "asc" };
                return multi ? [...prev, next] : [next];
            }
            if (existing.direction === "asc") {
                const next: SortState = { id, direction: "desc" };
                return multi ? prev.map((s) => (s.id === id ? next : s)) : [next];
            }
            // Remove sort
            return multi ? prev.filter((s) => s.id !== id) : [];
        });
    }, []);

    const setColumnWidth = useCallback((id: string, width: number) => {
        setColumnWidths((prev) => ({ ...prev, [id]: width }));
    }, []);

    const togglePin = useCallback((id: string) => {
        setPinned((prev) => {
            const current = prev[id] ?? false;
            const next: PinSide = current === false ? "left" : current === "left" ? "right" : false;
            return { ...prev, [id]: next };
        });
    }, []);

    const toggleRow = useCallback((id: string | number) => {
        setRowSelection((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);

    const toggleAllCurrentPage = useCallback((ids: (string | number)[], selected: boolean) => {
        setRowSelection((prev) => {
            const next = { ...prev };
            ids.forEach((id) => {
                if (selected) {
                    next[id] = true;
                } else {
                    delete next[id];
                }
            });
            return next;
        });
    }, []);

    const clearSelection = useCallback(() => {
        setRowSelection({});
    }, []);

    const resetFilters = useCallback(() => {
        setGlobalFilterState("");
        setColumnFilters({});
        setPage(0);
    }, []);

    return {
        sorting,
        setSorting,
        toggleSort,
        globalFilter,
        setGlobalFilter,
        columnFilters,
        setColumnFilters,
        columnWidths,
        setColumnWidth,
        pinned,
        setPinned,
        togglePin,
        rowSelection,
        setRowSelection,
        toggleRow,
        toggleAllCurrentPage,
        clearSelection,
        resetFilters,
        page,
        setPage,
        pageSize,
        setPageSize,
    };
}

