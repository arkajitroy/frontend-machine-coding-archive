import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    type PropsWithChildren,
} from "react";
import { generateId } from "../../lib/utils";
import ToastViewport from "../../components/toast/toast-viewport";
import { ToastContext } from "./toast-context";
import { toastReducer } from "./toast-reducer";
import type {
    ToastApi,
    ToastConfig,
    ToastContextValue,
    ToastItemData,
    ToastOptions,
    ToastType,
} from "./types";

const DEFAULT_CONFIG: ToastConfig = {
    position: "bottom-right",
    duration: 4000,
    maxVisible: 5,
    newestOnTop: true,
};

interface ToastProviderProps extends PropsWithChildren {
    config?: Partial<ToastConfig>;
}

export default function ToastProvider({ config: userConfig, children }: ToastProviderProps) {
    const [toasts, dispatch] = useReducer(toastReducer, []);
    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const mergedConfig = useMemo<ToastConfig>(() => {
        return { ...DEFAULT_CONFIG, ...userConfig };
    }, [userConfig]);

    const dismissToast = useCallback((id: string) => {
        dispatch({ type: "DISMISS", id });
        const timer = timersRef.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }
    }, []);

    const clearAllToasts = useCallback(() => {
        timersRef.current.forEach((timer) => clearTimeout(timer));
        timersRef.current.clear();
        dispatch({ type: "CLEAR" });
    }, []);

    const addToast = useCallback(
        (type: ToastType, options: ToastOptions) => {
            const id = generateId();
            const duration = options.duration ?? mergedConfig.duration;

            const newToast: ToastItemData = {
                id,
                type,
                title: options.title,
                description: options.description,
                duration,
                createdAt: Date.now(),
            };

            dispatch({ type: "ADD", toast: newToast });

            if (duration > 0) {
                const timer = setTimeout(() => {
                    dismissToast(id);
                }, duration);
                timersRef.current.set(id, timer);
            }

            return id;
        },
        [mergedConfig.duration, dismissToast],
    );

    const toastApi = useMemo<ToastApi>(
        () => ({
            success: (options) => addToast("success", options),
            error: (options) => addToast("error", options),
            warning: (options) => addToast("warning", options),
            info: (options) => addToast("info", options),
        }),
        [addToast],
    );

    const contextValue = useMemo<ToastContextValue>(
        () => ({
            toasts,
            config: mergedConfig,
            toast: toastApi,
            dismiss: dismissToast,
            clear: clearAllToasts,
        }),
        [toasts, mergedConfig, toastApi, dismissToast, clearAllToasts],
    );

    useEffect(() => {
        const activeTimers = timersRef.current;
        return () => {
            activeTimers.forEach((timer) => clearTimeout(timer));
            activeTimers.clear();
        };
    }, []);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastViewport />
        </ToastContext.Provider>
    );
}
