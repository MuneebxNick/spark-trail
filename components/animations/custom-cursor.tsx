'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

import { usePathname } from 'next/navigation'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default trailing dot size in px */
const DOT_SIZE = 8
/** Expanded size when hovering interactive elements */
const HOVER_SIZE = 56
/** Expanded size when showing a data-cursor label */
const LABEL_SIZE = 80
/** Duration for the trailing follow */
const FOLLOW_DURATION = 0.2
/** Selectors that trigger the hover-expand state */
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input[type="submit"], summary'
/** Attribute for custom cursor labels */
const LABEL_ATTR = 'data-cursor'
/** Attribute for magnetic elements */
const MAGNETIC_ATTR = 'data-magnetic'
/** Magnetic pull strength (fraction of distance from center) */
const MAGNETIC_STRENGTH = 0.3
/** Magnetic return duration */
const MAGNETIC_RETURN = 0.5

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(pointer: coarse)').matches
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function closest(el: EventTarget | null, selector: string): HTMLElement | null {
  if (!(el instanceof HTMLElement)) return null
  return el.closest(selector)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Premium trailing custom cursor using GSAP.
 *
 * Architecture:
 * - Single element: a small black dot that trails the native cursor.
 * - On hover: expands into a translucent white/grey overlay (NO BLUR).
 * - On data-cursor hover: expands further and shows a label.
 * - Native cursor remains visible (no CSS cursor: none override).
 * - All movement via gsap.quickTo — zero React re-renders on mousemove.
 * - pointer-events: none on everything — never blocks interaction.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const resetStateRef = useRef<(() => void) | null>(null)
  const pathname = usePathname()

  const setup = useCallback(() => {
    const cursor = cursorRef.current
    const label = labelRef.current
    if (!cursor || !label) return
    if (isTouchDevice()) {
      cursor.style.display = 'none'
      return
    }

    const reduced = prefersReducedMotion()
    const followDuration = reduced ? 0.05 : FOLLOW_DURATION

    // ---- GSAP quickTo for trailing motion ----
    const xTo = gsap.quickTo(cursor, 'x', {
      duration: followDuration,
      ease: 'power3.out',
    })
    const yTo = gsap.quickTo(cursor, 'y', {
      duration: followDuration,
      ease: 'power3.out',
    })

    // ---- State tracking (no React state) ----
    let isHovering = false
    let isLabel = false
    let activeMagnetic: HTMLElement | null = null

    // ---- Background adaptation helper ----
    let isOverDark = false
    let lastX = 0
    let lastY = 0

    const isDarkAtPoint = (x: number, y: number): boolean => {
      if (typeof window === 'undefined') return false
      let el = document.elementFromPoint(x, y)
      while (el && el !== document.body && el !== document.documentElement) {
        if (el instanceof HTMLElement) {
          const cls = el.className || ''
          if (
            typeof cls === 'string' &&
            (cls.includes('bg-[#101113]') ||
              cls.includes('bg-[#111111]') ||
              cls.includes('bg-black') ||
              cls.includes('bg-neutral-900') ||
              cls.includes('bg-zinc-900'))
          ) {
            return true
          }
          const bg = window.getComputedStyle(el).backgroundColor
          if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
            if (match) {
              const alpha = match[4] !== undefined ? parseFloat(match[4]) : 1
              if (alpha > 0.1) {
                const r = parseInt(match[1], 10)
                const g = parseInt(match[2], 10)
                const b = parseInt(match[3], 10)
                const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
                return luminance < 128
              }
            }
          }
        }
        el = el.parentElement
      }
      return false
    }

    const checkBackground = (x: number, y: number) => {
      const isDark = isDarkAtPoint(x, y)
      if (isDark !== isOverDark) {
        isOverDark = isDark
        if (!isHovering && !isLabel) {
          gsap.to(cursor, {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(17, 17, 17, 1)',
            borderColor: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(17, 17, 17, 1)',
            duration: 0.3,
            ease: 'power2.out',
          })
        }
      }
    }

    // ---- Mouse move handler ----
    const onMouseMove = (e: MouseEvent) => {
      lastX = e.clientX
      lastY = e.clientY
      xTo(e.clientX)
      yTo(e.clientY)
      checkBackground(e.clientX, e.clientY)

      // Safety check for stuck hover/label states after DOM mutations or unmounts
      if (isHovering || isLabel) {
        const elUnderPoint = document.elementFromPoint(e.clientX, e.clientY)
        const stillInteractive = elUnderPoint?.closest?.(INTERACTIVE_SELECTOR)
        const stillLabel = elUnderPoint?.closest?.(`[${LABEL_ATTR}]`)
        if (!stillInteractive && !stillLabel) {
          toDefault()
        }
      }

      // Magnetic pull
      if (activeMagnetic) {
        const rect = activeMagnetic.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) * MAGNETIC_STRENGTH
        const dy = (e.clientY - cy) * MAGNETIC_STRENGTH
        gsap.to(activeMagnetic, {
          x: dx,
          y: dy,
          duration: 0.5,
          ease: 'power2.out',
        })
      }
    }

    const onScroll = () => {
      if (lastX !== 0 || lastY !== 0) {
        checkBackground(lastX, lastY)
      }
    }

    // ---- Transitions to default state ----
    const toDefault = () => {
      isHovering = false
      isLabel = false
      gsap.to(cursor, {
        width: DOT_SIZE,
        height: DOT_SIZE,
        backgroundColor: isOverDark ? 'rgba(255, 255, 255, 1)' : 'rgba(17, 17, 17, 1)',
        borderColor: isOverDark ? 'rgba(255, 255, 255, 1)' : 'rgba(17, 17, 17, 1)',
        duration: 0.3,
        ease: 'power3.out',
      })
      gsap.to(label, {
        opacity: 0,
        scale: 0.6,
        duration: 0.2,
        ease: 'power3.out',
      })
    }
    
    // Store for external triggers like route changes
    resetStateRef.current = toDefault

    // ---- Pointer enter / leave for hover states ----
    const onPointerOver = (e: PointerEvent) => {
      // Check for data-cursor label first (most specific)
      const labelEl = closest(e.target, `[${LABEL_ATTR}]`) as HTMLElement | null
      if (labelEl) {
        const text = labelEl.getAttribute(LABEL_ATTR) || ''
        label.textContent = text
        isLabel = true
        isHovering = true
        gsap.to(cursor, {
          width: LABEL_SIZE,
          height: LABEL_SIZE,
          backgroundColor: 'rgba(255, 255, 255, 0.4)', // Translucent overlay
          borderColor: 'rgba(255, 255, 255, 0.6)',
          duration: 0.4,
          ease: 'power3.out',
        })
        gsap.to(label, {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          delay: 0.05,
          ease: 'power3.out',
        })
        return
      }

      // Check for interactive elements
      const interactive = closest(e.target, INTERACTIVE_SELECTOR) as HTMLElement | null
      if (interactive && !isHovering) {
        isHovering = true
        gsap.to(cursor, {
          width: HOVER_SIZE,
          height: HOVER_SIZE,
          backgroundColor: 'rgba(255, 255, 255, 0.25)', // Subtle translucent overlay
          borderColor: 'rgba(255, 255, 255, 0.4)',
          duration: 0.4,
          ease: 'power3.out',
        })
      }

      // Check for magnetic elements
      const magnetic = closest(e.target, `[${MAGNETIC_ATTR}]`) as HTMLElement | null
      if (magnetic && !activeMagnetic) {
        activeMagnetic = magnetic
      }
    }

    const onPointerOut = (e: PointerEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null

      // Label leave check
      if (isLabel) {
        const stillInLabel = relatedTarget?.closest(`[${LABEL_ATTR}]`)
        if (!stillInLabel) {
          toDefault()
        }
        return
      }

      // Interactive leave check
      if (isHovering) {
        const stillInInteractive = relatedTarget?.closest(INTERACTIVE_SELECTOR)
        if (!stillInInteractive) {
          toDefault()
        }
      }

      // Magnetic leave check
      if (activeMagnetic) {
        const stillInMagnetic = relatedTarget?.closest(`[${MAGNETIC_ATTR}]`)
        if (!stillInMagnetic) {
          gsap.to(activeMagnetic, {
            x: 0,
            y: 0,
            duration: MAGNETIC_RETURN,
            ease: 'elastic.out(1, 0.4)',
          })
          activeMagnetic = null
        }
      }
    }

    // Hide / show when cursor enters / leaves viewport
    const onMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.25 })
      toDefault() // Reset state when leaving document completely
    }
    const onMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.25 })
    }

    // ---- Initial state ----
    gsap.set(cursor, {
      width: DOT_SIZE,
      height: DOT_SIZE,
      xPercent: -50,
      yPercent: -50,
      backgroundColor: 'rgba(17, 17, 17, 1)',
      borderColor: 'rgba(17, 17, 17, 1)',
      opacity: 0,
    })
    gsap.set(label, { opacity: 0, scale: 0.6 })

    // ---- Bind events ----
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('pointerout', onPointerOut)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    document.documentElement.addEventListener('mouseenter', onMouseEnter)

    // ---- Cleanup ----
    cleanupRef.current = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      document.documentElement.removeEventListener('mouseenter', onMouseEnter)
      if (activeMagnetic) {
        gsap.set(activeMagnetic, { x: 0, y: 0 })
      }
    }
  }, [])

  useEffect(() => {
    setup()
    return () => {
      cleanupRef.current?.()
    }
  }, [setup])

  // Reset on route change
  useEffect(() => {
    resetStateRef.current?.()
  }, [pathname])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full border border-transparent shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
      style={{ willChange: 'transform, width, height, background-color, border-color' }}
    >
      <span
        ref={labelRef}
        className="pointer-events-none select-none whitespace-nowrap text-[12px] font-semibold tracking-[0.05em] text-[#111111]"
      />
    </div>
  )
}
