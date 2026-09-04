import type { ColumnDef } from "../../data-grid/types";
import type { Product } from "../../types/products";

export const ProductColumns: ColumnDef<Product>[] = [
    {
        id: "id",
        header: "ID",
        accessorKey: "id",
        width: 75,
        minWidth: 60,
        sortable: true,
        align: "right",
        cell: ({ getValue }) => (
            <span className="font-mono text-xs font-semibold text-slate-400">
                #{String(getValue()).padStart(3, "0")}
            </span>
        ),
    },
    {
        id: "title",
        header: "Product",
        accessorKey: "title",
        width: 280,
        minWidth: 200,
        sortable: true,
        filterable: true,
        cell: ({ row }) => (
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-slate-200/80 bg-slate-100 shadow-xs">
                    <img
                        src={row.thumbnail}
                        alt={row.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.style.display = "none";
                        }}
                    />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="truncate text-sm font-semibold text-slate-900 tracking-tight" title={row.title}>
                        {row.title}
                    </span>
                    {row.brand && (
                        <span className="truncate text-xs text-slate-400 font-normal">
                            {row.brand}
                        </span>
                    )}
                </div>
            </div>
        ),
    },
    {
        id: "category",
        header: "Category",
        accessorKey: "category",
        width: 140,
        minWidth: 110,
        sortable: true,
        filterable: true,
        cell: ({ getValue }) => {
            const val = String(getValue() ?? "general");
            return (
                <span className="inline-flex items-center rounded-md border border-slate-200/70 bg-slate-100/70 px-2 py-0.5 text-xs font-medium capitalize text-slate-600">
                    {val.replace(/-/g, " ")}
                </span>
            );
        },
    },
    {
        id: "price",
        header: "Price",
        accessorKey: "price",
        width: 110,
        minWidth: 90,
        sortable: true,
        align: "right",
        cell: ({ getValue }) => {
            const price = Number(getValue() ?? 0);
            return (
                <span className="font-semibold text-slate-900 tabular-nums">
                    ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            );
        },
    },
    {
        id: "rating",
        header: "Rating",
        accessorKey: "rating",
        width: 110,
        minWidth: 90,
        sortable: true,
        align: "right",
        cell: ({ getValue }) => {
            const rating = Number(getValue() ?? 0);
            return (
                <div className="inline-flex items-center gap-1.5 font-medium tabular-nums text-slate-700">
                    <svg
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>{rating.toFixed(2)}</span>
                </div>
            );
        },
    },
    {
        id: "stock",
        header: "Stock",
        accessorKey: "stock",
        width: 95,
        minWidth: 80,
        sortable: true,
        align: "right",
        cell: ({ getValue }) => {
            const stock = Number(getValue() ?? 0);
            return (
                <span
                    className={`font-mono text-xs font-semibold tabular-nums ${
                        stock < 10 ? "text-rose-600" : stock < 30 ? "text-amber-600" : "text-slate-600"
                    }`}
                >
                    {stock} pcs
                </span>
            );
        },
    },
    {
        id: "availabilityStatus",
        header: "Status",
        accessorKey: "availabilityStatus",
        width: 140,
        minWidth: 120,
        sortable: true,
        filterable: true,
        cell: ({ getValue }) => {
            const v = String(getValue() ?? "");
            const isInStock = v.toLowerCase().includes("in stock");
            const isLowStock = v.toLowerCase().includes("low");

            const colorConfig = isInStock
                ? {
                      bg: "bg-emerald-50/80 border-emerald-200/60 text-emerald-800",
                      dot: "bg-emerald-500 ring-emerald-200",
                  }
                : isLowStock
                  ? {
                        bg: "bg-amber-50/80 border-amber-200/60 text-amber-800",
                        dot: "bg-amber-500 ring-amber-200",
                    }
                  : {
                        bg: "bg-rose-50/80 border-rose-200/60 text-rose-800",
                        dot: "bg-rose-500 ring-rose-200",
                    };

            return (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium shadow-2xs ${colorConfig.bg}`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ring-2 ${colorConfig.dot}`}
                    />
                    {v || "Unavailable"}
                </span>
            );
        },
    },
];

