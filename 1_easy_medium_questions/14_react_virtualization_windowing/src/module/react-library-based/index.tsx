import type { Item } from "../../lib/utils";
import { Virtuoso } from "react-virtuoso";

interface VirtualizedListProps {
    items: Item[];
}

const ROW_HEIGHT = 56;

export default function ReactLibraryBasedComponent({ items }: VirtualizedListProps) {
    return (
        <div className="w-full h-full">
            <Virtuoso
                style={{ height: "100%", width: "100%" }}
                data={items}
                itemContent={(_index, item) => (
                    <div
                        role="listitem"
                        className="flex items-center border-b border-gray-200 px-4 text-sm text-gray-800 hover:bg-amber-50"
                        key={item.id}
                        style={{ height: ROW_HEIGHT, boxSizing: "border-box" }}
                    >
                        <span className="mr-3 w-10 shrink-0 font-mono text-xs text-gray-400">
                            #{item.id}
                        </span>
                        <span className="truncate">{item.content}</span>
                    </div>
                )}
                defaultItemHeight={ROW_HEIGHT}
                totalCount={items.length}
            />
        </div>
    );
}
