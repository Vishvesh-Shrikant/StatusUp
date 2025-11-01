"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
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

// -------------------
// Validation Schema
// -------------------
const SignUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { reset } = form;

  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    setIsLoading(true);
    setError("");
    setSignupSuccess(false);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setError(data.error || "Failed to sign up");
        return;
      }

      setSignupSuccess(true);
      reset();

      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error(err);
      setError("An error occurred with Google sign-up");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Success message screen
  if (signupSuccess) {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center px-4'>
        <div className='w-full max-w-md bg-green-50 rounded-lg p-6 shadow-md text-center space-y-3'>
          <h2 className='text-green-800 font-semibold text-lg'>
            Account created successfully!
          </h2>
          <p className='text-green-700 text-sm'>
            Please check your email for a verification code.
          </p>
          <p className='text-muted-foreground text-xs'>
            Redirecting to verification page...
          </p>
        </div>
      </div>
    );
  }

  // ✅ Main form centered in middle of screen
  return (
    <div className='min-h-screen flex justify-center items-center px-4'>
      <div className='w-full max-w-md bg-background rounded-xl shadow-md p-8 space-y-4 border border-border flex flex-col justify-center items-center'>
        {error && (
          <div className='w-full rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive text-center'>
            {error}
          </div>
        )}
        <h2 className='text-2xl font-semibold text-center'>Sign Up</h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-3 w-full'
          >
            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='John Doe'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        disabled={isLoading}
                        {...field}
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute inset-y-0 right-2 flex items-center text-muted-foreground'
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        disabled={isLoading}
                        {...field}
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className='absolute inset-y-0 right-2 flex items-center text-muted-foreground'
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type='submit'
              className='w-full text-white transition-all duration-300 cursor-pointer'
              disabled={isLoading}
            >
              {!isLoading && "Sign Up"}
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

        {/* Google Signup Button */}
        <Button
          variant='outline'
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className='w-full cursor-pointer hover:bg-accent/20 hover:text-black/80 dark:hover:bg-accent/20 dark:text-white flex justify-center items-center space-x-3 transition-all duration-300'
        >
          <Image
            src='/google-logo.png'
            alt='Google Logo'
            width={20}
            height={20}
          />
          Continue with Google
        </Button>

        {/* Login Link */}
        <div className='text-center text-sm'>
          <span className='text-muted-foreground'>
            Already have an account?{" "}
          </span>
          <Link href='/login' className='text-primary hover:underline'>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
