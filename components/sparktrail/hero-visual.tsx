import { FeaturedProgressCard, MiniProgressCard } from './progress-card'

const AVATAR_COLORS = ['#7857FF', '#111111', '#C7FF3D']

/** Dashed trail connecting the learning -> building -> win cards, making the composition read as one path rather than scattered cards. */
function TrailPath() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 500 560"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
    >
      <path
        d="M96 108 C 190 150, 210 250, 258 288 S 372 372, 404 428"
        fill="none"
        stroke="#111111"
        strokeOpacity="0.14"
        strokeWidth="1.5"
        strokeDasharray="1.5 9"
        strokeLinecap="round"
      />
      <circle cx="96" cy="108" r="4.5" fill="#7857FF" />
      <circle cx="258" cy="288" r="4.5" fill="#C7FF3D" stroke="#111111" strokeOpacity="0.2" />
      <circle cx="404" cy="428" r="4.5" fill="#111111" />
    </svg>
  )
}

/** Single, integrated social-proof chip: avatars, live pulse, and count in one elegant unit. */
function SocialProofChip({ className }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border border-[#111111]/[0.07] bg-white/95 px-4 py-2.5 shadow-[0_18px_36px_-18px_rgba(17,17,17,0.22)] backdrop-blur-sm ${className ?? ''}`}
    >
      <div className="flex items-center -space-x-2.5" aria-hidden="true">
        {AVATAR_COLORS.map((color) => (
          <span
            key={color}
            className="h-6 w-6 rounded-full border-2 border-white"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#737373]">
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7857FF]/50" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#7857FF]" />
        </span>
        340+ trails logged today
      </span>
    </div>
  )
}

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-full sm:max-w-[420px] lg:max-w-none">
      {/* Ambient glow, kept subtle and contained to the visual only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 h-64 w-64 rounded-full bg-[#C7FF3D]/25 blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#7857FF]/20 blur-[80px]"
      />

      {/* Desktop / tablet art-directed composition: a deliberate trail from Learning to Building to Win */}
      <div className="relative hidden h-[560px] md:block">
        <TrailPath />

        <MiniProgressCard
          status="LEARNING"
          text="Understanding server components"
          className="absolute left-0 top-6 w-52 -rotate-2"
        />

        <FeaturedProgressCard className="absolute left-1/2 top-1/2 w-[336px] -translate-x-1/2 -translate-y-1/2 -rotate-1" />

        <MiniProgressCard
          status="WIN"
          text="Shipped v1.0 to production"
          className="absolute bottom-14 right-0 w-52 rotate-2"
        />

        <SocialProofChip className="absolute bottom-0 left-2" />
      </div>

      {/* Mobile composition: stacked, no overlap, same trail narrative */}
      <div className="flex min-w-0 flex-col items-center gap-5 md:hidden">
        <FeaturedProgressCard className="w-full max-w-[336px]" />
        <div className="flex w-full max-w-[336px] gap-3">
          <MiniProgressCard
            status="LEARNING"
            text="Understanding server components"
            className="w-1/2 min-w-0"
          />
          <MiniProgressCard
            status="WIN"
            text="Shipped v1.0"
            className="w-1/2 min-w-0"
          />
        </div>
        <SocialProofChip />
      </div>
    </div>
  )
}
