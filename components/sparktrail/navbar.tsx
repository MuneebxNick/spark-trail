'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SparkMark } from './spark-mark'
import { ThemeToggle } from './theme-toggle'
import { TransitionLink } from '@/components/animations/route-transition'

const NAV_LINKS = [
  { name: 'Explore', href: '#' },
  { name: 'How It Works', href: '#' },
  { name: 'Community', href: '#' },
]

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      // Navbar is visible ONLY while in Hero section (scrolled < 85% of hero viewport height)
      const heroThreshold = window.innerHeight * 0.85
      setIsVisible(window.scrollY < heroThreshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute top-0 z-50 w-full bg-transparent border-b border-transparent transition-opacity duration-300 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10 py-5 md:py-6"
        aria-label="Primary"
      >
        <Link
          href="#"
          className="flex items-center gap-2.5 rounded-sm transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7857FF]"
        >
          <SparkMark className="h-8 w-8" />
          <span className="font-heading text-[17px] font-semibold tracking-tight text-[#111111] dark:text-[#F6F5EF] transition-colors duration-200">
            SparkTrail
          </span>
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="group relative inline-block py-1 text-[13.5px] font-medium text-[#111111]/65 dark:text-[#F6F5EF]/65 transition-colors duration-200 hover:text-[#111111] dark:hover:text-[#F6F5EF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7857FF]"
              >
                <span className="inline-block transition-transform duration-200 ease-out group-hover:-translate-y-[1px]">
                  {link.name}
                </span>
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-[#111111] dark:bg-[#F6F5EF] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 sm:gap-5">
          <ThemeToggle />
          <TransitionLink
            href="/login"
            className="hidden text-[13.5px] font-medium text-[#111111]/65 dark:text-[#F6F5EF]/65 transition-colors duration-200 hover:text-[#111111] dark:hover:text-[#F6F5EF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7857FF] sm:inline"
          >
            Log in
          </TransitionLink>
          <TransitionLink
            href="/register"
            className="inline-flex items-center rounded-full bg-[#111111] dark:bg-[#F6F5EF] px-4 sm:px-5 py-2 sm:py-2.5 text-[12.5px] sm:text-[13px] font-semibold text-[#F6F5EF] dark:text-[#111111] shadow-[0_4px_14px_-4px_rgba(17,17,17,0.35)] dark:shadow-[0_4px_14px_-4px_rgba(255,255,255,0.2)] transition-all duration-200 hover:bg-[#111111]/88 dark:hover:bg-[#F6F5EF]/88 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7857FF]"
          >
            Start your trail
          </TransitionLink>
        </div>
      </nav>
    </motion.header>
  )
}
