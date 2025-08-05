import { useEffect, useState } from "react";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(
  URL: string,
  dependencies: unknown[] = []
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(URL, { signal });
        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.status}`);
        const json = await response.json();
        setData(json as T);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Unexpected error!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, dependencies);

  return { data, loading, error };
}
