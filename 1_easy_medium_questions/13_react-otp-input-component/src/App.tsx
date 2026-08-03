import { useState } from "react";
// import OtpInputAdvance from "./modules/otp-input-component-advance/otp-input";
import OtpInputSimpler from "./modules/otp-input-component-simpler/otp-input";
// import OtpInputSimpler from "./modules/otp-input-component-simpler/otp-input";

export default function App() {
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleVerify = async (otp: string) => {
        // Simulate a network request to verify OTP
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                if (otp === "123456") {
                    resolve();
                } else {
                    reject(new Error("The code you entered is incorrect. (Use '123456' for demo)"));
                }
            }, 1200);
        });
    };

    const handleResend = async () => {
        // Simulate a network request to resend OTP
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setStatusMessage("A new verification code has been sent!");
                setTimeout(() => setStatusMessage(null), 4000);
                resolve();
            }, 1500);
        });
    };

    const handleSuccess = () => {
        setStatusMessage("Success! Account verified.");
        setTimeout(() => setStatusMessage(null), 5000);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 gap-4">
            <OtpInputSimpler
                email="alex.rivera@designco.com"
                onVerify={handleVerify}
                onResend={handleResend}
                onSuccess={handleSuccess}
                otpLength={6}
            />

            {/* <OtpInputAdvance
        email="alex.rivera@designco.com"
        onVerify={handleVerify}
        onResend={handleResend}
        onSuccess={handleSuccess}
        otpLength={6}
      /> */}

            {statusMessage && (
                <div className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 animate-bounce">
                    {statusMessage}
                </div>
            )}
        </main>
    );
}
