import { requireAuth } from '@/lib/auth/session'
import { AppHeader } from '@/components/sparktrail/app-header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <div className="min-h-svh bg-[#F6F5EF] dark:bg-[#0D0E10] text-[#111111] dark:text-[#FFFFFF] transition-colors duration-300">
      <AppHeader user={user} />
      <main className="mx-auto max-w-7xl px-6 md:px-10 py-10 md:py-14">
        {children}
      </main>
    </div>
  )
}
