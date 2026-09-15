'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { MagneticButton } from '@/components/animations/magnetic-button'

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

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

function RevealText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={`overflow-hidden pb-1 ${className || ''}`}>
      <p className="reveal-text-block translate-y-[100%]">
        {text.split(' ').map((word, i) => (
          <span key={i} className="reveal-word transition-colors duration-75 text-[#111111]/20">
            {word}{' '}
          </span>
        ))}
      </p>
    </div>
  )
}

export function WhySection() {
  const containerRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      // 0. Eyebrow Reveal
      if (eyebrowRef.current) {
        tl.to(eyebrowRef.current, { y: '0%', ease: 'none', duration: 0.5 })
      }

      // 1. Heading Masked Line Reveal
      const headingLines = headingRef.current?.querySelectorAll('.why-heading-line')
      if (headingLines) {
        tl.to(headingLines, { y: '0%', ease: 'none', stagger: 0.2, duration: 1 })
      }

      // 2. Heading Color Reveal (Apple style text fill)
      tl.to(headingRef.current, {
        backgroundPositionX: '0%',
        ease: 'none',
        duration: 3,
      }, '-=0.5')

      // 3. The Result paragraph slide up & reveal
      if (resultRef.current) {
        const textBlock = resultRef.current.querySelector('.reveal-text-block')
        const words = resultRef.current.querySelectorAll('.reveal-word')
        
        tl.to(textBlock, { y: '0%', ease: 'none', duration: 0.8 }, '-=1')
        tl.to(words, { color: '#737373', ease: 'none', stagger: 0.1, duration: 1 }, '-=0.5')
      }

      // 4. The Trail visualization & synced text reveal
      if (trailRef.current) {
        const dots = trailRef.current.querySelectorAll('.trail-dot')
        const lines = trailRef.current.querySelectorAll('.trail-line-fill')
        const textBlock = trailRef.current.querySelector('.reveal-text-block')
        const words = trailRef.current.querySelectorAll('.reveal-word')
        
        // Start trail animation
        const trailStart = 5
        const trailDuration = 3.5
        
        tl.to(textBlock, { y: '0%', ease: 'none', duration: 0.8 }, trailStart - 0.5)

        // Trail animation sequence
        tl.to(dots[0], { backgroundColor: '#7857FF', ease: 'none', duration: 0.5 }, trailStart)
        tl.to(lines[0], { scaleX: 1, ease: 'none', duration: 0.5 }, trailStart + 0.5)
        tl.to(dots[1], { backgroundColor: '#111111', ease: 'none', duration: 0.5 }, trailStart + 1.0)
        tl.to(lines[1], { scaleX: 1, ease: 'none', duration: 0.5 }, trailStart + 1.5)
        tl.to(dots[2], { backgroundColor: '#7857FF', ease: 'none', duration: 0.5 }, trailStart + 2.0)
        tl.to(lines[2], { scaleX: 1, ease: 'none', duration: 0.5 }, trailStart + 2.5)
        tl.to(dots[3], { backgroundColor: '#C7FF3D', ease: 'none', duration: 0.5 }, trailStart + 3.0)
        
        // Synced word reveal for the Trail paragraph
        tl.to(words, { color: '#111111', ease: 'none', stagger: trailDuration / words.length, duration: 0.1 }, trailStart)

        // Completion Hold — ensures final green lime dot & full text stay 100% complete before next section enters
        tl.to({}, { duration: 1.5 }, trailStart + 3.5)
      }

    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative bg-[#F6F5EF] h-[260vh]">
      <div className="sticky top-0 flex min-h-screen w-full flex-col justify-center overflow-hidden py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="overflow-hidden pb-1">
            <div ref={eyebrowRef} className="translate-y-[100%]">
              <Eyebrow>WHY SPARKTRAIL EXISTS</Eyebrow>
            </div>
          </div>
          
          <h2 
            ref={headingRef}
            className="mt-5 max-w-3xl font-heading text-[34px] font-semibold leading-[1.12] tracking-tight sm:text-[48px] md:text-[56px]"
            style={{
              backgroundImage: 'linear-gradient(to right, #111111 50%, rgba(17, 17, 17, 0.15) 50%)',
              backgroundSize: '200% 100%',
              backgroundPositionX: '100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            <span className="block overflow-hidden pb-1">
              <span className="why-heading-line block translate-y-[100%]">Everyone shows you the result.</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="why-heading-line block translate-y-[100%]">Nobody shows you how they got there.</span>
            </span>
          </h2>

          <div className="mt-20 grid gap-12 border-t border-[#111111]/[0.08] pt-14 sm:grid-cols-2 md:gap-20">
            {/* The Result */}
            <div ref={resultRef}>
              <p className="font-heading text-[15px] font-semibold uppercase tracking-[0.1em] text-[#8A8A8A]">
                The result
              </p>
              <div className="mt-8 flex items-center gap-3" aria-hidden="true">
                <span className="h-3 w-3 rounded-full border-2 border-[#111111]/25" />
              </div>
              <RevealText 
                text="One post. One moment. A finished thing with no visible path to how it got made."
                className="mt-8 max-w-sm text-[17px] leading-relaxed"
              />
            </div>

            {/* The Trail */}
            <div ref={trailRef}>
              <p className="font-heading text-[15px] font-semibold uppercase tracking-[0.1em] text-[#111111]">
                The trail
              </p>
              <div className="mt-8 flex items-center gap-3" aria-hidden="true">
                <span className="trail-dot h-3 w-3 rounded-full bg-[#111111]/10 transition-colors" />
                <div className="relative h-px w-8 bg-[#111111]/10">
                  <div className="trail-line-fill absolute inset-0 origin-left scale-x-0 bg-[#111111]/40" />
                </div>
                <span className="trail-dot h-3 w-3 rounded-full bg-[#111111]/10 transition-colors" />
                <div className="relative h-px w-8 bg-[#111111]/10">
                  <div className="trail-line-fill absolute inset-0 origin-left scale-x-0 bg-[#111111]/40" />
                </div>
                <span className="trail-dot h-3 w-3 rounded-full bg-[#111111]/10 transition-colors" />
                <div className="relative h-px w-8 bg-[#111111]/10">
                  <div className="trail-line-fill absolute inset-0 origin-left scale-x-0 bg-[#111111]/40" />
                </div>
                <span className="trail-dot h-3 w-3 rounded-full bg-[#111111]/10 transition-colors" />
              </div>
              <RevealText 
                text="Every attempt, every blocker, every small win logged along the way — the part that actually explains the result."
                className="mt-8 max-w-sm text-[17px] leading-relaxed"
              />
            </div>
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
  const containerRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      // Eyebrow Reveal
      if (eyebrowRef.current) {
        tl.to(eyebrowRef.current, { y: '0%', ease: 'none', duration: 0.5 })
      }

      // Heading Masked Line Reveal & Color Reveal
      const headingLines = headingRef.current?.querySelectorAll('.how-heading-line')
      if (headingLines) {
        tl.to(headingLines, { y: '0%', ease: 'none', stagger: 0.2, duration: 1 })
      }

      tl.to(headingRef.current, {
        backgroundPositionX: '0%',
        ease: 'none',
        duration: 1.8,
      }, 0.2)

      if (stepsRef.current) {
        const stepBlocks = stepsRef.current.querySelectorAll('.how-step')
        const lines = stepsRef.current.querySelectorAll('.step-line')
        
        const stepStart = 2.0
        
        // Step 1
        tl.to(stepBlocks[0].querySelectorAll('.step-el'), { y: '0%', ease: 'none', stagger: 0.1, duration: 0.5 }, stepStart)
        tl.to(stepBlocks[0].querySelectorAll('.step-text'), { color: '#111111', ease: 'none', duration: 0.5 }, stepStart)
        tl.to(stepBlocks[0].querySelector('.step-num'), { color: '#7857FF', ease: 'none', duration: 0.5 }, stepStart)
        
        // Line 1 fill (01 -> 02)
        tl.to(lines[0], { scaleX: 1, ease: 'none', duration: 1.2 }, stepStart + 0.5)
        
        // Step 2
        tl.to(stepBlocks[1].querySelectorAll('.step-el'), { y: '0%', ease: 'none', stagger: 0.1, duration: 0.5 }, stepStart + 1.7)
        tl.to(stepBlocks[1].querySelectorAll('.step-text'), { color: '#111111', ease: 'none', duration: 0.5 }, stepStart + 1.7)
        tl.to(stepBlocks[1].querySelector('.step-num'), { color: '#7857FF', ease: 'none', duration: 0.5 }, stepStart + 1.7)
        
        // Line 2 fill (02 -> 03)
        tl.to(lines[1], { scaleX: 1, ease: 'none', duration: 1.2 }, stepStart + 2.2)
        
        // Step 3
        tl.to(stepBlocks[2].querySelectorAll('.step-el'), { y: '0%', ease: 'none', stagger: 0.1, duration: 0.5 }, stepStart + 3.4)
        tl.to(stepBlocks[2].querySelectorAll('.step-text'), { color: '#111111', ease: 'none', duration: 0.5 }, stepStart + 3.4)
        tl.to(stepBlocks[2].querySelector('.step-num'), { color: '#7857FF', ease: 'none', duration: 0.5 }, stepStart + 3.4)
        
        // Line 3 fill (03 complete)
        tl.to(lines[2], { scaleX: 1, ease: 'none', duration: 1.2 }, stepStart + 3.9)

        // Step 03 Completion Hold — ensures Step 03 fill reaches 100% and holds before next section appears
        tl.to({}, { duration: 1.8 }, stepStart + 5.1)
      }

    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative bg-[#F6F5EF] h-[260vh]">
      <div className="sticky top-0 flex min-h-screen w-full flex-col justify-center overflow-hidden py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="overflow-hidden pb-1">
            <div ref={eyebrowRef} className="translate-y-[100%]">
              <Eyebrow>HOW SPARKTRAIL WORKS</Eyebrow>
            </div>
          </div>
          
          <h2 
            ref={headingRef}
            className="mt-4 max-w-xl font-heading text-[32px] font-semibold leading-tight tracking-tight sm:text-[40px]"
            style={{
              backgroundImage: 'linear-gradient(to right, #111111 50%, rgba(17, 17, 17, 0.15) 50%)',
              backgroundSize: '200% 100%',
              backgroundPositionX: '100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            <span className="block overflow-hidden pb-1">
              <span className="how-heading-line block translate-y-[100%]">A simple loop, repeated</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="how-heading-line block translate-y-[100%]">one trail at a time.</span>
            </span>
          </h2>

          <div ref={stepsRef} className="mt-16 grid gap-10 border-t border-[#111111]/[0.08] pt-12 sm:grid-cols-3 sm:gap-8">
            {HOW_STEPS.map((step) => (
              <div key={step.number} className="how-step flex flex-col">
                <div className="flex items-center w-full overflow-hidden pb-1">
                  <span className="step-el step-num font-heading text-[15px] font-semibold text-[#111111]/20 transition-colors translate-y-[100%]">
                    {step.number}
                  </span>
                  <div className="step-el ml-6 hidden h-px w-full max-w-[120px] bg-[#111111]/10 sm:block relative overflow-hidden translate-y-[100%]">
                    <div className="step-line absolute inset-0 origin-left scale-x-0 bg-[#7857FF]" />
                  </div>
                </div>
                <div className="overflow-hidden mt-5 pb-1">
                  <p className="step-el step-text text-[19px] font-semibold text-[#111111]/20 transition-colors translate-y-[100%]">
                    {step.title}
                  </p>
                </div>
                <div className="overflow-hidden mt-2.5 pb-1">
                  <p className="step-el step-text max-w-xs text-[14.5px] leading-relaxed text-[#111111]/20 transition-colors translate-y-[100%]">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------- */
/* 3. Trail Journey — the visual path, SparkTrail's core identity         */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* 3. Trail Journey — the visual path, SparkTrail's core identity         */
/* ---------------------------------------------------------------------- */

const JOURNEY_STAGES = [
  {
    label: 'Idea',
    description: 'The initial spark. A problem worth solving.',
    color: '#71717A',
  },
  {
    label: 'Building',
    description: 'Hands-on work. Turning concept into code.',
    color: '#fff23dff',
  },
  {
    label: 'Blocked',
    description: 'The inevitable wall. Finding the bug or limitation.',
    color: '#FF5C5C',
  },
  {
    label: 'Learning',
    description: 'The breakthrough. Insights gained through iteration.',
    color: '#7C5CFF',
  },
  {
    label: 'Shipped',
    description: 'Out in the wild. Ready for the real world.',
    color: '#C7FF3D',
  },
]

export function TrailJourneySection() {
  const containerRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      // 0. Eyebrow Reveal
      if (eyebrowRef.current) {
        tl.to(eyebrowRef.current, { y: '0%', ease: 'none', duration: 0.5 })
      }

      // 1. Heading Masked Line Reveal
      const headingLines = headingRef.current?.querySelectorAll('.journey-heading-line')
      if (headingLines) {
        tl.to(headingLines, { y: '0%', ease: 'none', stagger: 0.2, duration: 1 })
      }

      // 2. Heading Color Reveal
      tl.to(headingRef.current, {
        backgroundPositionX: '0%',
        ease: 'none',
        duration: 2.5,
      }, '-=0.5')

      // 3. Timeline progressive activation
      if (timelineRef.current) {
        const stages = timelineRef.current.querySelectorAll('.journey-stage')
        const lines = timelineRef.current.querySelectorAll('.journey-line-fill')

        let cursor = 3.0

        stages.forEach((stage, index) => {
          const dot = stage.querySelector('.journey-dot')
          const label = stage.querySelector('.journey-label')
          const desc = stage.querySelector('.journey-desc')
          const stageColor = JOURNEY_STAGES[index].color

          // GSAP controls opacity & glow progress without overriding background colors
          tl.to(
            dot,
            {
              opacity: 1,
              boxShadow: `0 0 14px ${stageColor}AA`,
              ease: 'none',
              duration: 0.4,
            },
            cursor
          )
          tl.to(label, { color: '#FFFFFF', ease: 'none', duration: 0.4 }, cursor)
          tl.to(desc, { opacity: 1, y: 0, ease: 'none', duration: 0.4 }, cursor)

          cursor += 0.4

          // Draw connecting line to next dot
          if (index < lines.length) {
            tl.to(lines[index], { scaleX: 1, ease: 'none', duration: 0.8 }, cursor)
            cursor += 0.8
          }
        })

        // Completion Hold — ensures all 5 stages & line fills stay 100% complete before next section enters
        tl.to({}, { duration: 1.5 }, cursor)
      }
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative bg-[#101113] h-[260vh]">
      <div className="sticky top-0 flex min-h-screen w-full flex-col justify-center overflow-hidden py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="overflow-hidden pb-1">
            <div ref={eyebrowRef} className="translate-y-[100%]">
              <Eyebrow tone="dark">THE TRAIL JOURNEY</Eyebrow>
            </div>
          </div>

          <h2
            ref={headingRef}
            className="mt-5 max-w-2xl font-heading text-[34px] font-semibold leading-[1.12] tracking-tight sm:text-[48px] md:text-[56px]"
            style={{
              backgroundImage: 'linear-gradient(to right, #F6F5EF 50%, rgba(246, 245, 239, 0.2) 50%)',
              backgroundSize: '200% 100%',
              backgroundPositionX: '100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            <span className="block overflow-hidden pb-1">
              <span className="journey-heading-line block translate-y-[100%]">Every trail moves</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="journey-heading-line block translate-y-[100%]">through the same stages.</span>
            </span>
          </h2>

          <div ref={timelineRef} className="mt-20 w-full border-t border-white/10 pt-16">
            <div className="grid grid-cols-5 gap-3 md:gap-6 items-start">
              {JOURNEY_STAGES.map((stage, index) => (
                <div key={stage.label} className="journey-stage flex flex-col">
                  {/* Dot & Line row */}
                  <div className="flex items-center w-full">
                    <div className="relative flex items-center justify-center shrink-0">
                      <span
                        className="journey-dot h-3.5 w-3.5 md:h-4 md:w-4 rounded-full border-2 transition-all opacity-30"
                        style={{
                          backgroundColor: stage.color,
                          borderColor: stage.color,
                        }}
                        aria-hidden="true"
                      />
                    </div>
                    {index < JOURNEY_STAGES.length - 1 && (
                      <div className="relative ml-2 mr-2 md:ml-4 md:mr-4 h-[2px] w-full flex-1 bg-white/10 overflow-hidden">
                        <div
                          className="journey-line-fill absolute inset-0 origin-left scale-x-0"
                          style={{ backgroundColor: stage.color }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Stage Label & Description */}
                  <div className="mt-6 flex flex-col pr-1 md:pr-4">
                    <p className="journey-label text-[16px] sm:text-[19px] md:text-[22px] font-heading font-semibold text-[#52525B] transition-colors">
                      {stage.label}
                    </p>
                    <p className="journey-desc mt-2.5 text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-relaxed text-white/60 opacity-0 translate-y-1 transition-colors">
                      {stage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
    <div className="px-7 py-6">
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
  const containerRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      // 1. Left Column: Eyebrow & Heading Masked Reveal (in sync with section entrance 0% - 22%)
      if (eyebrowRef.current) {
        tl.to(eyebrowRef.current, { y: '0%', ease: 'none', duration: 8 }, 0)
      }

      const headingLines = headingRef.current?.querySelectorAll('.community-heading-line')
      if (headingLines) {
        tl.to(headingLines, { y: '0%', ease: 'none', stagger: 2, duration: 14 }, 2)
      }
      tl.to(
        headingRef.current,
        {
          backgroundPositionX: '0%',
          ease: 'none',
          duration: 18,
        },
        4
      )

      // 2. Right Column: Exact Scroll Pacing Progression (0% -> 100% Timeline)
      if (cardRef.current) {
        const postCards = cardRef.current.querySelectorAll('.community-post-card')
        const postInners = cardRef.current.querySelectorAll('.community-post-inner')

        const diegoSparksEl = postCards[0]?.querySelector('.post-sparks-num')
        const diegoCommentsEl = postCards[0]?.querySelector('.post-comments-num')
        const priyaSparksEl = postCards[1]?.querySelector('.post-sparks-num')
        const priyaCommentsEl = postCards[1]?.querySelector('.post-comments-num')
        const jonahSparksEl = postCards[2]?.querySelector('.post-sparks-num')
        const jonahCommentsEl = postCards[2]?.querySelector('.post-comments-num')

        // ----------------------------------------------------
        // 1. DIEGO POST: Reveal 0% -> 25%, Settle 25% -> 32%
        // ----------------------------------------------------
        tl.to(postInners[0], { y: '0%', ease: 'none', duration: 25 }, 0)
        tl.to(postCards[0], { backgroundColor: '#F9F9F8', borderColor: 'rgba(120, 87, 255, 0.25)', ease: 'none', duration: 10 }, 15)

        const diegoCounts = { s: 34, c: 11 }
        tl.to(
          diegoCounts,
          {
            s: 35,
            c: 12,
            ease: 'none',
            duration: 10,
            onUpdate: () => {
              if (diegoSparksEl) diegoSparksEl.textContent = Math.round(diegoCounts.s).toString()
              if (diegoCommentsEl) diegoCommentsEl.textContent = Math.round(diegoCounts.c).toString()
            },
          },
          15
        )
        // Diego Settle Phase: 25% -> 32% (7% timeline hold)
        tl.to({}, { duration: 7 }, 25)

        // ----------------------------------------------------
        // 2. PRIYA POST: Reveal 32% -> 57%, Settle 57% -> 64%
        // ----------------------------------------------------
        tl.to(postCards[0], { backgroundColor: '#FFFFFF', borderColor: 'rgba(17, 17, 17, 0.07)', ease: 'none', duration: 6 }, 32)
        tl.to(postInners[1], { y: '0%', ease: 'none', duration: 25 }, 32)
        tl.to(postCards[1], { backgroundColor: '#F9F9F8', borderColor: 'rgba(120, 87, 255, 0.25)', ease: 'none', duration: 10 }, 47)

        const priyaCounts = { s: 89, c: 15 }
        tl.to(
          priyaCounts,
          {
            s: 90,
            c: 16,
            ease: 'none',
            duration: 10,
            onUpdate: () => {
              if (priyaSparksEl) priyaSparksEl.textContent = Math.round(priyaCounts.s).toString()
              if (priyaCommentsEl) priyaCommentsEl.textContent = Math.round(priyaCounts.c).toString()
            },
          },
          47
        )
        // Priya Settle Phase: 57% -> 64% (7% timeline hold)
        tl.to({}, { duration: 7 }, 57)

        // ----------------------------------------------------
        // 3. JONAH POST: Reveal 64% -> 89%, Settle 89% -> 94%
        // ----------------------------------------------------
        tl.to(postCards[1], { backgroundColor: '#FFFFFF', borderColor: 'rgba(17, 17, 17, 0.07)', ease: 'none', duration: 6 }, 64)
        tl.to(postInners[2], { y: '0%', ease: 'none', duration: 25 }, 64)
        tl.to(postCards[2], { backgroundColor: '#F9F9F8', borderColor: 'rgba(120, 87, 255, 0.25)', ease: 'none', duration: 10 }, 79)

        const jonahCounts = { s: 214, c: 27 }
        tl.to(
          jonahCounts,
          {
            s: 215,
            c: 28,
            ease: 'none',
            duration: 10,
            onUpdate: () => {
              if (jonahSparksEl) jonahSparksEl.textContent = Math.round(jonahCounts.s).toString()
              if (jonahCommentsEl) jonahCommentsEl.textContent = Math.round(jonahCounts.c).toString()
            },
          },
          79
        )
        // Jonah Settle Phase: 89% -> 94% (5% timeline hold)
        tl.to({}, { duration: 5 }, 89)

        // ----------------------------------------------------
        // 4. FINAL HOLD: 94% -> 100%
        // ----------------------------------------------------
        tl.to({}, { duration: 6 }, 94)
      }
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative bg-[#F6F5EF] h-[220vh]">
      <div className="sticky top-0 flex min-h-[100svh] w-full flex-col justify-center overflow-hidden py-12 md:py-16">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:items-center">
            {/* ---- LEFT COLUMN: Eyebrow + Heading ---- */}
            <div className="flex flex-col items-start max-w-xl">
              <div className="overflow-hidden pb-1">
                <div ref={eyebrowRef} className="translate-y-[100%]">
                  <Eyebrow>INSIDE THE COMMUNITY</Eyebrow>
                </div>
              </div>
              <h2
                ref={headingRef}
                className="mt-4 font-heading text-[32px] font-semibold leading-tight tracking-tight text-[#111111] sm:text-[42px] md:text-[48px]"
                style={{
                  backgroundImage: 'linear-gradient(to right, #111111 50%, rgba(17, 17, 17, 0.15) 50%)',
                  backgroundSize: '200% 100%',
                  backgroundPositionX: '100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                <span className="block overflow-hidden pb-1">
                  <span className="community-heading-line block translate-y-[100%]">Real trails,</span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <span className="community-heading-line block translate-y-[100%]">posted as they happen.</span>
                </span>
              </h2>
            </div>

            {/* ---- RIGHT COLUMN: Community Feed Card ---- */}
            <div className="w-full flex justify-center lg:justify-end">
              <div
                ref={cardRef}
                className="w-full max-w-lg overflow-hidden rounded-[28px] border border-[#111111]/[0.07] bg-white shadow-[0_30px_70px_-40px_rgba(17,17,17,0.22)]"
              >
                {/* Live activity indicator header */}
                <div className="flex items-center justify-between border-b border-[#111111]/[0.07] px-7 py-3.5 bg-[#FAFAFA]">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
                    </span>
                    <span className="font-heading text-[10.5px] font-bold tracking-[0.12em] uppercase text-[#737373]">
                      Live Feed Activity
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#8A8A8A]">
                    Real-time updates
                  </span>
                </div>

                <div>
                  {FEED_POSTS.map((post) => (
                    <div
                      key={post.handle}
                      className="community-post-card overflow-hidden border-b border-[#111111]/[0.07] last:border-0 transition-colors duration-300 bg-white"
                    >
                      <div className="community-post-inner translate-y-[100%]">
                        <FeedPost post={post} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------- */
/* 5. Final CTA — calm, cinematic ending with scroll-driven reveals     */
/* ---------------------------------------------------------------------- */

export function FinalCtaSection() {
  const containerRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const headingInnerRef = useRef<HTMLSpanElement>(null)
  const supportingInnerRef = useRef<HTMLParagraphElement>(null)
  const ctaButtonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      // 1. Heading Masked Bottom-to-Top Reveal (0% -> 40%)
      if (headingInnerRef.current) {
        tl.to(headingInnerRef.current, { y: '0%', ease: 'none', duration: 40 }, 0)
      }

      // 2. Heading Grey -> White Color Fill (30% -> 60%)
      if (headingRef.current) {
        tl.to(headingRef.current, { backgroundPositionX: '0%', ease: 'none', duration: 30 }, 30)
      }

      // 3. Supporting Text Masked Bottom-to-Top Reveal (50% -> 75%)
      if (supportingInnerRef.current) {
        tl.to(supportingInnerRef.current, { y: '0%', opacity: 1, ease: 'none', duration: 25 }, 50)
      }

      // 4. CTA Buttons Subtle Reveal (y: 16px -> 0, opacity: 0 -> 1) (70% -> 90%)
      if (ctaButtonsRef.current) {
        const buttons = ctaButtonsRef.current.children
        tl.to(buttons, { y: 0, opacity: 1, ease: 'none', stagger: 4, duration: 16 }, 70)
      }

      // 5. Final Calm Hold (90% -> 100%)
      tl.to({}, { duration: 10 }, 90)
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} id="start" className="relative bg-[#101113] h-[160vh] text-center">
      <div className="sticky top-0 flex min-h-[100svh] w-full flex-col items-center justify-center px-6 md:px-10 py-16">
        <div className="mx-auto w-full max-w-3xl">
          {/* Main Heading with Mask & Color Fill */}
          <div className="overflow-hidden pb-1">
            <h2
              ref={headingRef}
              className="font-heading text-[34px] font-semibold leading-tight tracking-tight sm:text-[46px] md:text-[52px]"
              style={{
                backgroundImage: 'linear-gradient(to right, #FFFFFF 50%, rgba(246, 245, 239, 0.3) 50%)',
                backgroundSize: '200% 100%',
                backgroundPositionX: '100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              <span ref={headingInnerRef} className="block translate-y-[100%]">
                Your trail starts with one small step.
              </span>
            </h2>
          </div>

          {/* Supporting Text */}
          <div className="mt-5 overflow-hidden py-1">
            <p
              ref={supportingInnerRef}
              className="mx-auto max-w-md translate-y-[100%] opacity-0 text-[16px] leading-relaxed text-[#F6F5EF]/60 sm:text-[18px]"
            >
              No polish required. Just the next thing you&apos;re working on.
            </p>
          </div>

          {/* CTA Buttons */}
          <div ref={ctaButtonsRef} className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              href="#"
              data-magnetic
              className="translate-y-4 opacity-0 inline-flex items-center rounded-full bg-[#C7FF3D] px-6 py-3.5 text-[14px] font-semibold text-[#111111] transition-colors hover:bg-[#C7FF3D]/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F6F5EF]"
            >
              Start your trail
            </MagneticButton>
            <Link
              href="#"
              className="group translate-y-4 opacity-0 inline-flex items-center gap-1.5 rounded-full px-6 py-3.5 text-[14px] font-semibold text-[#F6F5EF]/80 transition-colors hover:text-[#F6F5EF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F6F5EF]"
            >
              Explore community
              <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
