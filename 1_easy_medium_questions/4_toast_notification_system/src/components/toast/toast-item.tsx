import type { ToastItemData, ToastType } from "../../store/toast/types";
import { toastVariantStyles } from "./styles";

interface ToastIconProps {
    type: ToastType;
}

function ToastIcon({ type }: ToastIconProps) {
    const iconClass = "w-4 h-4";

    switch (type) {
        case "success":
            return (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            );
        case "error":
            return (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            );
        case "warning":
            return (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 4.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" />
                </svg>
            );
        case "info":
            return (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
                </svg>
            );
    }
}

export interface ToastItemProps {
    toast: ToastItemData;
    onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
    const variant = toastVariantStyles[toast.type];
    const isAlert = toast.type === "error" || toast.type === "warning";

    return (
        <div
            role={isAlert ? "alert" : "status"}
            aria-live={isAlert ? "assertive" : "polite"}
            className={`
                group relative flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3
                overflow-hidden rounded-xl border bg-white/95 p-3.5
                shadow-lg shadow-slate-900/5 backdrop-blur-sm
                transition-all duration-200 ease-out hover:shadow-md
                ${variant.border}
            `}
        >
            {/* Left accent indicator */}
            <div className={`absolute top-0 left-0 bottom-0 w-1 ${variant.accent}`} />

            {/* Icon badge */}
            <div className={`flex shrink-0 items-center justify-center rounded-lg p-1.5 ${variant.iconBg} ${variant.icon}`}>
                <ToastIcon type={toast.type} />
            </div>

            {/* Content body */}
            <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                    {toast.title}
                </p>
                {toast.description && (
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {toast.description}
                    </p>
                )}
            </div>

            {/* Dismiss button */}
            <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 rounded-md p-1 text-slate-400 opacity-70 transition-all hover:bg-slate-100 hover:text-slate-700 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
                aria-label="Dismiss notification"
            >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

// Backward compatibility export
export { ToastItem as Toast };
