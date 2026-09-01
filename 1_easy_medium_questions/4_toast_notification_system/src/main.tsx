import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ToastProvider from "./store/toast/toast-provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ToastProvider
            config={{
                position: "bottom-right",
                duration: 3000,
                maxVisible: 4,
                newestOnTop: true,
            }}
        >
            <App />
        </ToastProvider>
    </StrictMode>,
);
