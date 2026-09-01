import type { ToastPosition, ToastType } from "../../store/toast/types";

export const positionClasses: Record<ToastPosition, string> = {
    "top-right": "top-4 right-4 items-end",
    "top-left": "top-4 left-4 items-start",
    "bottom-right": "bottom-4 right-4 items-end",
    "bottom-left": "bottom-4 left-4 items-start",
    "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

export interface ToastVariantStyle {
    border: string;
    icon: string;
    iconBg: string;
    accent: string;
}

export const toastVariantStyles: Record<ToastType, ToastVariantStyle> = {
    success: {
        border: "border-emerald-200/80",
        icon: "text-emerald-600",
        iconBg: "bg-emerald-50",
        accent: "bg-emerald-500",
    },
    error: {
        border: "border-rose-200/80",
        icon: "text-rose-600",
        iconBg: "bg-rose-50",
        accent: "bg-rose-500",
    },
    warning: {
        border: "border-amber-200/80",
        icon: "text-amber-600",
        iconBg: "bg-amber-50",
        accent: "bg-amber-500",
    },
    info: {
        border: "border-sky-200/80",
        icon: "text-sky-600",
        iconBg: "bg-sky-50",
        accent: "bg-sky-500",
    },
};
