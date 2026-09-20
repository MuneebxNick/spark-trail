import { getExploreFeed } from '@/actions/explore'
import { requireAuth } from '@/lib/auth/session'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/page-transition'
import { Compass } from 'lucide-react'
import { ExploreFeed } from '@/components/sparktrail/explore-feed'

export default async function ExplorePage() {
  const currentUser = await requireAuth()

  const { success, trails = [], error, nextCursor } = await getExploreFeed()

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
        <ExploreFeed 
          initialTrails={trails} 
          initialNextCursor={nextCursor} 
          currentUserId={currentUser.id} 
        />
      )}
    </StaggerContainer>
  )
}
