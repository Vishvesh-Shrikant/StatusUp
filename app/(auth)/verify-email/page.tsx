"use client";

import { Suspense, useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  // ✅ Verify OTP
  const handleVerifyOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Email verified successfully! Redirecting...");
        setTimeout(() => router.push("/email-verified"), 1500);
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Resend verification code
  const handleResendVerification = async () => {
    if (!email) return;
    setIsResending(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId: email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("📩 Verification email sent! Please check your inbox.");
      } else {
        setError(data.error || "Failed to resend verification code");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className='flex items-center justify-center px-4'>
      <div className='w-full max-w-md border border-border rounded-xl shadow-lg bg-card p-8 flex flex-col items-center space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <Mail className='mx-auto h-12 w-12 text-primary' />
          <h2 className='text-2xl font-bold text-foreground'>
            Verify your email
          </h2>
          <p className='text-sm text-muted-foreground'>
            Enter the 6-digit code sent to <b>{email || "your email"}</b>.
          </p>
        </div>

        {/* Inline Error/Message */}
        {(error || message) && (
          <div
            className={`w-full text-sm rounded-md px-3 py-2 border ${
              error
                ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
                : "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"
            }`}
          >
            <div className='flex items-start gap-2'>
              <AlertCircle className='h-4 w-4 mt-0.5 shrink-0' />
              <p>{error || message}</p>
            </div>
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleVerifyOTP} className='space-y-4 w-full'>
          <div className='flex flex-col items-center space-y-3'>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type='submit'
            disabled={isLoading || otp.length !== 6}
            className='w-full text-white transition-all duration-300'
          >
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <RefreshCw className='h-4 w-4 animate-spin mr-2' />
                Verifying...
              </div>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>

        {/* Separator */}
        <div className='flex items-center w-full gap-2'>
          <Separator className='flex-1 h-px bg-border' />
          <span className='px-2 text-muted-foreground text-sm'>
            Didn’t get it?
          </span>
          <Separator className='flex-1 h-px bg-border' />
        </div>

        {/* Resend Button */}
        <Button
          variant='outline'
          onClick={handleResendVerification}
          disabled={isResending || !email}
          className='w-full flex items-center justify-center hover:bg-accent/20 transition-all duration-300'
        >
          <span className='ml-2'>
            {isResending ? "Sending..." : "Resend Verification Code"}
          </span>
        </Button>

        {/* Footer */}
        <div className='text-center text-sm'>
          <Link href='/signin' className='text-primary hover:underline'>
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

// ✅ Page Wrapper
export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center min-h-screen text-muted-foreground'>
          Loading verification form...
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
