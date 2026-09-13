import Link from 'next/link'

function Eyebrow({ children, tone = 'light' }: { children: string; tone?: 'light' | 'dark' }) {
  return (
    <p
      className={`text-[12px] font-semibold tracking-[0.14em] ${
        tone === 'dark' ? 'text-[#C7FF3D]' : 'text-[#7857FF]'
      }`}
    >
      {children}
    </p>
  )
}

/* ---------------------------------------------------------------------- */
/* 1. Why SparkTrail Exists — visual storytelling, no cards               */
/* ---------------------------------------------------------------------- */

export function WhySection() {
  return (
    <section className="relative bg-[#F6F5EF] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Eyebrow>WHY SPARKTRAIL EXISTS</Eyebrow>
        <h2 className="mt-5 max-w-3xl font-heading text-[34px] font-semibold leading-[1.12] tracking-tight text-[#111111] sm:text-[48px] md:text-[56px]">
          Everyone shows you the result. Nobody shows you how they got there.
        </h2>

        <div className="mt-20 grid gap-12 border-t border-[#111111]/[0.08] pt-14 sm:grid-cols-2 md:gap-20">
          <div>
            <p className="font-heading text-[15px] font-semibold uppercase tracking-[0.1em] text-[#8A8A8A]">
              The result
            </p>
            <div className="mt-8 flex items-center gap-3" aria-hidden="true">
              <span className="h-3 w-3 rounded-full border-2 border-[#111111]/25" />
            </div>
            <p className="mt-8 max-w-sm text-[17px] leading-relaxed text-[#737373]">
              One post. One moment. A finished thing with no visible path to
              how it got made.
            </p>
          </div>

          <div>
            <p className="font-heading text-[15px] font-semibold uppercase tracking-[0.1em] text-[#111111]">
              The trail
            </p>
            <div className="mt-8 flex items-center gap-3" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-[#7857FF]" />
              <span className="h-px w-8 border-t border-dashed border-[#111111]/25" />
              <span className="h-3 w-3 rounded-full bg-[#111111]" />
              <span className="h-px w-8 border-t border-dashed border-[#111111]/25" />
              <span className="h-3 w-3 rounded-full bg-[#7857FF]" />
              <span className="h-px w-8 border-t border-dashed border-[#111111]/25" />
              <span className="h-3 w-3 rounded-full bg-[#C7FF3D]" />
            </div>
            <p className="mt-8 max-w-sm text-[17px] leading-relaxed text-[#111111]">
              Every attempt, every blocker, every small win logged along the
              way &mdash; the part that actually explains the result.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------- */
/* 2. How SparkTrail Works — three numbered steps                         */
/* ---------------------------------------------------------------------- */

const HOW_STEPS = [
  {
    number: '01',
    title: 'Share your trail',
    text: 'Document what you are learning and building.',
  },
  {
    number: '02',
    title: 'Build in public',
    text: 'Share progress, blockers and experiments.',
  },
  {
    number: '03',
    title: 'Grow together',
    text: 'Receive feedback from builders.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative bg-[#F6F5EF] pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Eyebrow>HOW SPARKTRAIL WORKS</Eyebrow>
        <h2 className="mt-4 max-w-xl font-heading text-[32px] font-semibold leading-tight tracking-tight text-[#111111] sm:text-[40px]">
          A simple loop, repeated one trail at a time.
        </h2>

        <div className="mt-16 grid gap-10 border-t border-[#111111]/[0.08] pt-12 sm:grid-cols-3 sm:gap-8">
          {HOW_STEPS.map((step) => (
            <div key={step.number}>
              <span className="font-heading text-[15px] font-semibold text-[#7857FF]">
                {step.number}
              </span>
              <p className="mt-5 text-[19px] font-semibold text-[#111111]">
                {step.title}
              </p>
              <p className="mt-2.5 max-w-xs text-[14.5px] leading-relaxed text-[#737373]">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------- */
/* 3. Trail Journey — the visual path, SparkTrail's core identity         */
/* ---------------------------------------------------------------------- */

const JOURNEY_STAGES: { label: string; dot: string }[] = [
  { label: 'Idea', dot: '#8A8A8A' },
  { label: 'Building', dot: '#C7FF3D' },
  { label: 'Blocked', dot: '#111111' },
  { label: 'Learning', dot: '#7857FF' },
  { label: 'Shipped', dot: '#C7FF3D' },
]

export function TrailJourneySection() {
  return (
    <section className="relative bg-[#101113] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Eyebrow tone="dark">THE TRAIL JOURNEY</Eyebrow>
        <h2 className="mt-4 max-w-xl font-heading text-[32px] font-semibold leading-tight tracking-tight text-[#F6F5EF] sm:text-[40px]">
          Every trail moves through the same stages.
        </h2>

        <ol className="mt-20 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          {JOURNEY_STAGES.map((stage, index) => (
            <li key={stage.label} className="flex items-center gap-5 sm:flex-1 sm:flex-col sm:items-center sm:gap-0 sm:text-center">
              <div className="flex items-center gap-5 sm:flex-col sm:gap-5">
                <span
                  className="h-4 w-4 shrink-0 rounded-full ring-4 ring-[#101113]"
                  style={{ backgroundColor: stage.dot }}
                  aria-hidden="true"
                />
                <p className="text-[15px] font-semibold text-[#F6F5EF] sm:mt-0">
                  {stage.label}
                </p>
              </div>

              {index < JOURNEY_STAGES.length - 1 && (
                <span
                  aria-hidden="true"
                  className="ml-[7px] h-8 w-px border-l border-dashed border-[#F6F5EF]/20 sm:ml-0 sm:mt-5 sm:h-px sm:w-full sm:border-l-0 sm:border-t"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------- */
/* 4. Community Preview — a real slice of SparkTrail activity             */
/* ---------------------------------------------------------------------- */

type FeedStatus = 'LEARNING' | 'BUILDING' | 'STUCK' | 'WIN'

const FEED_STATUS_STYLES: Record<FeedStatus, string> = {
  LEARNING: 'bg-[#7857FF] text-white',
  BUILDING: 'bg-[#C7FF3D] text-[#111111]',
  STUCK: 'bg-[#111111] text-[#F6F5EF]',
  WIN: 'bg-[#C7FF3D] text-[#111111]',
}

function FeedSparkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path
        d="M12 2L13.8 9.4 21 12l-7.2 2.6L12 22l-1.8-7.4L3 12l7.2-2.6L12 2Z"
        fill="#C7FF3D"
        stroke="#111111"
        strokeWidth="1"
      />
    </svg>
  )
}

function FeedCommentIcon() {
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

const FEED_POSTS: {
  initials: string
  name: string
  handle: string
  time: string
  status: FeedStatus
  text: string
  sparks: number
  comments: number
}[] = [
  {
    initials: 'DM',
    name: 'Diego M.',
    handle: '@diegobuilds',
    time: '12m',
    status: 'STUCK',
    text: 'Redis connection keeps timing out on cold start. Anyone hit this with serverless functions?',
    sparks: 34,
    comments: 11,
  },
  {
    initials: 'PN',
    name: 'Priya N.',
    handle: '@priyacodes',
    time: '48m',
    status: 'LEARNING',
    text: 'Three days into learning Rust. The borrow checker is finally starting to click.',
    sparks: 89,
    comments: 15,
  },
  {
    initials: 'JL',
    name: 'Jonah L.',
    handle: '@jonahships',
    time: '2h',
    status: 'WIN',
    text: 'Shipped the waitlist page after two weeks of evenings. First 40 signups already in.',
    sparks: 214,
    comments: 27,
  },
]

function FeedPost({ post }: { post: (typeof FEED_POSTS)[number] }) {
  return (
    <div className="border-b border-[#111111]/[0.07] px-7 py-6 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7857FF] to-[#5D3FD3] text-[11px] font-semibold text-white"
          >
            {post.initials}
          </span>
          <div>
            <p className="text-[13.5px] font-semibold leading-tight text-[#111111]">
              {post.name}
            </p>
            <p className="mt-0.5 text-[11.5px] leading-tight text-[#8A8A8A]">
              {post.handle} &middot; {post.time}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] ${FEED_STATUS_STYLES[post.status]}`}
        >
          {post.status}
        </span>
      </div>

      <p className="mt-4 text-[14.5px] leading-relaxed text-[#111111]">
        {post.text}
      </p>

      <div className="mt-4 flex items-center gap-4 text-[12px] font-medium text-[#737373]">
        <span className="flex items-center gap-1.5">
          <FeedSparkIcon /> {post.sparks} Sparks
        </span>
        <span className="flex items-center gap-1.5">
          <FeedCommentIcon /> {post.comments} Comments
        </span>
      </div>
    </div>
  )
}

export function CommunityPreviewSection() {
  return (
    <section className="relative bg-[#F6F5EF] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-xl">
          <Eyebrow>INSIDE THE COMMUNITY</Eyebrow>
          <h2 className="mt-4 font-heading text-[32px] font-semibold leading-tight tracking-tight text-[#111111] sm:text-[40px]">
            Real trails, posted as they happen.
          </h2>
        </div>

        <div className="mx-auto mt-14 max-w-xl overflow-hidden rounded-[28px] border border-[#111111]/[0.07] bg-white shadow-[0_30px_70px_-40px_rgba(17,17,17,0.22)]">
          {FEED_POSTS.map((post) => (
            <FeedPost key={post.handle} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------- */
/* 5. Final CTA — minimal and premium, no decorative dividers             */
/* ---------------------------------------------------------------------- */

export function FinalCtaSection() {
  return (
    <section id="start" className="relative bg-[#101113] py-24 text-center md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <h2 className="font-heading text-[32px] font-semibold leading-tight tracking-tight text-[#F6F5EF] sm:text-[44px]">
          Your trail starts with one small step.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#F6F5EF]/60">
          No polish required. Just the next thing you&apos;re working on.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#"
            className="inline-flex items-center rounded-full bg-[#C7FF3D] px-6 py-3.5 text-[14px] font-semibold text-[#111111] transition-colors hover:bg-[#C7FF3D]/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F6F5EF]"
          >
            Start your trail
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 rounded-full px-6 py-3.5 text-[14px] font-semibold text-[#F6F5EF]/80 transition-colors hover:text-[#F6F5EF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F6F5EF]"
          >
            Explore community
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
