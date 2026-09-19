import { requireAuth } from '@/lib/auth/session'
import { db } from '@/lib/db'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/page-transition'
import { TransitionLink } from '@/components/animations/route-transition'
import {
  Plus,
  ArrowRight,
  Clock,
  Layers,
  Globe,
  Lock,
  Compass,
} from 'lucide-react'
import type { ProgressStatus } from '@prisma/client'

const STATUS_STYLES: Record<ProgressStatus, string> = {
  LEARNING: 'bg-[#7857FF] text-white',
  BUILDING: 'bg-[#C7FF3D] text-[#111111]',
  STUCK: 'bg-[#111111] text-[#F6F5EF]',
  WIN: 'bg-[#C7FF3D] text-[#111111]',
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export default async function MyTrailsPage() {
  const user = await requireAuth()

  // Fetch only authenticated user's real trails from PostgreSQL
  const userTrails = await db.trail.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      entries: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { entries: true },
      },
    },
  })

  const trailCount = userTrails.length

  return (
    <StaggerContainer className="space-y-10">
      {/* Editorial Page Header */}
      <StaggerItem className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7857FF]" />
            <p className="text-[12px] font-semibold tracking-[0.14em] text-[#7857FF] uppercase">
              Library
            </p>
          </div>

          <h1 className="font-heading text-[32px] font-semibold leading-tight tracking-tight text-[#111111] dark:text-[#FFFFFF] sm:text-[42px]">
            My Trails
          </h1>

          <p className="max-w-xl text-[15px] leading-relaxed text-[#737373] dark:text-[#D4D4D8]">
            Your ongoing journeys, milestones, and progress archives. Every trail
            is an honest story of learning, building, and winning.
          </p>
        </div>

        <div className="shrink-0">
          <TransitionLink
            href="/trails/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#111111] dark:bg-[#FFFFFF] px-5 py-3 text-[13.5px] font-semibold text-[#F6F5EF] dark:text-[#111111] hover:bg-[#111111]/85 dark:hover:bg-[#FFFFFF]/90 transition-all shadow-[0_4px_14px_-4px_rgba(17,17,17,0.35)] dark:shadow-[0_4px_14px_-4px_rgba(255,255,255,0.2)]"
          >
            <Plus className="h-4 w-4 text-[#C7FF3D] dark:text-[#7857FF]" />
            <span>Create Trail</span>
          </TransitionLink>
        </div>
      </StaggerItem>

      <hr className="border-[#111111]/[0.08] dark:border-white/10" />

      {/* Content Area */}
      {trailCount === 0 ? (
        <StaggerItem>
          <div className="rounded-2xl border border-dashed border-[#111111]/15 dark:border-white/15 bg-white/40 dark:bg-[#16171A]/40 p-12 md:p-16 text-center space-y-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7857FF]/10 text-[#7857FF]">
              <Compass className="h-7 w-7" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="font-heading text-[22px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                No trails started yet
              </h2>
              <p className="text-[14px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
                Trails organize your progress around specific projects, skills, or
                milestones. Create your first trail to begin documenting your story.
              </p>
            </div>

            <div className="pt-2">
              <TransitionLink
                href="/trails/new"
                className="inline-flex items-center gap-2 rounded-full bg-[#111111] dark:bg-[#FFFFFF] px-6 py-3 text-[13.5px] font-semibold text-[#F6F5EF] dark:text-[#111111] hover:bg-[#111111]/85 dark:hover:bg-[#FFFFFF]/90 transition-all"
              >
                <Plus className="h-4 w-4 text-[#C7FF3D] dark:text-[#7857FF]" />
                <span>Start your first trail</span>
              </TransitionLink>
            </div>
          </div>
        </StaggerItem>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {userTrails.map((trail) => {
            const entryCount = trail._count.entries
            const latestEntry = trail.entries[0]

            return (
              <StaggerItem key={trail.id}>
                <TransitionLink
                  href={`/trails/${trail.id}?from=trails`}
                  className="group flex flex-col justify-between h-full rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-6 sm:p-7 hover:border-[#7857FF]/50 transition-all duration-200 shadow-sm hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]"
                >
                  <div className="space-y-4">
                    {/* Status & Metadata Top Bar */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.08em] ${STATUS_STYLES[trail.status]}`}
                        >
                          {trail.status}
                        </span>

                        {trail.category && (
                          <span className="text-[11.5px] font-medium text-[#7857FF]">
                            #{trail.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#737373] dark:text-[#A1A1AA]">
                        {trail.isPublic ? (
                          <span className="inline-flex items-center gap-1" title="Public Trail">
                            <Globe className="h-3 w-3" />
                            <span>Public</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#7857FF]" title="Private Trail">
                            <Lock className="h-3 w-3" />
                            <span>Private</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Trail Title & Description */}
                    <div>
                      <h2 className="font-heading text-[20px] font-semibold text-[#111111] dark:text-[#FFFFFF] group-hover:text-[#7857FF] transition-colors leading-snug">
                        {trail.title}
                      </h2>

                      {trail.description && (
                        <p className="mt-2 text-[13.5px] leading-relaxed text-[#737373] dark:text-[#A1A1AA] line-clamp-2">
                          {trail.description}
                        </p>
                      )}
                    </div>

                    {/* Latest Entry Excerpt */}
                    {latestEntry && (
                      <div className="rounded-xl border border-[#111111]/[0.06] dark:border-white/5 bg-[#FAFAFA] dark:bg-[#1A1C20] p-3 text-[12px] text-[#737373] dark:text-[#A1A1AA]">
                        <span className="font-semibold text-[#111111] dark:text-[#FFFFFF] mr-1.5">
                          Latest:
                        </span>
                        <span className="line-clamp-2">{latestEntry.content}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Meta & Action */}
                  <div className="pt-4 mt-6 border-t border-[#111111]/[0.06] dark:border-white/5 flex items-center justify-between text-[12px] text-[#737373] dark:text-[#A1A1AA]">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-[#7857FF]" />
                        <span>
                          {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
                        </span>
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDate(trail.updatedAt)}</span>
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 font-semibold text-[#7857FF] group-hover:translate-x-0.5 transition-transform">
                      <span>View</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </TransitionLink>
              </StaggerItem>
            )
          })}
        </div>
      )}
    </StaggerContainer>
  )
}
