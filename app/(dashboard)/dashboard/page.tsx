import { requireAuth } from '@/lib/auth/session'
import { db } from '@/lib/db'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/page-transition'
import { TransitionLink } from '@/components/animations/route-transition'
import {
  Plus,
  Compass,
  Activity,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Users,
  Globe,
} from 'lucide-react'
import { $Enums } from '@prisma/client'

const STATUS_STYLES: Record<$Enums.ProgressStatus, string> = {
  LEARNING: 'bg-[#7857FF] text-white',
  BUILDING: 'bg-[#C7FF3D] text-[#111111]',
  STUCK: 'bg-[#111111] text-[#F6F5EF]',
  WIN: 'bg-[#C7FF3D] text-[#111111]',
}

export default async function DashboardPage() {
  const user = await requireAuth()

  // Fetch real user trails from PostgreSQL DB
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

  // Fetch community pulse metrics concurrently
  const [totalSparksReceived, totalCommentsReceived, followersCount, publicTrailsCount] =
    await Promise.all([
      db.spark.count({
        where: { trail: { userId: user.id } },
      }),
      db.comment.count({
        where: { trail: { userId: user.id } },
      }),
      db.follows.count({
        where: { followingId: user.id },
      }),
      db.trail.count({
        where: { userId: user.id, isPublic: true },
      }),
    ])

  const activeTrailsCount = userTrails.length
  const totalEntriesCount = userTrails.reduce(
    (acc, t) => acc + t._count.entries,
    0
  )

  const hasCommunityPulse =
    totalSparksReceived > 0 ||
    totalCommentsReceived > 0 ||
    followersCount > 0 ||
    publicTrailsCount > 0

  return (
    <StaggerContainer className="space-y-8 md:space-y-9">
      {/* Personalized Welcome Header */}
      <StaggerItem className="flex flex-col items-start space-y-3 md:space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#7857FF]" />
          <p className="text-[12px] font-semibold tracking-[0.14em] text-[#7857FF] uppercase">
            Personal Studio
          </p>
        </div>

        <h1 className="font-heading text-[28px] font-semibold leading-tight tracking-tight text-[#111111] dark:text-[#FFFFFF] sm:text-[34px] md:text-[38px]">
          Welcome back, {user.name}.
        </h1>

        <p className="max-w-xl text-[15px] leading-relaxed text-[#737373] dark:text-[#D4D4D8]">
          Progress has a story. Document what you are learning, building, fixing,
          and winning step by step, without the noise.
        </p>

        <div className="pt-1">
          <TransitionLink
            href="/trails/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#111111] dark:bg-[#FFFFFF] px-5 py-2.5 sm:px-6 sm:py-3 text-[13.5px] font-semibold text-[#F6F5EF] dark:text-[#111111] hover:bg-[#111111]/85 dark:hover:bg-[#FFFFFF]/90 transition-all shadow-[0_4px_14px_-4px_rgba(17,17,17,0.35)] dark:shadow-[0_4px_14px_-4px_rgba(255,255,255,0.2)]"
          >
            <Plus className="h-4 w-4 text-[#C7FF3D] dark:text-[#7857FF]" />
            <span>Create your next trail</span>
          </TransitionLink>
        </div>
      </StaggerItem>

      <hr className="border-[#111111]/[0.08] dark:border-white/10" />

      {/* Editorial Overview Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Section 01: My Trails */}
        <StaggerItem className="flex flex-col rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-7 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[12px] font-semibold tracking-[0.12em] text-[#737373] dark:text-[#A1A1AA] uppercase">
              01 / My Trails ({activeTrailsCount})
            </span>
            <Sparkles className="h-4 w-4 text-[#7857FF]" />
          </div>

          <div className="mt-6 flex flex-1 flex-col justify-between space-y-6">
            {activeTrailsCount === 0 ? (
              <div className="space-y-3">
                <h2 className="font-heading text-[20px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                  No active trails yet
                </h2>
                <p className="text-[14px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
                  Trails organize your progress around specific projects, skills, or
                  milestones. Start your first trail to log updates.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userTrails.slice(0, 3).map((trail) => (
                  <TransitionLink
                    key={trail.id}
                    href={`/trails/${trail.id}`}
                    className="group flex flex-col p-3 rounded-xl border border-[#111111]/[0.06] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#1A1C20] hover:border-[#7857FF]/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-[14px] font-semibold text-[#111111] dark:text-[#FFFFFF] group-hover:text-[#7857FF] transition-colors truncate max-w-[180px]">
                        {trail.title}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9.5px] font-bold tracking-[0.08em] ${STATUS_STYLES[trail.status]}`}
                      >
                        {trail.status}
                      </span>
                    </div>
                    {trail.category && (
                      <span className="mt-1 text-[11px] text-[#7857FF]">
                        #{trail.category}
                      </span>
                    )}
                  </TransitionLink>
                ))}
              </div>
            )}

            {activeTrailsCount === 0 ? (
              <div className="pt-2">
                <TransitionLink
                  href="/trails/new"
                  className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#7857FF] hover:underline"
                >
                  <span>Start a new trail</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </TransitionLink>
              </div>
            ) : (
              <div className="pt-2 flex items-center justify-between">
                <TransitionLink
                  href="/trails"
                  className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#7857FF] hover:underline"
                >
                  <span>View all trails</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </TransitionLink>
                <TransitionLink
                  href="/trails/new"
                  className="text-[12.5px] font-medium text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-colors"
                >
                  + New trail
                </TransitionLink>
              </div>
            )}
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

          <div className="mt-6 flex flex-1 flex-col justify-between space-y-6">
            {totalEntriesCount === 0 ? (
              <div className="space-y-3">
                <h2 className="font-heading text-[20px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                  Activity log is quiet
                </h2>
                <p className="text-[14px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
                  Your progress entries, blockers, and milestone wins will populate here in
                  chronological order as you build.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userTrails
                  .filter((t) => t.entries.length > 0)
                  .slice(0, 3)
                  .map((t) => {
                    const entry = t.entries[0]
                    return (
                      <TransitionLink
                        key={entry.id}
                        href={`/trails/${t.id}`}
                        className="group block p-3 rounded-xl border border-[#111111]/[0.06] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#1A1C20] hover:border-[#7857FF]/40 transition-all"
                      >
                        <p className="text-[12.5px] font-semibold text-[#111111] dark:text-[#FFFFFF] truncate">
                          {t.title}
                        </p>
                        <p className="mt-1 text-[12px] text-[#737373] dark:text-[#A1A1AA] line-clamp-2">
                          {entry.content}
                        </p>
                      </TransitionLink>
                    )
                  })}
              </div>
            )}

            <div className="flex items-center gap-2 text-[12.5px] text-[#737373] dark:text-[#71717A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              <span>
                {activeTrailsCount > 0
                  ? `${activeTrailsCount} active trail${activeTrailsCount > 1 ? 's' : ''} in studio`
                  : 'Ready for your first update'}
              </span>
            </div>
          </div>
        </StaggerItem>

        {/* Section 03: Community Pulse */}
        <StaggerItem className="flex flex-col rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-7 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[12px] font-semibold tracking-[0.12em] text-[#737373] dark:text-[#A1A1AA] uppercase">
              03 / Community Pulse
            </span>
            <Users className="h-4 w-4 text-[#7857FF]" />
          </div>

          <div className="mt-6 flex flex-1 flex-col justify-between space-y-6">
            {!hasCommunityPulse ? (
              <div className="space-y-3">
                <h2 className="font-heading text-[20px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                  Pulse is quiet
                </h2>
                <p className="text-[14px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
                  Publish your trails publicly to start receiving sparks, feedback, and followers from fellow builders.
                </p>
                <div className="pt-2">
                  <TransitionLink
                    href="/explore"
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#7857FF] hover:underline"
                  >
                    <span>Explore community trails</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </TransitionLink>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {/* Total Sparks */}
                <div className="p-3.5 rounded-xl border border-[#111111]/[0.06] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#1A1C20] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-[0.08em] text-[#737373] dark:text-[#A1A1AA] uppercase">
                      Sparks
                    </span>
                    <Sparkles className="h-3.5 w-3.5 text-[#5D7A1D] dark:text-[#C7FF3D]" />
                  </div>
                  <p className="font-heading text-[24px] font-bold tracking-tight text-[#111111] dark:text-[#FFFFFF] tabular-nums">
                    {totalSparksReceived}
                  </p>
                  <p className="text-[11px] text-[#737373] dark:text-[#A1A1AA] truncate">
                    {totalSparksReceived === 0 ? 'None yet' : totalSparksReceived === 1 ? 'Spark received' : 'Sparks received'}
                  </p>
                </div>

                {/* Total Comments */}
                <div className="p-3.5 rounded-xl border border-[#111111]/[0.06] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#1A1C20] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-[0.08em] text-[#737373] dark:text-[#A1A1AA] uppercase">
                      Comments
                    </span>
                    <MessageSquare className="h-3.5 w-3.5 text-[#7857FF]" />
                  </div>
                  <p className="font-heading text-[24px] font-bold tracking-tight text-[#111111] dark:text-[#FFFFFF] tabular-nums">
                    {totalCommentsReceived}
                  </p>
                  <p className="text-[11px] text-[#737373] dark:text-[#A1A1AA] truncate">
                    {totalCommentsReceived === 0 ? 'None yet' : totalCommentsReceived === 1 ? 'Comment' : 'Comments'}
                  </p>
                </div>

                {/* Followers */}
                <div className="p-3.5 rounded-xl border border-[#111111]/[0.06] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#1A1C20] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-[0.08em] text-[#737373] dark:text-[#A1A1AA] uppercase">
                      Followers
                    </span>
                    <Users className="h-3.5 w-3.5 text-[#737373] dark:text-[#A1A1AA]" />
                  </div>
                  <p className="font-heading text-[24px] font-bold tracking-tight text-[#111111] dark:text-[#FFFFFF] tabular-nums">
                    {followersCount}
                  </p>
                  <p className="text-[11px] text-[#737373] dark:text-[#A1A1AA] truncate">
                    {followersCount === 0 ? 'None yet' : followersCount === 1 ? 'Follower' : 'Followers'}
                  </p>
                </div>

                {/* Public Trails */}
                <div className="p-3.5 rounded-xl border border-[#111111]/[0.06] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#1A1C20] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-[0.08em] text-[#737373] dark:text-[#A1A1AA] uppercase">
                      Public
                    </span>
                    <Globe className="h-3.5 w-3.5 text-[#737373] dark:text-[#A1A1AA]" />
                  </div>
                  <p className="font-heading text-[24px] font-bold tracking-tight text-[#111111] dark:text-[#FFFFFF] tabular-nums">
                    {publicTrailsCount}
                  </p>
                  <p className="text-[11px] text-[#737373] dark:text-[#A1A1AA] truncate">
                    {publicTrailsCount === 1 ? 'Public trail' : 'Public trails'}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-[12.5px] text-[#737373] dark:text-[#71717A]">
              <span className={`h-1.5 w-1.5 rounded-full ${hasCommunityPulse ? 'bg-[#7857FF]' : 'bg-[#737373]'}`} />
              <span>{hasCommunityPulse ? 'Community network active' : 'Ready to share with builders'}</span>
            </div>
          </div>
        </StaggerItem>
      </div>
    </StaggerContainer>
  )
}
