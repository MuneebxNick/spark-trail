'use client'

import { useState } from 'react'
import { getExploreFeed } from '@/actions/explore'
import { TransitionLink } from '@/components/animations/route-transition'
import { UserAvatar } from '@/components/sparktrail/user-avatar'
import { StaggerItem } from '@/components/animations/page-transition'
import { ArrowRight, Clock, Layers, Compass, Zap, MessageSquare, Loader2, ChevronDown } from 'lucide-react'
import { $Enums } from '@prisma/client'

const STATUS_STYLES: Record<$Enums.ProgressStatus, string> = {
  LEARNING: 'bg-[#7857FF] text-white',
  BUILDING: 'bg-[#C7FF3D] text-[#111111]',
  STUCK: 'bg-[#111111] text-[#F6F5EF]',
  WIN: 'bg-[#C7FF3D] text-[#111111]',
}

interface Trail {
  id: string
  title: string
  category: string | null
  status: $Enums.ProgressStatus
  isPublic: boolean
  updatedAt: Date
  user: {
    id: string
    name: string
    username: string
    avatarUrl: string | null
  }
  _count: {
    sparks: number
    comments: number
    entries: number
  }
  entries: {
    content: string
  }[]
}

interface ExploreFeedProps {
  initialTrails: Trail[]
  initialNextCursor?: string
  currentUserId: string
}

export function ExploreFeed({ initialTrails, initialNextCursor, currentUserId }: ExploreFeedProps) {
  const [trails, setTrails] = useState<Trail[]>(initialTrails)
  const [nextCursor, setNextCursor] = useState<string | undefined>(initialNextCursor)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadMore = async () => {
    if (isLoading || !nextCursor) return

    setIsLoading(true)
    const result = await getExploreFeed(nextCursor, 12)
    
    if (result.success && result.trails) {
      setTrails((prev) => {
        const merged = [...prev]
        for (const newTrail of (result.trails as Trail[]) || []) {
          if (!merged.some((m) => m.id === newTrail.id)) {
            merged.push(newTrail)
          }
        }
        return merged
      })
      setNextCursor(result.nextCursor)
    } else {
      console.error(result.error)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trails.map((trail) => {
          const entryCount = trail._count.entries
          const sparkCount = trail._count.sparks
          const commentCount = trail._count.comments
          const latestEntry = trail.entries?.[0]
          const isOwnTrail = currentUserId === trail.user.id

          return (
            <StaggerItem key={trail.id} className="relative group flex flex-col justify-between h-full rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-6 hover:border-[#7857FF]/50 transition-all duration-200 shadow-sm hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]">
              <TransitionLink href={`/trails/${trail.id}?from=explore`} className="absolute inset-0 z-0 rounded-2xl" aria-label={`View trail ${trail.title}`}>
                <span className="sr-only">View {trail.title}</span>
              </TransitionLink>
              
              <div className="space-y-4 relative z-10 pointer-events-none">
                {/* Author Top Bar */}
                <div className="flex items-center justify-between gap-2 border-b border-[#111111]/[0.06] dark:border-white/5 pb-4 pointer-events-auto">
                  <TransitionLink href={`/profile/${trail.user.username}`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group/author">
                    <UserAvatar avatarUrl={trail.user.avatarUrl} name={trail.user.name} username={trail.user.username} size="sm" className="group-hover/author:shadow-md transition-all" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[12.5px] font-semibold text-[#111111] dark:text-[#FFFFFF] leading-tight group-hover/author:text-[#7857FF] transition-colors">
                          {trail.user.name}
                        </span>
                        {isOwnTrail && (
                          <span className="rounded bg-[#7857FF]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#7857FF]">
                            You
                          </span>
                        )}
                      </div>
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
                    <Zap className="h-3.5 w-3.5" />
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

      {nextCursor && (
        <StaggerItem className="pt-4 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-full border border-[#111111]/10 dark:border-white/10 bg-white/80 dark:bg-[#16171A]/80 px-6 py-3 text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF] shadow-sm hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-[#7857FF]" /> : <ChevronDown className="h-4 w-4 text-[#737373]" />}
            <span>{isLoading ? 'Loading...' : 'Load more trails'}</span>
          </button>
        </StaggerItem>
      )}
    </div>
  )
}
