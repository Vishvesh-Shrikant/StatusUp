"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted] = useState(() => typeof window !== "undefined");
  if (!mounted) return null;

  const isLight = theme === "light";

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className='relative rounded-full dark:hover:text-white'
    >
      <AnimatePresence mode='wait' initial={false}>
        {isLight ? (
          <motion.div
            key='moon'
            initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className='h-[1.2rem] w-[1.2rem]' />
          </motion.div>
        ) : (
          <motion.div
            key='sun'
            initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className='h-[1.2rem] w-[1.2rem]' />
          </motion.div>
        )}
      </AnimatePresence>
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
