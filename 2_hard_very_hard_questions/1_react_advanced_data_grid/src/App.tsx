import { useMemo } from "react";
import { ProductColumns } from "./components/product-grid/product-columns";
import { useDataGrid } from "./data-grid/use-data-grid";
import useProducts from "./hooks/use-products";
import type { Product } from "./types/products";
import { DataGrid } from "./data-grid/data-grid";

export default function App() {
    const state = useDataGrid<Product>({
        columns: ProductColumns,
        initialPageSize: 50,
        initialPinned: {
            id: "left",
            title: "left",
            availabilityStatus: "right",
        },
    });

    const { data, total, loading, error, refetch } = useProducts({
        page: state.page,
        pageSize: state.pageSize,
        search: state.globalFilter,
    });

    const getRowId = useMemo(() => (row: Product) => row.id, []);

    const selectedTotal = useMemo(
        () => Object.values(state.rowSelection).filter(Boolean).length,
        [state.rowSelection],
    );

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 overflow-hidden font-sans antialiased">
            {/* Minimalist Top App Navigation */}
            <header className="shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-3.5 dark:border-slate-800/80 dark:bg-slate-900/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                Product Catalog
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                High-performance virtualized data grid with pinned columns
                            </p>
                        </div>
                    </div>

                    {/* Header Badges & Actions */}
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {total > 0 ? `${total.toLocaleString()} products` : "Connecting…"}
                        </span>

                        {selectedTotal > 0 && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                                {selectedTotal} selected
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-98 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            title="Refresh data"
                        >
                            <svg
                                className={`h-3.5 w-3.5 ${loading ? "animate-spin text-indigo-600" : ""}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" />
                            </svg>
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Viewport: Grid is constrained to fit inside screen */}
            <main className="flex-1 min-h-0 p-4 sm:p-6 flex flex-col">
                <div className="mx-auto flex-1 min-h-0 w-full max-w-7xl flex flex-col">
                    <DataGrid<Product>
                        columns={ProductColumns}
                        data={data}
                        total={total}
                        loading={loading}
                        error={error}
                        onRetry={refetch}
                        sorting={state.sorting}
                        onSort={state.toggleSort}
                        globalFilter={state.globalFilter}
                        onGlobalFilterChange={state.setGlobalFilter}
                        columnWidths={state.columnWidths}
                        onColumnResize={state.setColumnWidth}
                        pinned={state.pinned}
                        onTogglePin={state.togglePin}
                        rowSelection={state.rowSelection}
                        onToggleRow={state.toggleRow}
                        onToggleAll={state.toggleAllCurrentPage}
                        page={state.page}
                        pageSize={state.pageSize}
                        onPageChange={state.setPage}
                        onPageSizeChange={state.setPageSize}
                        pageSizeOptions={[25, 50, 100, 200]}
                        getRowId={getRowId}
                        height="100%"
                        className="flex-1 min-h-0"
                    />
                </div>
            </main>
        </div>
    );
}

