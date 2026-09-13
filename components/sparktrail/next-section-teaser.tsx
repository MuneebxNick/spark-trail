export function NextSectionTeaser() {
  return (
    <section className="relative bg-[#F6F5EF]">
      <div className="relative overflow-hidden bg-[#101113]">
        {/* Curved seam: the off-white above dips into the dark section as one deliberate stroke, not a flat gradient overlay */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 h-14 w-full text-[#F6F5EF] md:h-20"
        >
          <path
            d="M0 0 L0 22 C 360 92 1080 92 1440 22 L1440 0 Z"
            fill="currentColor"
          />
        </svg>

        {/* Cinematic ambient light, anchored behind the heading */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[#7857FF]/[0.16] blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#C7FF3D]/[0.07] blur-[110px]"
        />

        <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-16 md:px-10 md:pb-36 md:pt-24">
          <h2 className="font-heading text-[32px] font-semibold leading-tight tracking-tight text-[#F6F5EF] sm:text-[40px]">
            Progress has a story.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#F6F5EF]/60">
            Most platforms show the result. SparkTrail shows the journey.
          </p>
        </div>
      </div>
    </section>
  )
}
