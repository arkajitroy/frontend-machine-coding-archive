import React from "react";
import type { Product } from "../../types/types";
import styles from "./styles.module.css";

interface SelectedProductCardProps {
  product: Product;
}

const SelectedProductCard: React.FC<SelectedProductCardProps> = ({
  product,
}) => {
  return (
    <article className={styles.card} role="region" aria-label="Selected Product">
      <div className={styles.imageContainer}>
        <img
          src={product.image}
          alt={product.title}
          className={styles.image}
        />
      </div>
      
      <div className={styles.content}>
        <h2 className={styles.title}>{product.title}</h2>
        
        <p className={styles.description}>{product.description}</p>
        
        <div className={styles.metadata}>
          <span className={styles.category}>{product.category}</span>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
        </div>
      </div>
    </article>
  );
};

export default SelectedProductCard;
