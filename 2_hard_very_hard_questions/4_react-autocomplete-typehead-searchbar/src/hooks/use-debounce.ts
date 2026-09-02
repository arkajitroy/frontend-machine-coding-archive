import { useEffect, useRef } from "react";

export function useDebounceCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (...args: Args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
