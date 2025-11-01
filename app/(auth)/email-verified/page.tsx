// app/auth/email-verified/page.tsx
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmailVerifiedPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 text-center'>
        <div>
          <CheckCircle className='mx-auto h-12 w-12 text-green-500' />
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Email Verified!
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Your email has been successfully verified. You can now sign in to
            your account.
          </p>
        </div>
        <div className='space-y-4'>
          <Button asChild className='w-full'>
            <Link href='/login'>Sign In to Your Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
