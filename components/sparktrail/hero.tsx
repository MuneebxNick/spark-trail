'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MagneticButton } from '@/components/animations/magnetic-button'
import { HeroVisual } from './hero-visual'
import { ScrollIndicator } from './scroll-indicator'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const textGroupRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full flex-col justify-center bg-[#F6F5EF] dark:bg-[#0D0E10] transition-colors duration-300"
    >
      {/* Main hero content — vertically centered */}
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 pt-24 pb-32">
        <div className="grid min-w-0 items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
          {/* ---- Left column: text ---- */}
          <div className="min-w-0 max-w-xl flex flex-col items-start" ref={textGroupRef}>
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
                className="text-[12px] font-semibold tracking-[0.14em] text-[#7857FF]"
              >
                PROGRESS, WITHOUT THE PRESSURE
              </motion.p>
            </div>

            <h1 className="mt-5 font-heading text-[42px] font-semibold leading-[1.05] tracking-tight text-[#111111] dark:text-[#FFFFFF] transition-colors duration-200 sm:text-[56px] md:text-[68px] lg:text-[76px] lg:leading-[1.02]">
              <span className="block overflow-hidden pb-2">
                <motion.span
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.2 }}
                  className="block"
                >
                  Small steps.
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.28 }}
                  className="block"
                >
                  Real progress.
                </motion.span>
              </span>
            </h1>

            <div className="mt-6 overflow-hidden">
              <motion.p
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.4 }}
                className="max-w-md text-[17px] leading-relaxed text-[#737373] dark:text-[#D4D4D8] transition-colors duration-200"
              >
                Share what you&apos;re learning, building, fixing and winning
                &mdash; without the noise of traditional social media.
              </motion.p>
            </div>

            <div className="mt-9 overflow-hidden">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.5 }}
                className="flex flex-wrap items-center gap-4"
              >
                <MagneticButton
                  href="#"
                  data-magnetic
                  className="inline-flex items-center rounded-full bg-[#111111] dark:bg-[#FFFFFF] px-6 py-3.5 text-[14px] font-semibold text-[#F6F5EF] dark:text-[#111111] transition-colors hover:bg-[#111111]/85 dark:hover:bg-[#FFFFFF]/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7857FF]"
                >
                  Start your trail
                </MagneticButton>
                <Link
                  href="#"
                  className="group inline-flex items-center gap-1.5 rounded-full px-6 py-3.5 text-[14px] font-semibold text-[#111111] dark:text-[#FFFFFF] transition-colors hover:text-[#111111]/70 dark:hover:text-[#FFFFFF]/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7857FF]"
                >
                  Explore community
                  <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:translate-x-1">&rarr;</span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* ---- Right column: card composition ---- */}
          <HeroVisual />
        </div>
      </div>

      {/* Centered scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.6 }}
          className="hidden sm:block"
        >
          <ScrollIndicator />
        </motion.div>
      </div>
    </section>
  )
}
