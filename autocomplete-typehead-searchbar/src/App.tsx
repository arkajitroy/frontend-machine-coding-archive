import { useState } from "react";
import AutocompleteSearchbar from "./components/autocomplete-searchbar";

export default function App() {
  const [debounceTime] = useState<number>(500);
  return (
    <div>
      <h3 className="text-2xl text-center mt-4 mb-2 font-bold text-blue-800">
        Autocomplete Typehead searchbar
      </h3>
      <AutocompleteSearchbar debounceTime={debounceTime} />
    </div>
  );
}
