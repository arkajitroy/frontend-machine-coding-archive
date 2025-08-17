import React from "react";
import type { Product } from "../../types";

import styles from "./index.module.css";

const ProductItem: React.FC<{ product: Product }> = React.memo(({ product }) => {
  return (
    <div className={styles.product_item} role="listitem">
      <img src={product.image} alt={product.title} className={styles.product_image} />
      <h3>{product.title}</h3>
      <p>Price: ${product.price.toFixed(2)}</p>
    </div>
  );
});

export default ProductItem;
