import React, { useEffect, useRef, useState } from "react";
import type { Product } from "../../types/types";
import { useFetch } from "../../hooks/use-fetch";
import { useDebounceCallback } from "../../hooks/use-debounce";
import ProductList from "../product-list";
import styles from "./styles.module.css";

const URL = "https://fakestoreapi.com/products";
const cache: Record<string, Product[]> = {};

interface AutocompleteSearchbarProps {
  debounceTime: number;
}

const AutocompleteSearchbar = ({
  debounceTime,
}: AutocompleteSearchbarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const { data: products, error: fetchError } = useFetch<Product[]>(URL);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  const filterResults = useDebounceCallback((search: string) => {
    if (!search.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (cache[search]) {
      setResults(cache[search]);
      setIsOpen(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    const filtered = (products || []).filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );

    cache[search] = filtered;
    setResults(filtered);
    setIsOpen(true);
    setIsLoading(false);
  }, debounceTime);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setFocusedIndex(-1);
    filterResults(value);
  };

  const handleSelect = (product: Product) => {
    setQuery(product.title);
    setIsOpen(false);
    setFocusedIndex(-1);
    console.log("Selected:", product);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < results.length) {
          handleSelect(results[focusedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (fetchError) setError(fetchError);
  }, [fetchError]);

  useEffect(() => {
    if (focusedIndex >= 0 && resultsRef.current) {
      const el = resultsRef.current.children[focusedIndex] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  return (
    <main className={styles.wrapper}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        className={styles.input}
        aria-label="Product Search"
        aria-autocomplete="list"
        aria-expanded={isOpen}
      />
      <ProductList
        results={results}
        isOpen={isOpen}
        isLoading={isLoading}
        error={error}
        focusedIndex={focusedIndex}
        resultsRef={resultsRef}
        onSelect={handleSelect}
      />
    </main>
  );
};

export default AutocompleteSearchbar;
