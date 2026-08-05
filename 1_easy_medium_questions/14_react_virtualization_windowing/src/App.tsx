import { useMemo } from "react";
import { generateItems } from "./lib/utils";
import ReactLibraryBasedComponent from "./module/react-library-based";
import CustomVirtualizedList from "./module/custom-virtualized-list";

export default function App() {
    const items = useMemo(() => generateItems(1000), []);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <h3 className="text-2xl font-bold">React Virtualization</h3>
            <span className="text-lg text-gray-600">Implemented with React Virtoso</span>
            <section className="container w-full h-96 border border-gray-300 rounded-md overflow-hidden">
                <ReactLibraryBasedComponent items={items} />
            </section>
            <span className="text-lg text-gray-600">Implemented with React built-in function</span>
            <section className="container w-full h-96 border border-gray-300 rounded-md overflow-hidden">
                <CustomVirtualizedList
                    items={items}
                    itemHeight={56}
                    overscanCount={8}
                    className="rounded-lg"
                    emptyPlaceholder={
                        <div className="text-center">
                            <p className="text-lg">No Items to display</p>
                        </div>
                    }
                />
            </section>
        </div>
    );
}
