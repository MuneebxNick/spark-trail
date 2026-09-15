'use client'

import { useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    const onScroll = () => {
      if (typeof window === 'undefined') return
      const scrollHeight = document.documentElement.scrollHeight
      const scrollPos = window.scrollY + window.innerHeight
      // Reveal ONLY when user reaches the absolute bottom/end of the page (within 40px margin)
      setIsVisible(scrollPos >= scrollHeight - 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 })
    } else if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.5 })
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`group fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#F6F5EF] dark:bg-[#C7FF3D] text-[#111111] dark:text-[#111111] border border-[#111111]/10 dark:border-[#C7FF3D]/40 shadow-[0_4px_20px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_20px_rgba(199,255,61,0.3)] transition-all duration-300 ease-out hover:bg-white dark:hover:bg-[#d0ff52] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7857FF] ${
        isVisible
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-90 translate-y-2 pointer-events-none'
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
