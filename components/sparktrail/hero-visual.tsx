'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { FeaturedProgressCard, MiniProgressCard } from './progress-card'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

// ---------------------------------------------------------------------------
// Social proof chip
// ---------------------------------------------------------------------------

const AVATAR_COLORS = ['#7857FF', '#111111', '#C7FF3D']

export function SocialProofChip({ className }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border border-[#111111]/[0.06] dark:border-white/10 bg-white dark:bg-[#16171A] px-4 py-2.5 shadow-[0_4px_16px_-4px_rgba(17,17,17,0.06)] dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.4)] transition-colors duration-200 ${className ?? ''}`}
    >
      <div className="flex items-center -space-x-2.5" aria-hidden="true">
        {AVATAR_COLORS.map((color) => (
          <span
            key={color}
            className="h-6 w-6 rounded-full border-2 border-white dark:border-[#16171A] transition-colors duration-200"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#737373] dark:text-[#A1A1AA] transition-colors duration-200">
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7857FF]/50" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#7857FF]" />
        </span>
        340+ trails logged today
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// HeroVisual — main export
// ---------------------------------------------------------------------------

export function HeroVisual() {
  const prefersReduced = useReducedMotion()

  const entranceProps = (delay: number) => prefersReduced ? {} : {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO }
    }
  }

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[420px] lg:max-w-none lg:pl-10">

      {/* 
        The "Trail Widget"
        A structured vertical timeline that feels like a cohesive UI component.
      */}
      <div className="relative flex flex-col gap-6 py-4">

        {/* Continuous vertical trail line */}
        <motion.div
          {...(prefersReduced ? {} : {
            initial: { scaleY: 0 },
            animate: { scaleY: 1, transition: { duration: 1.2, delay: 0.2, ease: EASE_OUT_EXPO } }
          })}
          className="absolute left-[17px] top-8 bottom-8 w-[2px] origin-top bg-[#111111]/[0.06] dark:bg-white/10 hidden sm:block transition-colors duration-200"
        />

        {/* Item 1: Learning */}
        <motion.div {...entranceProps(0.3)} className="relative flex items-start sm:gap-6">
          {/* Node */}
          <div className="hidden sm:flex mt-6 w-[36px] justify-center z-10 shrink-0">
            <div className="h-2.5 w-2.5 rounded-full bg-[#7857FF] shadow-[0_0_0_4px_#F6F5EF] dark:shadow-[0_0_0_4px_#0D0E10] transition-shadow duration-200" />
          </div>
          {/* Card */}
          <div className="w-full lg:w-[280px]">
            <MiniProgressCard
              status="LEARNING"
              text="Understanding server components"
            />
          </div>
        </motion.div>

        {/* Item 2: Building (Main) */}
        <motion.div {...entranceProps(0.4)} className="relative flex items-start sm:gap-6">
          {/* Node */}
          <div className="hidden sm:flex mt-12 w-[36px] justify-center z-10 shrink-0">
            <div className="h-2.5 w-2.5 rounded-full bg-[#C7FF3D] shadow-[0_0_0_4px_#F6F5EF] dark:shadow-[0_0_0_4px_#0D0E10] transition-shadow duration-200" />
          </div>
          {/* Card */}
          <div className="w-full lg:w-[340px]">
            <FeaturedProgressCard />
          </div>
        </motion.div>

        {/* Item 3: Win */}
        <motion.div {...entranceProps(0.5)} className="relative flex items-start sm:gap-6">
          {/* Node */}
          <div className="hidden sm:flex mt-6 w-[36px] justify-center z-10 shrink-0">
            <div className="h-2.5 w-2.5 rounded-full bg-[#C7FF3D] shadow-[0_0_0_4px_#F6F5EF] dark:shadow-[0_0_0_4px_#0D0E10] transition-shadow duration-200" />
          </div>
          {/* Card */}
          <div className="w-full lg:w-[280px]">
            <MiniProgressCard
              status="WIN"
              text="Shipped v1.0 to production"
            />
          </div>
        </motion.div>

        {/* Social Proof Chip */}
        <motion.div {...entranceProps(0.6)} className="relative flex items-start sm:gap-6 mt-2">
          {/* Empty spacer for alignment */}
          <div className="hidden sm:block w-[36px] shrink-0" />
          <div className="w-full lg:w-[280px]">
            <SocialProofChip />
          </div>
        </motion.div>

      </div>
    </div>
  )
}
