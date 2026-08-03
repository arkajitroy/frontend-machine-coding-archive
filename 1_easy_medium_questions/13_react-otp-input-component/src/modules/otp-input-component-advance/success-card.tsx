import { RESEND_TIMER } from "./otp-input";

interface SuccessCardProps {
  otpLength: number;
  setIsSuccess: (value: boolean) => void;
  setOtpInput: (value: string[]) => void;
  setSecondsRemaining: (value: number) => void;
  setAttemptsCount: (value: number) => void;
}

export default function SuccessCard({
  otpLength,
  setIsSuccess,
  setOtpInput,
  setSecondsRemaining,
  setAttemptsCount,
}: SuccessCardProps) {
  return (
    <div
      id="otp-card-container"
      className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl text-center flex flex-col items-center transition-all duration-300"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6 transition-transform">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-900">
        Verification Successful
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Your email address has been verified. You can now proceed with your
        session.
      </p>
      <button
        onClick={() => {
          setIsSuccess(false);
          setOtpInput(new Array(otpLength).fill(""));
          setSecondsRemaining(RESEND_TIMER);
          setAttemptsCount(0);
        }}
        className="mt-8 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
      >
        Done & Reset Demo
      </button>
    </div>
  );
}
