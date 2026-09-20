'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageSquare, UserPlus, X, Check, Zap } from 'lucide-react'
import { UserAvatar } from './user-avatar'
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/actions/notifications'
import { useRouteTransition } from '@/components/animations/route-transition'

type NotificationType = 'NEW_SPARK' | 'NEW_COMMENT' | 'NEW_FOLLOWER'

interface Notification {
  id: string
  type: string
  read: boolean
  createdAt: Date
  actor: {
    name: string
    username: string
    avatarUrl: string | null
  }
  trail?: {
    id: string
    title: string
  } | null
}

interface NotificationsPopoverProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsPopover({ isOpen, onClose }: NotificationsPopoverProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const { transitionTo } = useRouteTransition()

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    setLoading(true)
    const { success, notifications: data } = await getNotifications(20)
    if (success && data) {
      setNotifications(data)
    }
    setLoading(false)
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      )
      await markNotificationAsRead(notification.id)
    }

    onClose()

    // Navigate based on type
    if (notification.type === 'NEW_FOLLOWER') {
      transitionTo(`/profile/${notification.actor.username}`)
    } else if (notification.trail) {
      if (notification.type === 'NEW_COMMENT') {
        transitionTo(`/trails/${notification.trail.id}#comments`)
      } else {
        transitionTo(`/trails/${notification.trail.id}?from=notifications`)
      }
    }
  }

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    await markAllNotificationsAsRead()
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + 'y'
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + 'mo'
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + 'd'
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + 'h'
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + 'm'
    return Math.floor(seconds) + 's'
  }

  const popoverRef = useRef<HTMLDivElement>(null)

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Lock page scroll and freeze Lenis while the notification panel is open
  useEffect(() => {
    if (!isOpen) return

    const html = document.documentElement
    const body = document.body

    // Capture current scroll position before locking
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    // Stop Lenis smooth scrolling if present
    if (window.__lenis) {
      window.__lenis.stop()
    }

    // Measure scrollbar width before hiding it
    const scrollbarWidth = window.innerWidth - html.clientWidth

    // Save original inline styles so we can restore them exactly
    const savedHtmlOverflow = html.style.overflow
    const savedHtmlPaddingRight = html.style.paddingRight
    const savedBodyOverflow = body.style.overflow
    const savedBodyPaddingRight = body.style.paddingRight

    // Lock both html and body to cover all scroll sources
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    // Compensate for scrollbar disappearance to prevent layout shift
    if (scrollbarWidth > 0) {
      html.style.paddingRight = `${scrollbarWidth}px`
      body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      // Restore original styles
      html.style.overflow = savedHtmlOverflow
      html.style.paddingRight = savedHtmlPaddingRight
      body.style.overflow = savedBodyOverflow
      body.style.paddingRight = savedBodyPaddingRight

      // Restore exact scroll position
      window.scrollTo(scrollX, scrollY)

      // Resume Lenis
      if (window.__lenis) {
        window.__lenis.start()
      }
    }
  }, [isOpen])

  const content = (
    <div className="flex flex-col h-full min-h-0 bg-[#F6F5EF] dark:bg-[#0D0E10] text-[#111111] dark:text-[#FFFFFF]">
      <div className="flex items-center justify-between p-4 border-b border-[#111111]/[0.08] dark:border-white/10 shrink-0 sticky top-0 z-10 bg-[#F6F5EF] dark:bg-[#0D0E10]">
        <h2 className="text-[17px] font-heading font-semibold tracking-tight">Notifications</h2>
        <div className="flex items-center gap-2">
          {notifications.some((n) => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="p-1.5 text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-colors rounded-md hover:bg-[#111111]/5 dark:hover:bg-white/10"
              title="Mark all as read"
              aria-label="Mark all as read"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 md:hidden text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-colors rounded-md hover:bg-[#111111]/5 dark:hover:bg-white/10"
            title="Close"
            aria-label="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        data-lenis-prevent
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {loading && notifications.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-5 h-5 rounded-full border-2 border-[#111111]/20 border-t-[#7857FF] dark:border-white/20 dark:border-t-[#7857FF] animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-[#737373] dark:text-[#A1A1AA]">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#111111]/5 dark:bg-white/5 flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-[#111111]/40 dark:text-white/40" />
            </div>
            <p className="text-[14px] font-medium text-[#111111] dark:text-[#FFFFFF]">No notifications yet</p>
            <p className="text-[13px] mt-1">When someone interacts with you, it will show up here.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#111111]/[0.08] dark:divide-white/10">
            {notifications.map((notification) => {
              const isUnread = !notification.read
              let icon = null
              let messageContent = null

              switch (notification.type as NotificationType) {
                case 'NEW_SPARK':
                  icon = <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-white dark:border-[#16171A]"><Zap className="w-3.5 h-3.5 fill-current" /></div>
                  messageContent = (
                    <span>
                      <span className="font-semibold text-[#111111] dark:text-[#FFFFFF]">{notification.actor.name}</span> sparked your trail <span className="font-medium text-[#111111] dark:text-[#FFFFFF]">"{notification.trail?.title}"</span>
                    </span>
                  )
                  break
                case 'NEW_COMMENT':
                  icon = <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-white dark:border-[#16171A]"><MessageSquare className="w-3.5 h-3.5 fill-current" /></div>
                  messageContent = (
                    <span>
                      <span className="font-semibold text-[#111111] dark:text-[#FFFFFF]">{notification.actor.name}</span> commented on <span className="font-medium text-[#111111] dark:text-[#FFFFFF]">"{notification.trail?.title}"</span>
                    </span>
                  )
                  break
                case 'NEW_FOLLOWER':
                  icon = <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-white dark:border-[#16171A]"><UserPlus className="w-3.5 h-3.5" /></div>
                  messageContent = (
                    <span>
                      <span className="font-semibold text-[#111111] dark:text-[#FFFFFF]">{notification.actor.name}</span> started following you
                    </span>
                  )
                  break
              }

              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-4 flex gap-3.5 transition-colors hover:bg-[#111111]/[0.02] dark:hover:bg-white/[0.02] ${
                    isUnread ? 'bg-[#7857FF]/[0.03] dark:bg-[#7857FF]/[0.05]' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <UserAvatar
                      avatarUrl={notification.actor.avatarUrl}
                      name={notification.actor.name}
                      username={notification.actor.username}
                      size="md"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      {icon}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="text-[13.5px] leading-[1.4] text-[#737373] dark:text-[#A1A1AA]">
                      {messageContent}
                    </div>
                    <div className="text-[11.5px] mt-1 text-[#111111]/40 dark:text-white/40 font-medium">
                      {formatTimeAgo(notification.createdAt)}
                    </div>
                  </div>

                  {isUnread && (
                    <div className="shrink-0 flex items-center justify-center w-2">
                      <div className="w-2 h-2 rounded-full bg-[#7857FF]"></div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Desktop: fixed full-viewport backdrop — blocks pointer interaction with the page behind */}
          <motion.div
            key="desktop-notification-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="hidden md:block fixed inset-0 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Desktop Popover */}
          <motion.div
            ref={popoverRef}
            data-lenis-prevent
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:flex md:flex-col absolute top-[calc(100%+8px)] right-0 w-[380px] max-h-[min(480px,calc(100vh-5.5rem))] z-50 bg-[#F6F5EF] dark:bg-[#0D0E10] border border-[#111111]/[0.08] dark:border-white/10 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden overscroll-contain"
          >
            {content}
          </motion.div>

          {/* Mobile Drawer Backdrop */}
          <motion.div
            key="mobile-notification-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Mobile Drawer Bottom Sheet */}
          <motion.div
            data-lenis-prevent
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-[80vh] max-h-[80vh] bg-[#F6F5EF] dark:bg-[#0D0E10] rounded-t-2xl shadow-2xl overflow-hidden border-t border-[#111111]/[0.08] dark:border-white/10 flex flex-col overscroll-contain"
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100) onClose()
            }}
          >
            <div className="w-full flex items-center justify-center p-2.5 pb-1 shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-[#111111]/10 dark:bg-white/20" />
            </div>
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              {content}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
