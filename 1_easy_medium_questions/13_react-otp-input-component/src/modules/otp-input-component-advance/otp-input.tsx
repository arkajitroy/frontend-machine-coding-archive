import { useEffect, useRef, useState } from "react";
import { formatTime, maskEmail } from "../../lib/utils";
import SuccessCard from "./success-card";
import EditEmailDialog from "./edit-email-dialog";

export const OTP_LENGTH = 6;
export const RESEND_TIMER = 60;

interface OtpInputProps {
  email?: string;
  onVerify?: (otp: string) => Promise<void>;
  onResend?: () => Promise<void>;
  onSuccess?: () => void;
  otpLength?: number;
}

export default function OtpInput({
  email,
  onVerify,
  onResend,
  onSuccess,
  otpLength = OTP_LENGTH,
}: OtpInputProps) {
  // state variables
  const [currentEmail, setCurrentEmail] = useState(
    email || "john.doe@example.com",
  );
  const [emailInput, setEmailInput] = useState(currentEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [otpInput, setOtpInput] = useState<string[]>(
    new Array(otpLength).fill(""),
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(RESEND_TIMER);
  const [error, setError] = useState("");
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // refs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // helper functions
  const getOtpValue = () => otpInput.join("");
  const isComplete = otpInput.every((digit: string) => digit !== "");

  // handlers
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpInput];
    newOtp[index] = value.slice(-1);
    setOtpInput(newOtp);

    if (error) setError("");

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
      const newOtp = [...otpInput];

      if (otpInput[index]) {
        newOtp[index] = "";
        setOtpInput(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtpInput(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
      if (error) setError("");
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Home") {
      inputRefs.current[0]?.focus();
    } else if (e.key === "End") {
      inputRefs.current[otpLength - 1]?.focus();
    } else if (e.key === "Enter" && isComplete) {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isVerifying || isSuccess) return;

    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otpInput];
    const digits = pastedData.slice(0, otpLength).split("");

    for (let i = 0; i < otpLength; i++) {
      if (digits[i]) {
        newOtp[i] = digits[i];
      }
    }
    setOtpInput(newOtp);
    if (error) setError("");

    const targetFocusIndex = Math.min(digits.length, otpLength - 1);
    inputRefs.current[targetFocusIndex]?.focus();

    const finalOtpValue = newOtp.join("");
    if (finalOtpValue.length === otpLength) {
      handleVerify(finalOtpValue);
    }
  };

  const handleVerify = async (otpToVerify?: string) => {
    const otp = otpToVerify || getOtpValue();
    if (otp.length !== otpLength || isVerifying) return;
    setIsVerifying(true);
    setError("");

    try {
      if (onVerify) {
        await onVerify(otp);
      } else {
        await new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            if (otp === "123456") {
              resolve();
            } else {
              reject(
                new Error("The OTP you entered is invalid. Please try again."),
              );
            }
          }, 1200);
        });
      }
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
      setAttemptsCount((prev) => prev + 1);
    } finally {
      setIsVerifying(false);
    }
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
      setOtpInput(new Array(otpLength).fill(""));
      setAttemptsCount(0);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const handleSaveEmail = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      setError("Please enter a valid email address.");
      return;
    }
    setCurrentEmail(emailInput);
    setIsEditingEmail(false);
    setError("");
    setSecondsRemaining(RESEND_TIMER);
    setOtpInput(new Array(otpLength).fill(""));
    setAttemptsCount(0);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 50);
  };

  // effects
  useEffect(
    function emailInitOnLoad() {
      if (email) {
        setCurrentEmail(email);
        setEmailInput(email);
      }
    },
    [email],
  );

  useEffect(
    function autoFocusOnLoad() {
      if (!isEditingEmail && !isSuccess) {
        inputRefs.current[0]?.focus();
      }
    },
    [isEditingEmail, isSuccess],
  );

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
      <SuccessCard
        otpLength={otpLength}
        setOtpInput={setOtpInput}
        setSecondsRemaining={setSecondsRemaining}
        setAttemptsCount={setAttemptsCount}
        setIsSuccess={setIsSuccess}
      />
    );
  }

  if (isEditingEmail) {
    return (
      <EditEmailDialog
        emailInput={emailInput}
        currentEmail={currentEmail}
        error={error}
        setError={setError}
        setIsEditingEmail={setIsEditingEmail}
        setEmailInput={setEmailInput}
        handleSaveEmail={handleSaveEmail}
      />
    );
  }

  return (
    <div
      id="otp-card-container"
      className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">OTP Verification</h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enter the {otpLength}-digit verification code sent to
        </p>

        <p className="mt-1 font-medium text-slate-800">
          {maskEmail(currentEmail)}
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="mt-8 flex w-full justify-center gap-3">
        {otpInput.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            disabled={isVerifying || isSuccess}
            className={`
                            h-14 w-14 rounded-xl border text-center text-3xl font-semibold outline-none transition-all
                            ${
                              error
                                ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                : isSuccess
                                  ? "border-green-500 bg-green-50"
                                  : "border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            }
                            ${digit ? "bg-white" : "bg-slate-50"}
                            disabled:cursor-not-allowed
                        `}
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-4 text-center text-sm font-medium text-red-500">
          {error}
        </p>
      )}

      {/* Attempts Warning */}
      {attemptsCount > 0 && !error && (
        <p className="mt-4 text-center text-xs text-amber-600 font-medium">
          Failed attempts: {attemptsCount} (Use code '123456' for the default
          demo)
        </p>
      )}

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

      {/* Verify Button */}
      <button
        className="
                    mt-8
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-blue-600
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition-colors
                    duration-200
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:bg-slate-300
                    cursor-pointer
                "
        onClick={() => handleVerify()}
        disabled={!isComplete || isVerifying || isSuccess}
      >
        {isVerifying ? (
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
        ) : (
          "Verify OTP"
        )}
      </button>

      {/* Footer Actions */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <button
          className="font-medium text-slate-600 transition hover:text-slate-900 cursor-pointer"
          onClick={() => {
            setIsEditingEmail(true);
            setError("");
          }}
        >
          Change Email
        </button>

        <button
          className="font-semibold text-blue-600 transition hover:text-blue-700 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
          disabled={secondsRemaining > 0 || isResending || isSuccess}
          onClick={handleResend}
        >
          {isResending ? "Resending..." : "Resend OTP"}
        </button>
      </div>

      {/* Optional Information */}
      <div className="mt-8 rounded-lg bg-amber-50 border border-amber-100 p-4">
        <p className="text-xs leading-5 text-amber-800">
          The verification code expires in{" "}
          <span className="font-semibold">10 minutes</span>. If you enter an
          incorrect code multiple times, a new verification code may be
          required.
        </p>
      </div>
    </div>
  );
}
