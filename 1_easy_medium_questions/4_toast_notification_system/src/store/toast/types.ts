export type ToastType = "success" | "error" | "warning" | "info";

export type ToastPosition =
    | "top-left"
    | "top-right"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";

export interface ToastItemData {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration: number;
    createdAt: number;
}

export interface ToastConfig {
    position: ToastPosition;
    duration: number;
    maxVisible: number;
    newestOnTop: boolean;
}

export interface ToastOptions {
    title: string;
    description?: string;
    duration?: number;
}

export type ToastAction =
    | { type: "ADD"; toast: ToastItemData }
    | { type: "DISMISS"; id: string }
    | { type: "CLEAR" };

export interface ToastApi {
    success: (options: ToastOptions) => string;
    error: (options: ToastOptions) => string;
    warning: (options: ToastOptions) => string;
    info: (options: ToastOptions) => string;
}

export interface ToastContextValue {
    toasts: ToastItemData[];
    config: ToastConfig;
    toast: ToastApi;
    dismiss: (id: string) => void;
    clear: () => void;
}
