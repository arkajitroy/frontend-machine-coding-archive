import { useMemo } from "react";
import { useToast } from "../../store/toast/use-toast";
import { positionClasses } from "./styles";
import { ToastItem } from "./toast-item";

export default function ToastViewport() {
    const { toasts, config, dismiss } = useToast();

    const visibleToasts = useMemo(() => {
        const ordered = config.newestOnTop ? [...toasts].reverse() : toasts;
        return ordered.slice(0, config.maxVisible);
    }, [config.maxVisible, config.newestOnTop, toasts]);

    if (visibleToasts.length === 0) {
        return null;
    }

    return (
        <div
            aria-live="polite"
            aria-atomic="false"
            className={`fixed z-50 flex flex-col gap-2.5 pointer-events-none p-4 ${positionClasses[config.position]}`}
        >
            {visibleToasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto toast-animate-entry">
                    <ToastItem toast={toast} onDismiss={dismiss} />
                </div>
            ))}
        </div>
    );
}
