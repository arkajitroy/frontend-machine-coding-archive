interface EditEmailDialogProps {
  emailInput: string;
  currentEmail: string;
  error: string;
  setError: (value: string) => void;
  setIsEditingEmail: (value: boolean) => void;
  setEmailInput: (value: string) => void;
  handleSaveEmail: () => void;
}

export default function EditEmailDialog({
  emailInput,
  currentEmail,
  error,
  setError,
  setIsEditingEmail,
  setEmailInput,
  handleSaveEmail,
}: EditEmailDialogProps) {
  return (
    <div
      id="otp-card-container"
      className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl transition-all duration-300"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Change Email Address
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Update your email address to receive a new verification code.
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={emailInput}
          onChange={(e) => {
            setEmailInput(e.target.value);
            if (error) setError("");
          }}
          className={`mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none transition
                            ${
                              error
                                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                            }`}
          placeholder="your.email@example.com"
        />
        {error && (
          <p className="mt-2 text-xs font-medium text-red-500">{error}</p>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => {
            setIsEditingEmail(false);
            setEmailInput(currentEmail);
            setError("");
          }}
          className="flex-1 rounded-lg border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveEmail}
          className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
        >
          Update & Send
        </button>
      </div>
    </div>
  );
}
