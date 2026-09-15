import { requireAuth } from '@/lib/auth/session'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/page-transition'
import { TransitionLink } from '@/components/animations/route-transition'
import { Plus, Compass, Activity, Sparkles, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <StaggerContainer className="space-y-12">
      {/* Personalized Welcome Header */}
      <StaggerItem className="flex flex-col items-start space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#7857FF]" />
          <p className="text-[12px] font-semibold tracking-[0.14em] text-[#7857FF] uppercase">
            Personal Studio
          </p>
        </div>

        <h1 className="font-heading text-[32px] font-semibold leading-tight tracking-tight text-[#111111] dark:text-[#FFFFFF] sm:text-[42px] md:text-[48px]">
          Welcome back, {user.name}.
        </h1>

        <p className="max-w-xl text-[16px] leading-relaxed text-[#737373] dark:text-[#D4D4D8]">
          Progress has a story. Document what you are learning, building, fixing,
          and winning &mdash; step by step, without the noise.
        </p>

        <div className="pt-2">
          <TransitionLink
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-[#111111] dark:bg-[#FFFFFF] px-6 py-3.5 text-[14px] font-semibold text-[#F6F5EF] dark:text-[#111111] hover:bg-[#111111]/85 dark:hover:bg-[#FFFFFF]/90 transition-all shadow-[0_4px_14px_-4px_rgba(17,17,17,0.35)] dark:shadow-[0_4px_14px_-4px_rgba(255,255,255,0.2)]"
          >
            <Plus className="h-4 w-4 text-[#C7FF3D] dark:text-[#7857FF]" />
            <span>Create your first trail</span>
          </TransitionLink>
        </div>
      </StaggerItem>

      <hr className="border-[#111111]/[0.08] dark:border-white/10" />

      {/* Editorial Overview Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Section 01: My Trails */}
        <StaggerItem className="flex flex-col rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-7 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[12px] font-semibold tracking-[0.12em] text-[#737373] dark:text-[#A1A1AA] uppercase">
              01 / My Trails
            </span>
            <Sparkles className="h-4 w-4 text-[#7857FF]" />
          </div>

          <div className="mt-8 flex flex-1 flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h2 className="font-heading text-[20px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                No active trails yet
              </h2>
              <p className="text-[14px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
                Trails organize your progress around specific projects, skills, or
                milestones. Start your first trail to log updates.
              </p>
            </div>

            <div className="pt-2">
              <TransitionLink
                href="#"
                className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#7857FF] hover:underline"
              >
                <span>Start a new trail</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </TransitionLink>
            </div>
          </div>
        </StaggerItem>

        {/* Section 02: Recent Activity */}
        <StaggerItem className="flex flex-col rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-7 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[12px] font-semibold tracking-[0.12em] text-[#737373] dark:text-[#A1A1AA] uppercase">
              02 / Recent Activity
            </span>
            <Activity className="h-4 w-4 text-[#737373] dark:text-[#A1A1AA]" />
          </div>

          <div className="mt-8 flex flex-1 flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h2 className="font-heading text-[20px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                Activity log is quiet
              </h2>
              <p className="text-[14px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
                Your progress entries, blockers, and milestone wins will populate here in
                chronological order as you build.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[12.5px] text-[#737373] dark:text-[#71717A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              <span>Ready for your first update</span>
            </div>
          </div>
        </StaggerItem>

        {/* Section 03: Community Pulse */}
        <StaggerItem className="flex flex-col rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-7 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[12px] font-semibold tracking-[0.12em] text-[#737373] dark:text-[#A1A1AA] uppercase">
              03 / Community Pulse
            </span>
            <Compass className="h-4 w-4 text-[#737373] dark:text-[#A1A1AA]" />
          </div>

          <div className="mt-8 flex flex-1 flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h2 className="font-heading text-[20px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                Feed updates coming soon
              </h2>
              <p className="text-[14px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
                Follow other builders and creators to see their real-time progress,
                learning milestones, and work in public.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[12.5px] text-[#737373] dark:text-[#71717A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7857FF]" />
              <span>Community network active</span>
            </div>
          </div>
        </StaggerItem>
      </div>
    </StaggerContainer>
  )
}
