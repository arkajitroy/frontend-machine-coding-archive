import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "../types";
import ProductItem from "./product-item";
import Pagination from "../paginations";
import { debounce, getErrorMessage } from "../lib/util";

import styles from "./index.module.css";

const ITEMS_PER_PAGE = 5;
const API_ENDPOINT = "https://fakestoreapi.com/products";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.ceil(totalItems / ITEMS_PER_PAGE), [totalItems]);

  // persistent cache using useRef
  const cacheRef = useRef<Record<number, Product[]>>({});

  const fetchProducts = useCallback(
    () =>
      debounce(async (page: number) => {
        // check cache
        if (cacheRef.current[page]) {
          setProducts(cacheRef.current[page]);
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const response = await fetch(API_ENDPOINT);
          if (!response.ok) throw new Error("Failed to fetch products!");

          const allProducts: Product[] = await response.json();
          setTotalItems(allProducts.length);

          // simulate pagination
          const startIdx = (page - 1) * ITEMS_PER_PAGE;
          const endIdx = startIdx + ITEMS_PER_PAGE;
          // paginated items
          const paginated = allProducts.slice(startIdx, endIdx);

          cacheRef.current[page] = paginated;
          setProducts(paginated);
        } catch (err) {
          setError(getErrorMessage(err, "An error occurred while fetching products."));
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchProducts()(currentPage);
  }, [currentPage, fetchProducts]);

  if (error) {
    return (
      <div className={styles.error} role="alert">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty} role="status">
        No Products found!
      </div>
    );
  }

  return (
    <div className={styles.product_list_container}>
      <h1>Product List</h1>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {loading ? (
        <div className={styles.loading} role="status">
          Loading Products...
        </div>
      ) : (
        <div className={styles.product_grid} role="list">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
