import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Item } from "../../lib/utils";
import VirtualizedRow from "./virtualized-row";

interface CustomVirtualizedListProps {
    items: Item[];
    itemHeight?: number;
    overscanCount?: number;
    emptyPlaceholder?: React.ReactNode;
    className?: string;
}

const DEFAULT_ITEM_HEIGHT = 56;
const DEFAULT_OVERSCAN = 6;

export default function CustomVirtualizedList({
    items,
    itemHeight = DEFAULT_ITEM_HEIGHT,
    overscanCount = DEFAULT_OVERSCAN,
    emptyPlaceholder,
    className,
}: CustomVirtualizedListProps) {
    // state variables
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    // refs
    const containerRef = useRef<HTMLDivElement>(null);
    const rafId = useRef<number | null>(null);

    // Calculate the number of items that can fit in the container
    const { startIndex, endIndex, offsetY } = useMemo(() => {
        if (containerHeight === 0 || itemHeight === 0) {
            return { startIndex: 0, endIndex: -1, offsetY: 0 };
        }

        const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscanCount);
        const end = Math.min(
            items.length - 1,
            Math.ceil((scrollTop + containerHeight) / itemHeight) + overscanCount,
        );

        return {
            startIndex: start,
            endIndex: end,
            offsetY: start * itemHeight,
        };
    }, [containerHeight, itemHeight, items.length, overscanCount, scrollTop]);

    // get the visible items based on calculated start and end indices
    const visibleItems = useMemo(() => {
        if (endIndex < startIndex) return [];
        return items.slice(startIndex, endIndex + 1);
    }, [items, startIndex, endIndex]);

    // calculate the total height of the list
    const totalHeight = useMemo(() => items.length * itemHeight, [items.length, itemHeight]);

    const handleScroll = useCallback(() => {
        if (rafId.current !== null) return;

        rafId.current = requestAnimationFrame(() => {
            if (containerRef.current) {
                setScrollTop(containerRef.current.scrollTop);
            }
            rafId.current = null;
        });
    }, []);

    // ============================== [ Use-Effects ] =======================================
    useEffect(function messuringHeight() {
        const el = containerRef.current;
        if (!el) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setContainerHeight(entry.contentRect.height);
            }
        });

        observer.observe(el);
        // Initial measurement
        setContainerHeight(el.clientHeight);

        return () => observer.disconnect();
    }, []);

    useEffect(function animationCleanup() {
        return () => {
            if (rafId.current !== null) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, []);

    if (items.length === 0) {
        return (
            <div
                className={`flex h-full w-full items-center justify-center text-gray-500 ${className}`}
            >
                {emptyPlaceholder}
            </div>
        );
    }

    console.log("debug-items", visibleItems);

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className={`relative h-full w-full overflow-auto ${className}`}
            role="list"
            aria-label="Virtualized list"
        >
            {/* Spacer that gives the scrollbar the correct total height */}
            <div style={{ height: totalHeight, position: "relative" }} aria-hidden={false}>
                {/* Only the visible window is rendered */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        transform: `translateY(${offsetY}px)`,
                        willChange: "transform",
                    }}
                >
                    {visibleItems.map((item, i) => {
                        const index = startIndex + i;
                        return (
                            <VirtualizedRow
                                key={item.id}
                                item={item}
                                index={index}
                                height={itemHeight}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
