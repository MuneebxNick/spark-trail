import { requireAuth } from '@/lib/auth/session'
import { AppHeader } from '@/components/sparktrail/app-header'
import { getUnreadNotificationCount } from '@/actions/notifications'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()
  const { count } = await getUnreadNotificationCount()

  return (
    <div className="min-h-svh bg-[#F6F5EF] dark:bg-[#0D0E10] text-[#111111] dark:text-[#FFFFFF] transition-colors duration-300">
      <AppHeader user={user} unreadNotificationsCount={count || 0} />
      <main className="mx-auto max-w-7xl px-6 md:px-10 pt-6 md:pt-8 pb-14 md:pb-16">
        {children}
      </main>
    </div>
  )
}
