'use client'

import { useRef, useEffect, ReactNode, MouseEvent } from 'react'
import { useRouteTransition } from '@/components/animations/route-transition'
import gsap from 'gsap'

interface MagneticButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  href?: string
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export function MagneticButton({
  children,
  href = '#',
  className = '',
  onClick,
  ...props
}: MagneticButtonProps) {
  const outerRef = useRef<HTMLAnchorElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const { transitionTo } = useRouteTransition()

  useEffect(() => {
    const outerEl = outerRef.current
    const innerEl = innerRef.current
    if (!outerEl || !innerEl) return
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let isNear = false

    const onMouseMove = (e: globalThis.MouseEvent) => {
      const rect = outerEl.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)

      // Generous detection threshold: radius + 60px padding
      const threshold = Math.max(rect.width, rect.height) / 2 + 60

      if (dist < threshold) {
        isNear = true
        // Smooth falloff curve
        const factor = Math.cos((dist / threshold) * (Math.PI / 2))
        const maxOffset = 12
        const targetX = Math.max(-maxOffset, Math.min(maxOffset, dx * 0.25 * factor))
        const targetY = Math.max(-maxOffset, Math.min(maxOffset, dy * 0.25 * factor))

        gsap.to(innerEl, {
          x: targetX,
          y: targetY,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      } else if (isNear) {
        isNear = false
        gsap.to(innerEl, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
    }

    const onMouseLeave = () => {
      isNear = false
      gsap.to(innerEl, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    outerEl.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      outerEl.removeEventListener('mouseleave', onMouseLeave)
      gsap.set(innerEl, { x: 0, y: 0 })
    }
  }, [])

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e)

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    if (!href || href === '#') return

    e.preventDefault()
    transitionTo(href)
  }

  return (
    <a ref={outerRef} href={href} className={className} onClick={handleClick} {...props}>
      <span ref={innerRef} className="inline-flex items-center justify-center">
        {children}
      </span>
    </a>
  )
}

