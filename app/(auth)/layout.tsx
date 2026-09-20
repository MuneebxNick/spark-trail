import { SparkMark } from '@/components/sparktrail/spark-mark'
import { ThemeToggle } from '@/components/sparktrail/theme-toggle'
import { TransitionLink } from '@/components/animations/route-transition'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-[#F6F5EF] dark:bg-[#0D0E10] text-[#111111] dark:text-[#FFFFFF] transition-colors duration-300 flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full border-b border-[#111111]/[0.08] dark:border-white/10 bg-[#F6F5EF]/80 dark:bg-[#0D0E10]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10 py-3.5">
          <TransitionLink
            href="/"
            className="flex items-center gap-2.5 rounded-sm transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7857FF]"
          >
            <SparkMark className="h-7 w-7" />
            <span className="font-heading text-[17px] font-semibold tracking-tight text-[#111111] dark:text-[#FFFFFF] transition-colors">
              SparkTrail
            </span>
          </TransitionLink>

          <div className="flex items-center gap-5">
            <ThemeToggle />
            <TransitionLink
              href="/"
              className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>Back to home</span>
            </TransitionLink>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 flex items-center justify-center px-6 md:px-10 py-6 sm:py-8 lg:py-6">
        <div className="w-full max-w-5xl">{children}</div>
      </main>

      {/* Footer minimal brand tagline */}
      <footer className="w-full border-t border-[#111111]/[0.08] dark:border-white/10 py-4 text-center text-[12px] text-[#737373] dark:text-[#71717A]">
        <p>SparkTrail. Small steps. Real progress.</p>
      </footer>
    </div>
  )
}
