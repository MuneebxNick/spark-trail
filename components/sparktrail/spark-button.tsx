'use client'

import { useOptimistic, startTransition, useState } from 'react'
import { toggleSpark } from '@/actions/sparks'
import { Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SparkButtonProps {
  trailId: string
  initialSparked: boolean
  initialCount: number
}

export function SparkButton({ trailId, initialSparked, initialCount }: SparkButtonProps) {
  const [isSparked, setIsSparked] = useState(initialSparked)
  const [count, setCount] = useState(initialCount)
  const [isPending, setIsPending] = useState(false)

  const handleToggle = async () => {
    if (isPending) return

    // Optimistic update
    setIsSparked(!isSparked)
    setCount((prev) => (isSparked ? prev - 1 : prev + 1))
    setIsPending(true)

    const res = await toggleSpark(trailId)
    
    // Revert if failed
    if (!res.success) {
      setIsSparked(isSparked)
      setCount(initialCount)
    }

    setIsPending(false)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isSparked ? 'Remove spark' : 'Spark this trail'}
      aria-pressed={isSparked}
      className={`group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-all ${
        isSparked
          ? 'bg-[#7857FF]/10 text-[#7857FF] hover:bg-[#7857FF]/15'
          : 'bg-transparent text-[#737373] dark:text-[#A1A1AA] hover:bg-[#111111]/5 dark:hover:bg-white/5 border border-[#111111]/10 dark:border-white/10'
      }`}
    >
      <div className="relative flex items-center justify-center h-4 w-4">
        <AnimatePresence mode="wait">
          {isSparked ? (
            <motion.div
              key="filled"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute inset-0 flex items-center justify-center text-[#7857FF]"
            >
              <Zap className="h-4 w-4 fill-current" />
            </motion.div>
          ) : (
            <motion.div
              key="outline"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0"
            >
              <Zap className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span>{count}</span>
    </button>
  )
}
