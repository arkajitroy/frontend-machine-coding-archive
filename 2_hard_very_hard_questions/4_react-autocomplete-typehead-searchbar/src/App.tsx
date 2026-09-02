import { useState } from "react";
import AutocompleteSearchbar from "./components/autocomplete-searchbar";

export default function App() {
    const [debounceTime] = useState<number>(500);
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-600 mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                    Autocomplete Typeahead Searchbar
                </h1>
                <p className="text-center text-gray-600 text-sm mb-8">
                    Search for products with real-time filtering
                </p>
                <AutocompleteSearchbar debounceTime={debounceTime} />
            </div>
        </div>
    );
}
