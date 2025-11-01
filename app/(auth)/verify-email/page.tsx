"use client";

import { Suspense, useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";

// ✅ Type-safe VerifyEmailForm Component
function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  // ✅ Handle OTP Verification
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
        setTimeout(() => {
          router.push("/email-verified");
        }, 1500);
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle resend OTP
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
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* ✅ Success and Error Messages */}
      {message && (
        <div className='rounded-md bg-green-50 dark:bg-green-900/30 p-4 text-center'>
          <p className='text-sm text-green-700 dark:text-green-300'>
            {message}
          </p>
        </div>
      )}
      {error && (
        <div className='rounded-md bg-red-50 dark:bg-red-900/30 p-4 text-center'>
          <p className='text-sm text-red-700 dark:text-red-300'>{error}</p>
        </div>
      )}

      {/* ✅ OTP Input Form */}
      <form onSubmit={handleVerifyOTP} className='space-y-6'>
        <div className='flex flex-col items-center space-y-4'>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Enter the 6-digit code sent to <b>{email || "your email"}</b>
          </p>
        </div>

        <Button
          type='submit'
          disabled={isLoading || otp.length !== 6}
          className='w-full'
        >
          {isLoading && <RefreshCw className='h-4 w-4 animate-spin mr-2' />}
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>
      </form>

      {/* ✅ Resend & Navigation Links */}
      <div className='text-center space-y-2'>
        <button
          type='button'
          onClick={handleResendVerification}
          disabled={isResending || !email}
          className='text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isResending ? "Sending..." : "Resend verification code"}
        </button>

        <div>
          <Link
            href='/signin'
            className='text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300'
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

// ✅ Loading skeleton (for Suspense)
function FormLoadingSkeleton() {
  return (
    <div className='space-y-6 animate-pulse'>
      <div className='flex justify-center space-x-2'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className='h-12 w-10 bg-gray-200 dark:bg-gray-700 rounded'
          />
        ))}
      </div>
      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto' />
      <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded' />
      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto' />
    </div>
  );
}

// ✅ Page wrapper (fully centered)
export default function VerifyEmailPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
      <div className='max-w-md w-full bg-background rounded-xl shadow-md p-8 space-y-8 border border-border text-center'>
        <div>
          <Mail className='mx-auto h-12 w-12 text-blue-500' />
          <h2 className='mt-2 text-3xl font-extrabold text-gray-900 dark:text-gray-100'>
            Verify your email
          </h2>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            We&apos;ve sent a 6-digit verification code to your email. Enter it
            below to verify your account.
          </p>
        </div>

        <Suspense fallback={<FormLoadingSkeleton />}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
