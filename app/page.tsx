import { Hero } from '@/components/sparktrail/hero'
import { Navbar } from '@/components/sparktrail/navbar'
import { NextSectionTeaser } from '@/components/sparktrail/next-section-teaser'

export default function Page() {
  return (
    <main className="bg-[#F6F5EF]">
      <Navbar />
      <Hero />
      <NextSectionTeaser />
    </main>
  )
}
