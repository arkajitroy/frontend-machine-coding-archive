import { useToast } from "./store/toast/use-toast";

export default function App() {
    const { toast, clear } = useToast();

    const showInfoToast = () => {
        toast.info({
            title: "System Update",
            description: "Version 2.4.0 is ready to install in the background.",
        });
    };

    const showSuccessToast = () => {
        toast.success({
            title: "Payment Confirmed",
            description: "Your receipt and transaction details have been sent.",
        });
    };

    const showWarningToast = () => {
        toast.warning({
            title: "Storage Alert",
            description: "You have used 90% of your cloud storage capacity.",
        });
    };

    const showErrorToast = () => {
        toast.error({
            title: "Connection Failed",
            description: "Unable to reach the server. Please verify your network.",
        });
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50/50 px-6 py-20 text-slate-800">
            <div className="mx-auto flex max-w-4xl flex-col items-start gap-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-medium tracking-wide text-slate-600 shadow-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    React Notification Toast
                </span>

                <div className="max-w-2xl space-y-3">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Accessible, lightweight notification system.
                    </h1>
                    <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
                        Trigger responsive toast notifications with customizable auto-dismissal,
                        clean design tokens, and full WCAG 2.1 AA accessibility support.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                        type="button"
                        onClick={showInfoToast}
                        className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-medium text-sky-700 shadow-xs transition hover:bg-sky-100 active:scale-98"
                    >
                        Info Toast
                    </button>

                    <button
                        type="button"
                        onClick={showSuccessToast}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-xs transition hover:bg-emerald-100 active:scale-98"
                    >
                        Success Toast
                    </button>

                    <button
                        type="button"
                        onClick={showWarningToast}
                        className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 shadow-xs transition hover:bg-amber-100 active:scale-98"
                    >
                        Warning Toast
                    </button>

                    <button
                        type="button"
                        onClick={showErrorToast}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 shadow-xs transition hover:bg-rose-100 active:scale-98"
                    >
                        Error Toast
                    </button>

                    <button
                        type="button"
                        onClick={clear}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-98"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </main>
    );
}
