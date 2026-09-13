import Link from 'next/link'
import { HeroVisual } from './hero-visual'
import { ScrollIndicator } from './scroll-indicator'

export function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-10 pt-8 md:px-10 md:pb-14 md:pt-12">
      <div className="grid min-w-0 items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        <div className="min-w-0 max-w-xl">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-[#7857FF]">
            PROGRESS, WITHOUT THE PRESSURE
          </p>

          <h1 className="mt-5 font-heading text-[42px] font-semibold leading-[1.05] tracking-tight text-[#111111] sm:text-[56px] md:text-[68px] lg:text-[76px] lg:leading-[1.02]">
            Small steps.
            <br />
            Real progress.
          </h1>

          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#737373]">
            Share what you&apos;re learning, building, fixing and winning
            &mdash; without the noise of traditional social media.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="#"
              className="inline-flex items-center rounded-full bg-[#111111] px-6 py-3.5 text-[14px] font-semibold text-[#F6F5EF] transition-colors hover:bg-[#111111]/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
            >
              Start your trail
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-1.5 rounded-full px-6 py-3.5 text-[14px] font-semibold text-[#111111] transition-colors hover:text-[#111111]/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
            >
              Explore community
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        <HeroVisual />
      </div>

      <div className="mt-10 flex justify-center md:mt-12">
        <ScrollIndicator />
      </div>
    </section>
  )
}
