'use client'

import { useState, useEffect } from 'react'
import { TrailEntryItem } from './trail-entry-item'
import { getMoreTrailEntries } from '@/actions/trails'
import { Loader2 } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/animations/page-transition'
import type { ProgressStatus } from '@prisma/client'

interface Entry {
  id: string
  content: string
  statusTag: ProgressStatus
  mediaUrl: string | null
  createdAt: Date
}

interface TrailEntryListProps {
  trailId: string
  initialEntries: Entry[]
  totalEntries: number
  isOwner: boolean
}

export function TrailEntryList({ trailId, initialEntries, totalEntries, isOwner }: TrailEntryListProps) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialEntries.length < totalEntries)

  // Sync state with server revalidations (e.g. after adding a new entry)
  useEffect(() => {
    setEntries((prev) => {
      const merged = [...initialEntries]
      for (const p of prev) {
        if (!merged.some((m) => m.id === p.id)) {
          merged.push(p)
        }
      }
      return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    })
    
    // Update hasMore based on new total count and merged length
    if (initialEntries.length < totalEntries) {
      setHasMore(true)
    }
  }, [initialEntries, totalEntries])

  const handleLoadMore = async () => {
    if (isLoading || !hasMore || entries.length === 0) return

    setIsLoading(true)
    const lastEntryId = entries[entries.length - 1].id
    
    const result = await getMoreTrailEntries(trailId, lastEntryId, 20)
    
    if (result.success && result.entries) {
      setEntries((prev) => {
        const merged = [...prev]
        for (const newEntry of result.entries || []) {
          if (!merged.some((m) => m.id === newEntry.id)) {
            merged.push(newEntry)
          }
        }
        return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      })
      if (entries.length + result.entries.length >= totalEntries || result.entries.length < 20) {
        setHasMore(false)
      }
    } else {
      console.error(result.error)
    }
    
    setIsLoading(false)
  }

  // Group entries by initial vs loaded to stagger animate only the newly loaded batches
  // Actually, we can just use StaggerItem for all of them if they're in a StaggerContainer, 
  // but to avoid re-animating initial entries on load more, it's easier to just map them 
  // normally since they are already inside a StaggerItem in the parent page, or we can use 
  // StaggerContainer for the whole list here if the parent doesn't provide it.
  // Wait, in page.tsx the parent has `<StaggerItem y={18}>`. So initial items are animated.
  // Newly loaded ones wouldn't animate if we just add them to the DOM unless we use Framer Motion AnimatePresence/etc.
  // Let's use a nested StaggerContainer for each newly loaded batch.

  return (
    <div className="relative pl-6 sm:pl-10 space-y-8">
      {/* Vertical Trail Line */}
      <div
        className="absolute left-[11px] sm:left-[19px] top-4 bottom-4 w-[2px] bg-[#111111]/[0.08] dark:bg-white/10"
        aria-hidden="true"
      />

      <div className="space-y-8">
        {entries.map((entry) => (
          <div key={entry.id}>
            <TrailEntryItem entry={entry} isOwner={isOwner} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="pt-4 flex justify-center relative z-10">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-full border border-[#111111]/10 dark:border-white/10 bg-white/80 dark:bg-[#16171A]/80 px-5 py-2.5 text-[13px] font-medium text-[#111111] dark:text-[#FFFFFF] shadow-sm hover:bg-[#111111]/5 dark:hover:bg-white/5 backdrop-blur transition-all disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#7857FF]" />}
            <span>{isLoading ? 'Loading...' : 'Load older entries'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
