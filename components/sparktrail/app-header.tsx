'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SparkMark } from './spark-mark'
import { ThemeToggle } from './theme-toggle'
import { UserAvatar } from './user-avatar'
import { NotificationsPopover } from './notifications-popover'
import { logoutUser } from '@/actions/auth'
import {
  TransitionLink,
  useRouteTransition,
} from '@/components/animations/route-transition'
import { LogOut, Plus, Settings, Bell } from 'lucide-react'

interface UserProps {
  id: string
  email: string
  username: string
  name: string
  avatarUrl?: string | null
}

const NAV_ITEMS: { name: string; href: string; badge?: string }[] = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Explore', href: '/explore' },
  { name: 'My Trails', href: '/trails' },
]

export function AppHeader({ 
  user,
  unreadNotificationsCount = 0
}: { 
  user: UserProps
  unreadNotificationsCount?: number
}) {
  const pathname = usePathname()
  const { transitionTo } = useRouteTransition()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const isItemActive = (href: string) => {
    if (href === '/trails') {
      return pathname === '/trails' || (pathname.startsWith('/trails/') && pathname !== '/trails/new')
    }
    if (href === '/explore') {
      return pathname === '/explore' || pathname.startsWith('/explore/')
    }
    return pathname === href
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutUser()
      transitionTo('/login')
    } catch {
      setIsLoggingOut(false)
    }
  }

  // Auto-close drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  // Close when resized to desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

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
      <div className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10 py-4">
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
              const isActive = isItemActive(item.href)
              return (
                <TransitionLink
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center gap-1.5 text-[13.5px] font-medium transition-colors duration-200 ${isActive
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
            href="/trails/new"
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
          <TransitionLink
            href={`/profile/${user.username}`}
            className="flex items-center gap-2.5 rounded-full border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] py-1 pl-1 pr-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#7857FF]/40 transition-colors"
          >
            <UserAvatar avatarUrl={user.avatarUrl} name={user.name} username={user.username} size="sm" />
            <div className="flex flex-col text-left">
              <span className="text-[12.5px] font-semibold leading-tight text-[#111111] dark:text-[#FFFFFF]">
                {user.name}
              </span>
              <span className="text-[10.5px] leading-tight text-[#737373] dark:text-[#A1A1AA]">
                @{user.username}
              </span>
            </div>
          </TransitionLink>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              className="relative flex h-8 w-8 items-center justify-center rounded-full text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] hover:bg-[#111111]/5 dark:hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7857FF]"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-[2px] right-[2px] flex h-[7px] w-[7px] pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-red-500"></span>
                </span>
              )}
            </button>
            <NotificationsPopover 
              isOpen={isNotificationsOpen} 
              onClose={() => setIsNotificationsOpen(false)} 
            />
          </div>

          {/* Settings Link */}
          <TransitionLink
            href="/settings"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] hover:bg-[#111111]/5 dark:hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7857FF]"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </TransitionLink>

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
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#111111] dark:text-[#FFFFFF] hover:bg-[#111111]/5 dark:hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7857FF]"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <motion.span
                className="absolute h-[1.75px] w-[18px] bg-current rounded-full"
                animate={mobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="absolute h-[1.75px] w-[18px] bg-current rounded-full"
                animate={mobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="absolute h-[1.75px] w-[18px] bg-current rounded-full"
                animate={mobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Backdrop Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/30 dark:bg-black/60 backdrop-blur-xs md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-nav-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-40 overflow-hidden border-t border-[#111111]/[0.08] dark:border-white/10 bg-[#F6F5EF] dark:bg-[#0D0E10] shadow-xl md:hidden"
          >
            <div className="px-6 py-4 space-y-4">
              <TransitionLink
                href={`/profile/${user.username}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 pb-3 border-b border-[#111111]/[0.08] dark:border-white/10 hover:opacity-80 transition-opacity"
              >
                <UserAvatar avatarUrl={user.avatarUrl} name={user.name} username={user.username} size="md" />
                <div>
                  <p className="text-[13.5px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                    {user.name}
                  </p>
                  <p className="text-[11.5px] text-[#737373] dark:text-[#A1A1AA]">
                    @{user.username}
                  </p>
                </div>
              </TransitionLink>

              <nav className="flex flex-col space-y-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = isItemActive(item.href)
                  return (
                    <TransitionLink
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-2 text-[14px] font-medium transition-colors ${
                        isActive
                          ? 'text-[#7857FF] font-semibold'
                          : 'text-[#111111] dark:text-[#FFFFFF]'
                      }`}
                    >
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="rounded-full bg-[#111111]/5 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-[#737373] dark:text-[#A1A1AA]">
                          {item.badge}
                        </span>
                      )}
                    </TransitionLink>
                  )
                })}
              </nav>

              <div className="pt-2 border-t border-[#111111]/[0.08] dark:border-white/10 space-y-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setIsNotificationsOpen(true)
                  }}
                  className="w-full flex items-center gap-2 text-[13.5px] font-medium text-[#111111] dark:text-[#FFFFFF] py-2 justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-[#7857FF]" />
                    <span>Notifications</span>
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>
                <TransitionLink
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-[13.5px] font-medium text-[#111111] dark:text-[#FFFFFF] py-2"
                >
                  <Settings className="h-4 w-4 text-[#7857FF]" />
                  <span>Settings</span>
                </TransitionLink>
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
