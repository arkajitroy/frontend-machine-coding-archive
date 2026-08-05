import type { Item } from "../../../lib/utils";

interface VirtualRowProps {
    item: Item;
    index: number;
    height: number;
}

export default function VirtualizedRow({ item, index, height }: VirtualRowProps) {
    return (
        <div
            role="listitem"
            aria-setsize={-1}
            aria-posinset={index + 1}
            className="flex items-center border-b border-gray-200 px-4 text-sm text-gray-800 hover:bg-indigo-50"
            style={{
                height,
                boxSizing: "border-box",
            }}
        >
            <span className="mr-3 w-10 shrink-0 font-mono text-xs text-gray-400">#{item.id}</span>
            <span className="truncate">{item.content}</span>
        </div>
    );
}
