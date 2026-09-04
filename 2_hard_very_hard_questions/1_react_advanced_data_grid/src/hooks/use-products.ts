import { useCallback, useEffect, useState } from "react";
import type { Product, ProductsResponse } from "../types/products";

interface UseProductsParams {
    page: number;
    pageSize: number;
    search?: string;
    debounceMs?: number;
}

const API_BASE_URL = "https://dummyjson.com/products";

export default function useProducts({
    page,
    pageSize,
    search = "",
    debounceMs = 300,
}: UseProductsParams) {
    const [data, setData] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Debounce search state
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [retryTrigger, setRetryTrigger] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, debounceMs);
        return () => clearTimeout(timer);
    }, [search, debounceMs]);

    const refetch = useCallback(() => {
        setRetryTrigger((c) => c + 1);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchProducts() {
            setLoading(true);
            setError(null);

            try {
                const skip = page * pageSize;
                const isSearching = debouncedSearch.trim().length > 0;
                const url = new URL(
                    isSearching ? `${API_BASE_URL}/search` : API_BASE_URL,
                );

                url.searchParams.set("limit", String(pageSize));
                url.searchParams.set("skip", String(skip));

                if (isSearching) {
                    url.searchParams.set("q", debouncedSearch.trim());
                }

                const response = await fetch(url.toString(), { signal });
                if (!response.ok) {
                    throw new Error(`Failed to fetch products (HTTP ${response.status})`);
                }

                const json: ProductsResponse = await response.json();
                setData(json.products ?? []);
                setTotal(json.total ?? 0);
            } catch (err) {
                if (signal.aborted) return;
                const message = err instanceof Error ? err.message : "An unexpected error occurred";
                setError(message);
                setData([]);
                setTotal(0);
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchProducts();

        return () => {
            controller.abort();
        };
    }, [page, pageSize, debouncedSearch, retryTrigger]);

    return {
        data,
        total,
        loading,
        error,
        refetch,
    };
}

