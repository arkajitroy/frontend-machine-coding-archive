import { useCallback, useEffect, useMemo, useState } from "react";

export interface VirtualItem {
    index: number;
    start: number;
    size: number;
}

interface VirtualizerOptions {
    count: number;
    estimateSize: number; // fixed row height in px
    overscan?: number;
    getScrollElement: () => HTMLElement | null;
}

export function useVirtualizer({
    count,
    estimateSize,
    overscan = 6,
    getScrollElement,
}: VirtualizerOptions) {
    const [scrollTop, setScrollTop] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);

    const onScroll = useCallback(() => {
        const element = getScrollElement();
        if (element) {
            setScrollTop(element.scrollTop);
        }
    }, [getScrollElement]);

    // Track scroll element dimensions and scroll events
    useEffect(() => {
        const element = getScrollElement();
        if (!element) return;

        element.addEventListener("scroll", onScroll, { passive: true });

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === element) {
                    setViewportHeight(entry.contentRect.height);
                }
            }
        });

        resizeObserver.observe(element);

        return () => {
            element.removeEventListener("scroll", onScroll);
            resizeObserver.disconnect();
        };
    }, [getScrollElement, onScroll]);


    const { start, end, offsetY, totalSize } = useMemo(() => {
        const effectiveHeight = viewportHeight || 500;
        const totalHeight = count * estimateSize;

        if (count === 0) {
            return { start: 0, end: -1, offsetY: 0, totalSize: 0 };
        }

        const startIndex = Math.max(0, Math.floor(scrollTop / estimateSize) - overscan);
        const visibleCount = Math.ceil(effectiveHeight / estimateSize) + overscan * 2;
        const endIndex = Math.min(count - 1, startIndex + visibleCount);

        return {
            start: startIndex,
            end: endIndex,
            offsetY: startIndex * estimateSize,
            totalSize: totalHeight,
        };
    }, [scrollTop, viewportHeight, count, estimateSize, overscan]);

    const virtualItems = useMemo<VirtualItem[]>(() => {
        if (end < start || count === 0) return [];

        const items: VirtualItem[] = [];
        for (let i = start; i <= end; i++) {
            items.push({
                index: i,
                start: i * estimateSize,
                size: estimateSize,
            });
        }
        return items;
    }, [start, end, estimateSize, count]);

    return {
        virtualItems,
        totalSize,
        offsetY,
        scrollTop,
        viewportHeight,
    };
}

