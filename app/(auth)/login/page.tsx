"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { reset } = form;

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    setIsLoading(true);
    setError("");
    setNeedsVerification(false);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "Please verify your email before signing in") {
          setNeedsVerification(true);
          setUserEmail(values.email);
          setError(
            "Your email address needs to be verified before you can sign in."
          );
        } else if (result.error === "CredentialsSignin") {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(result.error);
        }
      } else if (result?.ok) {
        reset();
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error(err);
      setError("An error occurred with Google sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4'>
      <div className='w-full max-w-md border border-border rounded-lg shadow-md bg-card p-8 flex flex-col items-center space-y-6'>
        {error && (
          <div className='rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive flex items-start gap-2 w-full'>
            <AlertCircle className='h-4 w-4 mt-0.5 shrink-0' />
            <div>
              {error}
              {needsVerification && (
                <div className='mt-2'>
                  <Link
                    href={`/verifyEmail?email=${encodeURIComponent(userEmail)}`}
                    className='text-blue-600 hover:text-blue-500 underline text-sm'
                  >
                    Click here to resend verification email
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        <h2 className='text-2xl font-semibold text-center'>Log In</h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 w-full'
          >
            {/* Email */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='john@example.com'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder='Enter your password'
                        disabled={isLoading}
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute inset-y-0 right-2 flex items-center bg-transparent hover:bg-transparent cursor-pointer text-muted-foreground'
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <div className='flex justify-end'>
                    <Link
                      href='/forgot-password'
                      className='text-xs text-primary hover:underline'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full text-white transition-all duration-300 cursor-pointer'
              disabled={isLoading}
            >
              {!isLoading && "Sign In"}
              {isLoading && (
                <div className='h-5 w-5 border-2 border-white rounded-full border-l-transparent border-t-transparent animate-spin'></div>
              )}
            </Button>
          </form>
        </Form>

        {/* Separator */}
        <div className='flex items-center w-full gap-2'>
          <Separator className='flex-1 h-px bg-border' />
          <span className='px-2 text-muted-foreground text-sm'>
            Or continue with
          </span>
          <Separator className='flex-1 h-px bg-border' />
        </div>

        {/* Google Button */}
        <Button
          variant='outline'
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className='w-full flex items-center justify-center space-x-3 hover:bg-accent/20 transition-all duration-300'
        >
          <Image
            src='/google-logo.png'
            alt='Google Logo'
            width={20}
            height={20}
          />
          <span>Continue with Google</span>
        </Button>

        {/* Footer Links */}
        <div className='text-center text-sm'>
          <span className='text-muted-foreground'>Don’t have an account? </span>
          <Link href='/signup' className='text-primary hover:underline'>
            Sign up
          </Link>
        </div>

        <div className='text-center text-xs text-muted-foreground max-w-sm'>
          <p>
            Having trouble signing in? Make sure you’ve verified your email
            address after registration.
          </p>
        </div>
      </div>
    </div>
  );
}
