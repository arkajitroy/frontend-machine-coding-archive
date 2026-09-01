import type { ToastAction, ToastItemData } from "./types";

export function toastReducer(state: ToastItemData[], action: ToastAction): ToastItemData[] {
    switch (action.type) {
        case "ADD":
            return [...state, action.toast];
        case "DISMISS":
            return state.filter((item) => item.id !== action.id);
        case "CLEAR":
            return [];
        default:
            return state;
    }
}
