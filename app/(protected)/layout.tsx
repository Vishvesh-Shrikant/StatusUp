"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button"; // If you use shadcn/ui
import Image from "next/image";
import { ThemeToggle } from "@/components/theme/themeToggle";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mounted] = useState(() => typeof window !== "undefined");
  if (!mounted) return null;

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300'>
      {/* 🌟 Header */}
      <header className='flex items-center justify-between px-6 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950'>
        <div className='w-32 h-12 relative'>
          <Image
            src={"/mainlogo.png"}
            alt='StatusUp Logo'
            fill
            className='object-contain'
            sizes='130px'
            priority
          />
        </div>

        <div className='flex items-center gap-3'>
          {/* 🌗 Theme Toggle */}
          <ThemeToggle />

          {/* 🚪 Sign Out Button */}
          <Button
            variant='outline'
            className='flex items-center gap-2 hover:bg-primary! dark:text-white! transition-all cursor-pointer'
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className='h-4 w-4' />
            Sign Out
          </Button>
        </div>
      </header>

      {/* 🧱 Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
