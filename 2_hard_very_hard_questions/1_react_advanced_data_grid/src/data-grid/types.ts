import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc" | false;
export type PinSide = "left" | "right" | false;

export interface SortState {
    id: string;
    direction: SortDirection;
}

export interface CellContext<T> {
    row: T;
    value: unknown;
    getValue: () => unknown;
}

export interface HeaderContext<T> {
    column: ColumnDef<T>;
    sort?: SortState;
    isPinned: PinSide;
}

export interface ColumnDef<T> {
    id: string;
    header: string | ((ctx: HeaderContext<T>) => ReactNode);
    accessorKey?: keyof T & string;
    accessorFn?: (row: T) => unknown;
    width: number;
    minWidth?: number;
    maxWidth?: number;
    sortable?: boolean;
    filterable?: boolean;
    pinned?: boolean;
    resizable?: boolean;
    align?: "left" | "center" | "right";
    cell?: (ctx: CellContext<T>) => ReactNode;
}

export interface DataGridProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    total: number;
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    // Sorting
    sorting: SortState[];
    onSort: (id: string, multi?: boolean) => void;
    // Filtering
    globalFilter: string;
    onGlobalFilterChange: (value: string) => void;
    // Column widths & resizing
    columnWidths: Record<string, number>;
    onColumnResize: (id: string, width: number) => void;
    // Pinning
    pinned: Record<string, PinSide>;
    onTogglePin: (id: string) => void;
    // Row selection
    rowSelection: Record<string | number, boolean>;
    onToggleRow: (id: string | number) => void;
    onToggleAll: (ids: (string | number)[], selected: boolean) => void;
    // Pagination
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
    // Row identity
    getRowId: (row: T) => string | number;
    // Sizing & Appearance
    height?: number | string;
    className?: string;
}

