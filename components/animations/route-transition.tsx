'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  MouseEvent,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface RouteTransitionContextType {
  isTransitioning: boolean
  transitionTo: (href: string) => void
}

const RouteTransitionContext = createContext<RouteTransitionContextType>({
  isTransitioning: false,
  transitionTo: () => {},
})

export const useRouteTransition = () => useContext(RouteTransitionContext)

const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)

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

      // Phase 1: Exit curtain sweep (320ms), then push route
      setTimeout(() => {
        router.push(href)
        // Phase 2: Hold & Reveal destination route (380ms)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 380)
      }, 320)
    },
    [pathname, router]
  )

  return (
    <RouteTransitionContext.Provider value={{ isTransitioning, transitionTo }}>
      {children}

      {/* Cinematic Viewport Curtain Overlay */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key="route-curtain"
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: EASE_CINEMATIC }}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[99999] flex flex-col justify-between bg-[#F6F5EF] dark:bg-[#0D0E10] transition-colors duration-200"
          >
            {/* Top Accent Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.28, delay: 0.05, ease: EASE_CINEMATIC }}
              className="h-[2px] w-full origin-left bg-gradient-to-r from-[#7857FF] via-[#5D3FD3] to-[#C7FF3D]"
            />

            {/* Subtle Center Brand Accent Mark */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.22, delay: 0.08, ease: EASE_CINEMATIC }}
                className="flex items-center gap-2"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#7857FF]" />
                <span className="font-heading text-[13px] font-semibold tracking-[0.14em] text-[#111111] dark:text-[#FFFFFF] uppercase">
                  SparkTrail
                </span>
              </motion.div>
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
