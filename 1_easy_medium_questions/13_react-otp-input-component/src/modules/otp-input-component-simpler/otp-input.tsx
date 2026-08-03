import { useEffect, useRef, useState } from "react";
import { RESEND_TIMER } from "../otp-input-component-advance/otp-input";
import { formatTime } from "../../lib/utils";

interface OtpInputProps {
  email?: string;
  onVerify?: (otp: string) => Promise<void>;
  onResend?: () => Promise<void>;
  onSuccess?: () => void;
  otpLength?: number;
}

export default function OtpInputSimpler({
  email = "user@example.com",
  onVerify,
  onResend,
  onSuccess,
  otpLength = 6,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(otpLength).fill(""));
  const [secondsRemaining, setSecondsRemaining] = useState(RESEND_TIMER);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const getOtpValue = () => otp.join("");
  const isComplete = otp.every((val) => val !== "");

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Allow numbers only

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character typed
    setOtp(newOtp);
    setError("");

    // Move focus forward if a value is typed
    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        // If current box is filled, clear it
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // If current box is empty, clear previous box and focus it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
      setError("");
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter" && isComplete) {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return; // Ensure it is digits only

    const newOtp = [...otp];
    const digits = pastedData.slice(0, otpLength).split("");

    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);
    setError("");

    // Focus last filled box
    const focusIndex = Math.min(digits.length, otpLength - 1);
    inputRefs.current[focusIndex]?.focus();

    // Auto verify if full code pasted
    const finalOtp = newOtp.join("");
    if (finalOtp.length === otpLength) {
      handleVerify(finalOtp);
    }
  };

  const handleVerify = async (otpToVerify?: string) => {
    const code = otpToVerify || getOtpValue();
    if (code.length !== otpLength || isVerifying) return;

    setIsVerifying(true);
    setError("");

    try {
      if (onVerify) {
        await onVerify(code);
      } else {
        // Mock verification
        await new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            if (code === "123456") resolve();
            else reject(new Error("Invalid code. Please try again."));
          }, 1000);
        });
      }
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setOtp(new Array(otpLength).fill(""));
    setIsSuccess(false);
    setSecondsRemaining(RESEND_TIMER);
    setError("");
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  };

  const handleResend = async () => {
    if (secondsRemaining > 0 || isResending) return;
    setIsResending(true);
    setError("");

    try {
      if (onResend) {
        await onResend();
      } else {
        await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      }
      setSecondsRemaining(RESEND_TIMER);
      setOtp(new Array(otpLength).fill(""));
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(
    function resendTimerCountdown() {
      if (secondsRemaining <= 0) return;
      const timer = setTimeout(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    },
    [secondsRemaining],
  );

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
          ✓
        </div>
        <h2 className="text-xl font-semibold text-slate-800">
          Verification Successful
        </h2>
        <p className="mt-2 text-sm text-slate-500">Your account is verified.</p>
        <button
          onClick={handleReset}
          className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Reset Demo
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-md">
      <h2 className="text-xl font-bold text-slate-800 text-center">
        OTP Verification
      </h2>
      <p className="mt-1 text-center text-sm text-slate-500">
        Sent to <span className="font-semibold text-slate-700">{email}</span>
      </p>

      {/* Timer */}
      <div className="mt-6 flex flex-col items-center text-sm">
        {secondsRemaining > 0 ? (
          <p className="text-slate-500">
            Resend code in{" "}
            <span className="font-semibold text-slate-700">
              {formatTime(secondsRemaining)}
            </span>
          </p>
        ) : (
          <p className="text-slate-500 font-medium text-emerald-600">
            You can now resend the code
          </p>
        )}
      </div>

      {/* Input Slots */}
      <div className="mt-6 flex justify-center gap-2.5">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            disabled={isVerifying}
            className={`h-12 w-12 rounded-lg border text-center text-2xl font-bold outline-none transition-all
              ${error ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200" : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-100"}
              ${digit ? "bg-white" : "bg-slate-50"}
            `}
          />
        ))}
      </div>

      {error && (
        <p className="mt-3 text-center text-xs font-semibold text-red-500">
          {error}
        </p>
      )}

      {/* Action Button */}
      <button
        onClick={() => handleVerify()}
        disabled={!isComplete || isVerifying}
        className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>

      {/* Resend Action */}
      {onResend && (
        <div className="mt-4 text-center text-sm">
          <button
            onClick={handleResend}
            disabled={secondsRemaining > 0 || isResending}
            className="text-blue-600 hover:text-blue-700 font-semibold transition disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
          >
            {isResending ? "Resending..." : "Resend Code"}
          </button>
        </div>
      )}
    </div>
  );
}
