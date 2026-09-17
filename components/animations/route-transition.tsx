'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  MouseEvent,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SparkMark } from '@/components/sparktrail/spark-mark'

interface RouteTransitionContextType {
  isTransitioning: boolean
  transitionTo: (href: string) => void
}

const RouteTransitionContext = createContext<RouteTransitionContextType>({
  isTransitioning: false,
  transitionTo: () => { },
})

export const useRouteTransition = () => useContext(RouteTransitionContext)

const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const

type InitialLoadStage = 'logo' | 'loader' | 'numberFade' | 'exitLogo' | 'exitBar' | 'curtainUp'

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [loadStage, setLoadStage] = useState<InitialLoadStage>('logo')
  const [progress, setProgress] = useState(0)

  // Initial Site Load Sequence — Only on Landing Page (pathname === '/')
  useEffect(() => {
    // Only show 0-100% initial preloader on landing page ('/')
    if (pathname !== '/') {
      setIsInitialLoad(false)
      return
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsInitialLoad(false)
      return
    }

    // Step 1: Logo appears immediately, then start 60fps smooth number counter after 350ms
    const loaderTimer = setTimeout(() => {
      setLoadStage('loader')

      const startTime = performance.now()
      const duration = 1400 // 1.4s ultra-smooth counter interpolation
      let animFrameId: number

      const updateProgress = (now: number) => {
        const elapsed = now - startTime
        const progressRatio = Math.min(elapsed / duration, 1)
        // Smooth ease-out quad curve for fluid counting
        const easedProgress = Math.round((1 - Math.pow(1 - progressRatio, 2)) * 100)

        setProgress(easedProgress)

        if (progressRatio < 1) {
          animFrameId = requestAnimationFrame(updateProgress)
        } else {
          setProgress(100)
          // Step 2: Smoothly fade out the '100%' number text while keeping progress bar visible
          setLoadStage('numberFade')

          // Step 3: 350ms later, animate logo lockup UP off-screen
          setTimeout(() => {
            setLoadStage('exitLogo')

            // Step 4: 240ms later, animate progress bar line UP off-screen
            setTimeout(() => {
              setLoadStage('exitBar')

              // Step 5: 420ms later, sweep curtain UP off-screen
              setTimeout(() => {
                setLoadStage('curtainUp')

                // Unmount initial curtain state after full 1350ms curtain sweep
                setTimeout(() => {
                  setIsInitialLoad(false)
                }, 1350)
              }, 420)
            }, 240)
          }, 350)
        }
      }

      animFrameId = requestAnimationFrame(updateProgress)
      return () => cancelAnimationFrame(animFrameId)
    }, 350)

    return () => clearTimeout(loaderTimer)
  }, [pathname])

  const transitionTo = useCallback(
    (href: string) => {
      // Don't transition if already on the exact target pathname
      if (!href || href === pathname) return

      // Check prefers-reduced-motion
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        router.push(href)
        return
      }

      setIsTransitioning(true)

      // Phase 1: Exit curtain sweep UP from bottom to cover viewport (850ms), then push route
      setTimeout(() => {
        router.push(href)
        // Phase 2: Hold 150ms at full cover, then trigger curtain exit UP (total 1000ms)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 150)
      }, 850)
    },
    [pathname, router]
  )

  const activeTransitioningState = isTransitioning || isInitialLoad

  return (
    <RouteTransitionContext.Provider
      value={{ isTransitioning: activeTransitioningState, transitionTo }}
    >
      {children}

      {/* 1. Initial Site Load / Refresh Curtain Choreography (Landing Page Only) */}
      <AnimatePresence mode="wait">
        {isInitialLoad && pathname === '/' && (
          <motion.div
            key="initial-curtain-loader"
            initial={{ y: '0%' }}
            animate={{ y: loadStage === 'curtainUp' ? '-100%' : '0%' }}
            transition={{
              duration: loadStage === 'curtainUp' ? 1.35 : 0,
              ease: EASE_CINEMATIC,
            }}
            aria-hidden="true"
            className="fixed inset-0 z-[99999] flex flex-col justify-between bg-[#F6F5EF] dark:bg-[#0D0E10] transition-colors duration-200 transform-gpu will-change-transform"
          >
            {/* Top Empty Spacer */}
            <div className="h-6 w-full" />

            {/* Center Content Sequence Container */}
            <div className="flex flex-col items-center justify-center px-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-7">
                {/* Brand Logo & Title Lockup: Animates UP off-screen FIRST on exit */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  animate={
                    loadStage === 'exitLogo' ||
                    loadStage === 'exitBar' ||
                    loadStage === 'curtainUp'
                      ? { opacity: 0, y: '-100vh', scale: 0.96 }
                      : { opacity: 1, scale: 1, y: 0 }
                  }
                  transition={{ duration: 0.95, ease: EASE_CINEMATIC }}
                  className="flex items-center gap-3.5 transform-gpu will-change-transform"
                >
                  <SparkMark className="h-10 w-10 sm:h-11 sm:w-11" />
                  <span className="font-heading text-[26px] sm:text-[32px] font-semibold tracking-tight text-[#111111] dark:text-[#FFFFFF]">
                    SparkTrail
                  </span>
                </motion.div>

                {/* Progress Container */}
                <div className="flex flex-col items-center space-y-3.5">
                  {/* 0% -> 100% Number Text: Fades out smoothly when 100% is reached */}
                  <motion.span
                    initial={{ opacity: 0, y: 12 }}
                    animate={
                      loadStage === 'logo'
                        ? { opacity: 0, y: 12 }
                        : loadStage === 'numberFade' ||
                          loadStage === 'exitLogo' ||
                          loadStage === 'exitBar' ||
                          loadStage === 'curtainUp'
                        ? { opacity: 0, y: -10 }
                        : { opacity: 1, y: 0 }
                    }
                    transition={{ duration: 0.4, ease: EASE_CINEMATIC }}
                    className="font-heading text-[58px] sm:text-[72px] font-bold tracking-tight text-[#111111] dark:text-[#FFFFFF] tabular-nums leading-none transform-gpu will-change-transform"
                  >
                    {progress}%
                  </motion.span>

                  {/* Progress Bar Line: Remains visible at 100% and then animates UP off-screen */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={
                      loadStage === 'logo'
                        ? { opacity: 0, y: 12 }
                        : loadStage === 'exitBar' || loadStage === 'curtainUp'
                        ? { opacity: 0, y: '-100vh' }
                        : { opacity: 1, y: 0 }
                    }
                    transition={{ duration: 0.95, ease: EASE_CINEMATIC }}
                    className="h-[2.5px] w-48 sm:w-56 overflow-hidden rounded-full bg-[#111111]/10 dark:bg-white/10 transform-gpu will-change-transform"
                  >
                    <div
                      className="h-full bg-[#7857FF] transition-all duration-100 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Bottom Hairline */}
            <div className="h-[1px] w-full bg-[#111111]/[0.08] dark:bg-white/10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. In-App Navigation Route Transition Curtain */}
      <AnimatePresence mode="wait">
        {isTransitioning && !isInitialLoad && (
          <motion.div
            key="route-curtain"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.85, ease: EASE_CINEMATIC }}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[99998] flex flex-col justify-between bg-[#F6F5EF] dark:bg-[#0D0E10] transition-colors duration-200 transform-gpu will-change-transform"
          >
            {/* Top Empty Spacer */}
            <div className="h-6 w-full" />

            {/* Center Editorial Brand Composition */}
            <div className="flex flex-col items-center justify-center space-y-4.5 px-6 text-center">
              {/* Text Eyebrow */}
              <div className="overflow-hidden pb-1">
                <motion.p
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE_CINEMATIC, delay: 0.1 }}
                  className="text-[11.5px] font-semibold tracking-[0.16em] text-[#7857FF] uppercase transform-gpu"
                >
                  PROGRESS HAS A STORY
                </motion.p>
              </div>

              {/* Brand Logo & Name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.55, ease: EASE_CINEMATIC, delay: 0.16 }}
                className="flex items-center gap-3 transform-gpu"
              >
                <SparkMark className="h-8 w-8" />
                <span className="font-heading text-[18px] font-semibold tracking-[0.14em] text-[#111111] dark:text-[#FFFFFF] uppercase">
                  SparkTrail
                </span>
              </motion.div>

              {/* Subtle Brand Purple Accent Line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.5, ease: EASE_CINEMATIC, delay: 0.24 }}
                className="h-[2px] w-28 sm:w-36 overflow-hidden rounded-full bg-[#7857FF] transform-gpu"
              />
            </div>

            {/* Bottom Hairline */}
            <div className="h-[1px] w-full bg-[#111111]/[0.08] dark:bg-white/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </RouteTransitionContext.Provider>
  )
}

/**
 * Reusable Transition Link component for all in-app navigation.
 */
export function TransitionLink({
  href,
  children,
  className = '',
  onClick,
  ...props
}: {
  href: string
  children: ReactNode
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  [key: string]: unknown
}) {
  const { transitionTo } = useRouteTransition()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e)

    // Ignore modifier keys (Cmd/Ctrl + click to open in new tab)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    // If href is placeholder "#", allow default behavior
    if (!href || href === '#') return

    e.preventDefault()
    transitionTo(href)
  }

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  )
}



