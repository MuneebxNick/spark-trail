import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/session'
import { notFound } from 'next/navigation'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/page-transition'
import { TransitionLink } from '@/components/animations/route-transition'
import { TrailEntryForm } from '@/components/sparktrail/trail-entry-form'
import { DeleteTrailButton } from '@/components/sparktrail/delete-trail-button'
import { SparkButton } from '@/components/sparktrail/spark-button'
import { CommentSection } from '@/components/sparktrail/comment-section'
import { ArrowLeft, Sparkles, Lock, Globe, Clock } from 'lucide-react'
import type { ProgressStatus } from '@prisma/client'

const STATUS_STYLES: Record<ProgressStatus, string> = {
  LEARNING: 'bg-[#7857FF] text-white',
  BUILDING: 'bg-[#C7FF3D] text-[#111111]',
  STUCK: 'bg-[#111111] text-[#F6F5EF]',
  WIN: 'bg-[#C7FF3D] text-[#111111]',
}

const STATUS_NODE_COLORS: Record<ProgressStatus, string> = {
  LEARNING: '#7857FF',
  BUILDING: '#C7FF3D',
  STUCK: '#111111',
  WIN: '#C7FF3D',
}

function StatusBadge({ status }: { status: ProgressStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10.5px] font-bold tracking-[0.08em] ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

export default async function TrailDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const from = resolvedSearchParams.from as string | undefined
  const fromUsername = resolvedSearchParams.username as string | undefined
  const currentUser = await getCurrentUser()

  const trail = await db.trail.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      entries: {
        orderBy: { createdAt: 'desc' },
      },
      sparks: {
        where: { userId: currentUser?.id ?? '' },
      },
      _count: {
        select: { sparks: true },
      },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          user: {
            select: { name: true, username: true },
          },
        },
      },
    },
  })

  if (!trail) {
    notFound()
  }

  // Check private trail access permission
  const isOwner = currentUser?.id === trail.userId
  if (!trail.isPublic && !isOwner) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center space-y-4">
        <Lock className="mx-auto h-10 w-10 text-[#7857FF]" />
        <h1 className="font-heading text-[24px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
          This Trail is Private
        </h1>
        <p className="text-[14px] text-[#737373] dark:text-[#A1A1AA]">
          Only the creator of this trail has access to view its progress updates.
        </p>
        <div className="pt-4">
          <TransitionLink
            href={from === 'explore' ? '/explore' : (from === 'profile' && fromUsername ? `/profile/${fromUsername}` : '/trails')}
            className="inline-flex items-center gap-2 rounded-full bg-[#111111] dark:bg-[#FFFFFF] px-6 py-2.5 text-[13.5px] font-semibold text-[#F6F5EF] dark:text-[#111111]"
          >
            Return
          </TransitionLink>
        </div>
      </div>
    )
  }

  const userInitials = trail.user.name
    ? trail.user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : trail.user.username.slice(0, 2).toUpperCase()

  let backHref = isOwner ? '/trails' : '/explore'
  let backLabel = isOwner ? 'Back to studio' : 'Back to explore'

  if (from === 'explore') {
    backHref = '/explore'
    backLabel = 'Back to explore'
  } else if (from === 'trails') {
    backHref = '/trails'
    backLabel = 'Back to studio'
  } else if (from === 'profile' && fromUsername) {
    backHref = `/profile/${fromUsername}`
    backLabel = 'Back to profile'
  }

  return (
    <StaggerContainer className="mx-auto max-w-4xl space-y-10">
      {/* Back Link */}
      <StaggerItem y={10}>
        <TransitionLink
          href={backHref}
          className="group inline-flex items-center gap-2 text-[13px] font-medium text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>{backLabel}</span>
        </TransitionLink>
      </StaggerItem>

      {/* Editorial Trail Header Card */}
      <StaggerItem y={14} className="relative rounded-3xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-8 md:p-10 shadow-[0_12px_40px_-20px_rgba(17,17,17,0.08)] dark:shadow-[0_12px_40px_-20px_rgba(0,0,0,0.6)] transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#111111]/[0.08] dark:border-white/10 pb-6">
          <div className="flex items-center gap-3">
            {trail.category && (
              <span className="rounded-full border border-[#7857FF]/30 bg-[#7857FF]/[0.06] dark:bg-[#7857FF]/15 px-3 py-1 text-[11.5px] font-semibold text-[#7857FF]">
                #{trail.category}
              </span>
            )}
            <StatusBadge status={trail.status} />
            <span className="flex items-center gap-1 text-[12px] font-medium text-[#737373] dark:text-[#A1A1AA]">
              {trail.isPublic ? (
                <>
                  <Globe className="h-3.5 w-3.5 text-[#10B981]" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5 text-[#7857FF]" />
                  <span>Private</span>
                </>
              )}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <SparkButton 
              trailId={trail.id} 
              initialSparked={trail.sparks.length > 0} 
              initialCount={trail._count.sparks} 
            />
            {isOwner && <DeleteTrailButton trailId={trail.id} />}
          </div>
        </div>

        {/* Trail Title & Description */}
        <div className="mt-6 space-y-3">
          <h1 className="font-heading text-[32px] font-semibold leading-tight tracking-tight text-[#111111] dark:text-[#FFFFFF] sm:text-[40px] md:text-[44px]">
            {trail.title}
          </h1>
          {trail.description && (
            <p className="max-w-2xl text-[16px] leading-relaxed text-[#737373] dark:text-[#D4D4D8]">
              {trail.description}
            </p>
          )}
        </div>

        {/* Creator Info Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#111111]/[0.08] dark:border-white/10">
          <TransitionLink href={`/profile/${trail.user.username}`} className="flex items-center gap-3 group/author hover:opacity-80 transition-opacity">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7857FF] to-[#5D3FD3] text-[12px] font-bold text-white uppercase group-hover/author:shadow-md transition-shadow">
              {userInitials}
            </span>
            <div>
              <p className="text-[13.5px] font-semibold text-[#111111] dark:text-[#FFFFFF] group-hover/author:text-[#7857FF] transition-colors">
                {trail.user.name}
              </p>
              <p className="text-[11.5px] text-[#737373] dark:text-[#A1A1AA]">
                @{trail.user.username}
              </p>
            </div>
          </TransitionLink>

          <div className="flex items-center gap-1.5 text-[12px] text-[#737373] dark:text-[#A1A1AA]">
            <Clock className="h-3.5 w-3.5" />
            <span>Started {formatDate(trail.createdAt)}</span>
          </div>
        </div>
      </StaggerItem>

      {/* Log Progress Entry Form (Owner Only) */}
      {isOwner && (
        <StaggerItem y={16}>
          <TrailEntryForm trailId={trail.id} currentStatus={trail.status} />
        </StaggerItem>
      )}

      <hr className="border-[#111111]/[0.08] dark:border-white/10" />

      {/* Progress Journey Timeline */}
      <StaggerItem y={18} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7857FF]" />
            <h2 className="font-heading text-[13px] font-semibold tracking-[0.14em] text-[#7857FF] uppercase">
              Journey Timeline ({trail.entries.length})
            </h2>
          </div>
        </div>

        {trail.entries.length === 0 ? (
          /* Editorial Empty State */
          <div className="rounded-2xl border border-dashed border-[#111111]/15 dark:border-white/15 bg-white/40 dark:bg-[#16171A]/40 p-10 md:p-14 text-center space-y-4 backdrop-blur-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#7857FF]/10 text-[#7857FF]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading text-[20px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                Your trail timeline is clear
              </h3>
              <p className="mx-auto max-w-md text-[14px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
                Every attempt, bug fix, and milestone belongs on your trail.
                {isOwner
                  ? ' Click "Log Progress Entry" above to log your first update.'
                  : ' The author has not logged any public progress entries yet.'}
              </p>
            </div>
          </div>
        ) : (
          /* Timeline Entry Cards */
          <div className="relative pl-6 sm:pl-10 space-y-8">
            {/* Vertical Trail Line */}
            <div
              className="absolute left-[11px] sm:left-[19px] top-4 bottom-4 w-[2px] bg-[#111111]/[0.08] dark:bg-white/10"
              aria-hidden="true"
            />

            {trail.entries.map((entry) => {
              const nodeColor = STATUS_NODE_COLORS[entry.statusTag]
              return (
                <div key={entry.id} className="relative flex items-start gap-4 sm:gap-6">
                  {/* Timeline Dot Node */}
                  <div
                    className="absolute -left-[23px] sm:-left-[31px] top-6 h-4 w-4 rounded-full border-2 border-white dark:border-[#0D0E10] shadow-sm z-10"
                    style={{ backgroundColor: nodeColor }}
                    aria-hidden="true"
                  />

                  {/* Entry Card */}
                  <div className="w-full rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-6 shadow-[0_4px_20px_-10px_rgba(17,17,17,0.06)] dark:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.4)] transition-colors space-y-3">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={entry.statusTag} />
                      <span className="text-[12px] font-medium text-[#737373] dark:text-[#A1A1AA]">
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>

                    <p className="text-[15px] leading-relaxed text-[#111111] dark:text-[#F6F5EF] whitespace-pre-wrap">
                      {entry.content}
                    </p>

                    {entry.mediaUrl && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-[#111111]/10 dark:border-white/10 bg-[#111111]/[0.02] dark:bg-white/[0.02]">
                        <a
                          href={entry.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative block overflow-hidden"
                          title="Click to view full image"
                        >
                          {/* eslint-disable-next-html-element-suppression */}
                          <img
                            src={entry.mediaUrl}
                            alt="Progress entry attachment"
                            loading="lazy"
                            className="max-h-96 w-full object-contain bg-black/5 dark:bg-black/40 transition-transform duration-200 group-hover:scale-[1.01]"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </StaggerItem>

      <StaggerItem y={20}>
        <CommentSection trailId={trail.id} comments={trail.comments} />
      </StaggerItem>
    </StaggerContainer>
  )
}
