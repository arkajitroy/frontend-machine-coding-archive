import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Item } from "../../types";
import styles from "./index.module.css";

interface CustomVirtualizedListProps {
  items: Item[];
  itemHeight: number;
  containerHeight: number;
}

const BUFFER_ROWS = 5;

const CustomVirtualizedList: React.FC<CustomVirtualizedListProps> = ({
  items,
  itemHeight,
  containerHeight,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoized calculations to improve performance
  const { startIndex, endIndex, visibleItems, topPadding } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - BUFFER_ROWS);
    const end = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + BUFFER_ROWS
    );
    const visible = items.slice(start, end);
    const paddingTop = start * itemHeight;
    return {
      startIndex: start,
      endIndex: end,
      visibleItems: visible,
      topPadding: paddingTop,
    };
  }, [scrollTop, itemHeight, containerHeight, items]);

  // handle scroll functionality
  const handleScroll = useCallback(() => {
    if (containerRef.current) setScrollTop(containerRef.current.scrollTop);
  }, []);

  // attach / detach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  console.log("debug-custom-virtual", {
    BUFFER_ROWS,
    startIndex,
    endIndex,
    topPadding,
    visibleItems,
  });

  return (
    <div className={styles.custom_virtual_container} style={{ height: containerHeight }}>
      <h3>Custom Virtual List</h3>
      <div
        ref={containerRef}
        className={styles.scroll_container}
        style={{ height: containerHeight, overflowY: "auto" }}
      >
        <div style={{ height: items.length * itemHeight, position: "relative" }}>
          {/* Render only visible items */}
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              className={styles.list_item}
              style={{
                height: itemHeight,
                position: "absolute",
                top: (startIndex + index) * itemHeight,
                width: "100%",
              }}
            >
              <p>{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomVirtualizedList;
