import { useState } from "react";
import { generateItems } from "./lib/utils";
import type { Item } from "./types";
import VirtualizedList from "./components/virtualized-list";
import CustomVirtualizedList from "./components/custom-virtualized-list";

const App = () => {
  const [data] = useState<Item[]>(generateItems(1000));

  return (
    <main>
      <h3>React Virtualization</h3>

      <section className="list-container">
        <section className="list-section">
          <VirtualizedList items={data} />
        </section>
        <section className="list-section">
          <CustomVirtualizedList items={data} itemHeight={50} containerHeight={400} />
        </section>
      </section>
    </main>
  );
};

export default App;
