'use client'

import { useTheme } from '@/lib/theme-provider'
import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={`h-8 w-8 rounded-full border border-transparent ${className}`}
        aria-hidden="true"
      />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative flex h-8 w-8 items-center justify-center rounded-full text-[#111111]/70 dark:text-[#F6F5EF]/70 hover:text-[#111111] dark:hover:text-[#F6F5EF] hover:bg-[#111111]/5 dark:hover:bg-white/10 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7857FF] ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="h-4 w-4 stroke-[1.8]" />
          ) : (
            <Sun className="h-4 w-4 stroke-[1.8]" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
