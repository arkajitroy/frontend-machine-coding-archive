import type React from "react";
import { Virtuoso } from "react-virtuoso";
import styles from "./index.module.css";
import type { Item } from "../../types";

interface VirtualizedListProps {
  items: Item[];
}

// This component has been created using a custom library react-virtuoso

const VirtualizedList: React.FC<VirtualizedListProps> = ({ items }) => {
  return (
    <div className={styles.virtuoso_container}>
      <h3>Virtualized List with react-virtuoso</h3>
      <Virtuoso
        style={{ height: 600 }}
        data={items}
        itemContent={(_index, item) => (
          <div className={styles.list_item} key={item.id}>
            <p>{item.content}</p>
          </div>
        )}
        totalCount={items.length}
      />
    </div>
  );
};

export default VirtualizedList;
