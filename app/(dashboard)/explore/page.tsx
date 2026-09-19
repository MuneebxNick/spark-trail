import { getExploreFeed } from '@/actions/explore'
import { requireAuth } from '@/lib/auth/session'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/page-transition'
import { TransitionLink } from '@/components/animations/route-transition'
import {
  ArrowRight,
  Clock,
  Layers,
  Compass,
  Heart,
  MessageSquare,
} from 'lucide-react'
import { $Enums } from '@prisma/client'

const STATUS_STYLES: Record<$Enums.ProgressStatus, string> = {
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

export default async function ExplorePage() {
  await requireAuth()

  const { success, trails = [], error } = await getExploreFeed()

  return (
    <StaggerContainer className="space-y-10">
      {/* Editorial Page Header */}
      <StaggerItem className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7857FF]" />
            <p className="text-[12px] font-semibold tracking-[0.14em] text-[#7857FF] uppercase">
              Community Feed
            </p>
          </div>

          <h1 className="font-heading text-[32px] font-semibold leading-tight tracking-tight text-[#111111] dark:text-[#FFFFFF] sm:text-[42px]">
            Explore Trails
          </h1>

          <p className="max-w-xl text-[15px] leading-relaxed text-[#737373] dark:text-[#D4D4D8]">
            Discover what the community is learning and building. Follow journeys, 
            leave sparks, and get inspired by honest progress.
          </p>
        </div>
      </StaggerItem>

      <hr className="border-[#111111]/[0.08] dark:border-white/10" />

      {/* Content Area */}
      {!success || trails.length === 0 ? (
        <StaggerItem>
          <div className="rounded-2xl border border-dashed border-[#111111]/15 dark:border-white/15 bg-white/40 dark:bg-[#16171A]/40 p-12 md:p-16 text-center space-y-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7857FF]/10 text-[#7857FF]">
              <Compass className="h-7 w-7" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="font-heading text-[22px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                {error || 'No public trails found'}
              </h2>
              <p className="text-[14px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
                It looks like the community feed is currently quiet. Check back later 
                to see new public trails as they are created.
              </p>
            </div>
          </div>
        </StaggerItem>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trails.map((trail) => {
            const entryCount = trail._count.entries
            const sparkCount = trail._count.sparks
            const commentCount = trail._count.comments
            const latestEntry = trail.entries?.[0]
            
            const initials = trail.user.name
              ? trail.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
              : trail.user.username.slice(0, 2).toUpperCase()

            return (
              <StaggerItem key={trail.id} className="relative group flex flex-col justify-between h-full rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-6 hover:border-[#7857FF]/50 transition-all duration-200 shadow-sm hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]">
                <TransitionLink href={`/trails/${trail.id}`} className="absolute inset-0 z-0 rounded-2xl" aria-label={`View trail ${trail.title}`}>
                  <span className="sr-only">View {trail.title}</span>
                </TransitionLink>
                
                <div className="space-y-4 relative z-10 pointer-events-none">
                  {/* Author Top Bar */}
                  <div className="flex items-center justify-between gap-2 border-b border-[#111111]/[0.06] dark:border-white/5 pb-4 pointer-events-auto">
                    <TransitionLink href={`/profile/${trail.user.username}`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group/author">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#7857FF] to-[#5D3FD3] text-[10px] font-bold text-white uppercase group-hover/author:shadow-md transition-all">
                        {initials}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[12.5px] font-semibold text-[#111111] dark:text-[#FFFFFF] leading-tight group-hover/author:text-[#7857FF] transition-colors">
                          {trail.user.name}
                        </span>
                        <span className="text-[10.5px] text-[#737373] dark:text-[#A1A1AA] leading-tight">
                          @{trail.user.username}
                        </span>
                      </div>
                    </TransitionLink>
                    
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold tracking-[0.08em] ${STATUS_STYLES[trail.status]}`}
                    >
                      {trail.status}
                    </span>
                  </div>

                  {/* Trail Title & Description */}
                  <div className="pt-1">
                    <h2 className="font-heading text-[18px] font-semibold text-[#111111] dark:text-[#FFFFFF] group-hover:text-[#7857FF] transition-colors leading-snug line-clamp-2">
                      {trail.title}
                    </h2>
                    {trail.category && (
                      <span className="mt-2 inline-block text-[11px] font-medium text-[#7857FF]">
                        #{trail.category}
                      </span>
                    )}
                  </div>

                  {/* Latest Entry Excerpt */}
                  {latestEntry && (
                    <div className="rounded-xl border border-[#111111]/[0.06] dark:border-white/5 bg-[#FAFAFA] dark:bg-[#1A1C20] p-3 text-[12px] text-[#737373] dark:text-[#A1A1AA]">
                      <span className="line-clamp-2">{latestEntry.content}</span>
                    </div>
                  )}
                </div>

                {/* Footer Meta & Action */}
                <div className="pt-4 mt-6 border-t border-[#111111]/[0.06] dark:border-white/5 flex items-center justify-between text-[11.5px] text-[#737373] dark:text-[#A1A1AA] relative z-10 pointer-events-none">
                  <div className="flex items-center gap-3.5">
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      <span>{sparkCount}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{commentCount}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" />
                      <span>{entryCount}</span>
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-semibold text-[#7857FF] group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </StaggerItem>
            )
          })}
        </div>
      )}
    </StaggerContainer>
  )
}
