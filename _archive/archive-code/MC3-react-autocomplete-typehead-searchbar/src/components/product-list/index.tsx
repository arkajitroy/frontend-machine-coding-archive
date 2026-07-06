import React from "react";
import styles from "./styles.module.css";
import type { Product } from "../../types/types";

interface Props {
  results: Product[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  focusedIndex: number;
  resultsRef: React.RefObject<HTMLUListElement | null>;
  onSelect: (product: Product) => void;
}

const ProductList: React.FC<Props> = ({
  results,
  isOpen,
  isLoading,
  error,
  focusedIndex,
  resultsRef,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <ul className={styles.dropdown} ref={resultsRef} role="listbox">
      {isLoading && <li className={styles.message}>Loading...</li>}
      {error && <li className={styles.message}>{error}</li>}
      {!isLoading && !error && results.length === 0 && (
        <li className={styles.message}>No products found</li>
      )}
      {results.map((product, index) => (
        <li
          key={product.id}
          className={`${styles.item} ${
            focusedIndex === index ? styles.itemFocused : ""
          }`}
          onClick={() => onSelect(product)}
          role="option"
          aria-selected={focusedIndex === index}
        >
          <img src={product.image} alt={product.title} />
          <div>
            <p>{product.title}</p>
            <p className={styles.price}>${product.price}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
