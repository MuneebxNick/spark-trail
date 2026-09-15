'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { SparkMark } from './spark-mark'
import { ThemeToggle } from './theme-toggle'
import { logoutUser } from '@/actions/auth'
import {
  TransitionLink,
  useRouteTransition,
} from '@/components/animations/route-transition'
import { LogOut, Menu, X, Plus } from 'lucide-react'

interface UserProps {
  id: string
  email: string
  username: string
  name: string
  avatarUrl?: string | null
}

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', active: true },
  { name: 'Explore', href: '#', badge: 'Soon' },
  { name: 'My Trails', href: '#', badge: 'Soon' },
]

export function AppHeader({ user }: { user: UserProps }) {
  const pathname = usePathname()
  const { transitionTo } = useRouteTransition()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutUser()
      transitionTo('/login')
    } catch {
      setIsLoggingOut(false)
    }
  }

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.username.slice(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#111111]/[0.08] dark:border-white/10 bg-[#F6F5EF]/80 dark:bg-[#0D0E10]/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10 py-4">
        {/* Left Brand & Navigation */}
        <div className="flex items-center gap-8">
          <TransitionLink
            href="/dashboard"
            className="flex items-center gap-2.5 rounded-sm transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7857FF]"
          >
            <SparkMark className="h-7 w-7" />
            <span className="font-heading text-[17px] font-semibold tracking-tight text-[#111111] dark:text-[#FFFFFF] transition-colors">
              SparkTrail
            </span>
          </TransitionLink>

          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Application Navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <TransitionLink
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center gap-1.5 text-[13.5px] font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-[#111111] dark:text-[#FFFFFF] font-semibold'
                      : 'text-[#111111]/60 dark:text-[#FFFFFF]/60 hover:text-[#111111] dark:hover:text-[#FFFFFF]'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="rounded-full bg-[#111111]/5 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-[#737373] dark:text-[#A1A1AA]">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-4 left-0 right-0 h-[2px] bg-[#7857FF] rounded-full" />
                  )}
                </TransitionLink>
              )
            })}
          </nav>
        </div>

        {/* Right User Actions */}
        <div className="hidden md:flex items-center gap-4">
          <TransitionLink
            href="#"
            className="group inline-flex items-center gap-1.5 rounded-full border border-[#111111]/10 dark:border-white/10 bg-white dark:bg-[#16171A] px-3.5 py-1.5 text-[12.5px] font-semibold text-[#111111] dark:text-[#FFFFFF] hover:border-[#7857FF]/40 transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-[#7857FF]" />
            <span>Create Trail</span>
          </TransitionLink>

          <div
            className="h-4 w-px bg-[#111111]/10 dark:bg-white/10"
            aria-hidden="true"
          />

          <ThemeToggle />

          {/* User Badge */}
          <div className="flex items-center gap-2.5 rounded-full border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] py-1 pl-1 pr-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#7857FF] to-[#5D3FD3] text-[11px] font-bold text-white uppercase">
              {initials}
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[12.5px] font-semibold leading-tight text-[#111111] dark:text-[#FFFFFF]">
                {user.name}
              </span>
              <span className="text-[10.5px] leading-tight text-[#737373] dark:text-[#A1A1AA]">
                @{user.username}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Log out"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] hover:bg-[#111111]/5 dark:hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7857FF]"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#111111] dark:text-[#FFFFFF] hover:bg-[#111111]/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#111111]/[0.08] dark:border-white/10 bg-[#F6F5EF] dark:bg-[#0D0E10] px-6 py-4 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#111111]/[0.08] dark:border-white/10">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7857FF] to-[#5D3FD3] text-[12px] font-bold text-white uppercase">
              {initials}
            </span>
            <div>
              <p className="text-[13.5px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                {user.name}
              </p>
              <p className="text-[11.5px] text-[#737373] dark:text-[#A1A1AA]">
                @{user.username}
              </p>
            </div>
          </div>

          <nav className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => (
              <TransitionLink
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-[14px] font-medium text-[#111111] dark:text-[#FFFFFF]"
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="rounded-full bg-[#111111]/5 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-[#737373] dark:text-[#A1A1AA]">
                    {item.badge}
                  </span>
                )}
              </TransitionLink>
            ))}
          </nav>

          <div className="pt-2 border-t border-[#111111]/[0.08] dark:border-white/10">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 text-[13.5px] font-medium text-red-600 dark:text-red-400 py-2"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
