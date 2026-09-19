'use client'

import { motion, Variants, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useRouteTransition } from '@/components/animations/route-transition'

const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { isTransitioning } = useRouteTransition()
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: isTransitioning ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.32,
        ease: EASE_CINEMATIC,
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({
  children,
  className = '',
  delay = 0.08,
  stagger = 0.08,
}: {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
}) {
  const pathname = usePathname()
  const { isTransitioning } = useRouteTransition()
  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : stagger,
        delayChildren: shouldReduceMotion ? 0 : delay,
      },
    },
  }

  return (
    <motion.div
      key={pathname}
      variants={containerVariants}
      initial="hidden"
      animate={isTransitioning ? 'hidden' : 'visible'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = '',
  y = 12,
  duration = 0.45,
}: {
  children: ReactNode
  className?: string
  y?: number
  duration?: number
}) {
  const shouldReduceMotion = useReducedMotion()

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : duration,
        ease: EASE_CINEMATIC,
      },
    },
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}
