'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function NextSectionTeaser() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const nodesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      // Main scrubbed timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=120%', // Tighter, less runway
          pin: stickyRef.current,
          pinSpacing: true,
          scrub: 1,
        },
      })

      // 1. Reveal heading — translateY + subtle opacity (never below 0.3)
      tl.fromTo(
        headingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out', duration: 1 }
      )
      
      // 2. Reveal supporting text
      tl.fromTo(
        textRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out', duration: 1 },
        '-=0.7'
      )

      // Add a label to synchronize the trail and nodes
      tl.addLabel('trailStart', '+=0.2')

      // 3. Draw trail path
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength()
        gsap.set(pathRef.current, { 
          strokeDasharray: pathLength, 
          strokeDashoffset: pathLength 
        })
        tl.to(
          pathRef.current,
          { strokeDashoffset: 0, ease: 'none', duration: 2 },
          'trailStart'
        )
      }

      // 4. Reveal nodes exactly when the line reaches their position
      if (nodesRef.current && nodesRef.current.children.length === 3) {
        const nodes = nodesRef.current.children
        // Node 1 (Start): Appears as line begins drawing
        tl.fromTo(nodes[0],
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.5)', duration: 0.4 },
          'trailStart'
        )
        // Node 2 (Middle): Appears halfway through line drawing
        tl.fromTo(nodes[1],
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.5)', duration: 0.4 },
          'trailStart+=1'
        )
        // Node 3 (End): Appears exactly as line finishes drawing
        tl.fromTo(nodes[2],
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.5)', duration: 0.4 },
          'trailStart+=2'
        )
      }
      
      // 5. Subtle content push (happens across the whole timeline)
      tl.to(contentRef.current, {
        y: -20,
        ease: 'none',
        duration: tl.duration() || 3
      }, 0)

    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative overflow-visible"
      style={{ backgroundColor: '#101113' }}
    >
      {/* Pinned Scene Container — same dark bg on container, sticky, and all wrappers */}
      <div
        ref={stickyRef}
        className="relative h-screen w-full overflow-hidden"
        style={{ backgroundColor: '#101113' }}
      >
        {/* Foreground Scene Content */}
        <div className="relative flex h-full w-full max-w-7xl mx-auto px-6 md:px-10 flex-col justify-center">
          
          <div ref={contentRef} className="relative z-10 w-full max-w-xl">
            <h2
              ref={headingRef}
              className="font-heading text-[40px] font-semibold leading-tight tracking-tight text-[#F6F5EF] sm:text-[56px]"
              style={{ opacity: 0, transform: 'translateY(30px)' }}
            >
              Progress has a story.
            </h2>
            <p
              ref={textRef}
              className="mt-6 text-[17px] leading-relaxed text-[#F6F5EF]/60"
              style={{ opacity: 0, transform: 'translateY(16px)' }}
            >
              Most platforms show the result. SparkTrail shows the journey. Log your small wins, connect the dots, and watch your trail unfold.
            </p>
          </div>

          {/* SVG Trail Graphic — subtle editorial line */}
          <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[400px] h-[500px] hidden md:block">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 400 500" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              {/* Subtle background track */}
              <path 
                d="M50 50 C 200 50, 100 250, 250 250 C 400 250, 300 450, 150 450" 
                stroke="#F6F5EF" 
                strokeOpacity="0.04"
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />
              {/* The animated drawing path */}
              <path 
                ref={pathRef}
                d="M50 50 C 200 50, 100 250, 250 250 C 400 250, 300 450, 150 450" 
                stroke="#C7FF3D" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />
            </svg>
            
            {/* Trail Nodes — reduced glow */}
            <div ref={nodesRef} className="absolute inset-0">
              <div className="absolute top-[50px] left-[50px] -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#7857FF] border-[2.5px] border-[#101113] shadow-[0_0_8px_rgba(120,87,255,0.4)]" style={{ opacity: 0, transform: 'scale(0)' }} />
              <div className="absolute top-[250px] left-[250px] -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#C7FF3D] border-[2.5px] border-[#101113] shadow-[0_0_8px_rgba(199,255,61,0.4)]" style={{ opacity: 0, transform: 'scale(0)' }} />
              <div className="absolute top-[450px] left-[150px] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#F6F5EF] border-[2.5px] border-[#101113] shadow-[0_0_10px_rgba(246,245,239,0.5)]" style={{ opacity: 0, transform: 'scale(0)' }} />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
