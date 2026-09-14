import type { ReactNode } from 'react'

export type ProgressStatus = 'LEARNING' | 'BUILDING' | 'STUCK' | 'WIN'

const STATUS_STYLES: Record<ProgressStatus, string> = {
  LEARNING: 'bg-[#7857FF] text-white',
  BUILDING: 'bg-[#C7FF3D] text-[#111111]',
  STUCK: 'bg-[#111111] text-[#F6F5EF]',
  WIN: 'bg-[#C7FF3D] text-[#111111]',
}

function StatusBadge({ status }: { status: ProgressStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}

/** Minimal card used for floating status snippets in the hero composition. */
export function MiniProgressCard({
  status,
  text,
  className,
}: {
  status: ProgressStatus
  text: string
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-[#111111]/[0.06] bg-white p-[18px] shadow-[0_12px_32px_-10px_rgba(17,17,17,0.12)] ${className ?? ''}`}
    >
      <StatusBadge status={status} />
      <p className="mt-2.5 text-[13px] font-medium leading-snug text-[#111111]">
        {text}
      </p>
    </div>
  )
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#7857FF] to-[#5D3FD3] text-[12px] font-semibold text-white shadow-sm"
    >
      {initials}
    </span>
  )
}

/** The primary, detailed progress card featured in the hero composition. */
export function FeaturedProgressCard({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={`w-[340px] rounded-[24px] border border-[#111111]/[0.06] bg-white p-6 shadow-[0_32px_64px_-20px_rgba(17,17,17,0.18)] ${className ?? ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar initials="SK" />
          <div>
            <p className="text-[14.5px] font-semibold leading-tight text-[#111111]">
              Sarah Khan
            </p>
            <p className="mt-0.5 text-[12px] leading-tight text-[#8A8A8A]">
              @sarahcodes &middot; 2h
            </p>
          </div>
        </div>
        <StatusBadge status="BUILDING" />
      </div>

      <p className="mt-5 text-[16.5px] font-semibold leading-snug text-[#111111]">
        Authentication finally works.
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[#737373]">
        Connected my Express API to PostgreSQL and shipped the first working
        login flow.
      </p>

      <div className="mt-4 flex gap-2">
        {['#nextjs', '#nodejs'].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#111111]/[0.06] bg-[#F6F5EF] px-2.5 py-1 text-[11px] font-medium text-[#737373]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#111111]/[0.06] pt-4">
        <div className="flex items-center gap-4 text-[12px] font-medium text-[#737373]">
          <span className="flex items-center gap-1.5 transition-colors hover:text-[#111111]">
            <SparkIcon /> 126 Sparks
          </span>
          <span className="flex items-center gap-1.5 transition-colors hover:text-[#111111]">
            <CommentIcon /> 18 Comments
          </span>
        </div>
        <BookmarkIcon />
      </div>

      {children}
    </div>
  )
}

function SparkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-3.5 w-3.5"
    >
      <path
        d="M12 2L13.8 9.4 21 12l-7.2 2.6L12 22l-1.8-7.4L3 12l7.2-2.6L12 2Z"
        fill="#C7FF3D"
        stroke="#111111"
        strokeWidth="1"
      />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-3.5 w-3.5"
    >
      <path d="M21 12c0 4.4-4 8-9 8-1.1 0-2.2-.16-3.2-.46L3 21l1.6-4.2C3.6 15.4 3 13.76 3 12c0-4.4 4-8 9-8s9 3.6 9 8Z" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#111111"
      strokeWidth="1.6"
      className="h-4 w-4"
    >
      <path d="M6 3h12v18l-6-4-6 4V3Z" />
    </svg>
  )
}
