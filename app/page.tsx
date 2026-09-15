import { Hero } from '@/components/sparktrail/hero'
import {
  CommunityPreviewSection,
  FinalCtaSection,
  HowItWorksSection,
  TrailJourneySection,
  WhySection,
} from '@/components/sparktrail/landing-sections'
import { Navbar } from '@/components/sparktrail/navbar'
import { NextSectionTeaser } from '@/components/sparktrail/next-section-teaser'

import { BackToTop } from '@/components/sparktrail/back-to-top'

export default function Page() {
  return (
    <main className="bg-[#F6F5EF]">
      <Navbar />
      <Hero />
      <NextSectionTeaser />
      <WhySection />
      <HowItWorksSection />
      <TrailJourneySection />
      <CommunityPreviewSection />
      <FinalCtaSection />
      <BackToTop />
    </main>
  )
}
