'use client'

import { ReactLenis } from 'lenis/react'
import type { LenisRef } from 'lenis/react'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

/**
 * Global smooth scrolling provider using Lenis.
 *
 * Usage: Wrap your page content in the root layout.
 * This component uses `root` mode which attaches Lenis to the
 * window/document — no extra wrapper divs are injected.
 *
 * GSAP ScrollTrigger compatibility:
 * When integrating GSAP ScrollTrigger in the future, switch `autoRaf`
 * to `false` in the options and drive Lenis from `gsap.ticker`:
 *
 * ```ts
 * gsap.ticker.add((time) => {
 *   lenisRef.current?.lenis?.raf(time * 1000)
 * })
 * gsap.ticker.lagSmoothing(0)
 * ```
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    // Expose lenis instance globally for debugging and GSAP integration
    if (lenisRef.current?.lenis) {
      window.__lenis = lenisRef.current.lenis
    }

    return () => {
      delete window.__lenis
    }
  }, [])

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
