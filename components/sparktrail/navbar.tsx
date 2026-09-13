import Link from 'next/link'
import { SparkMark } from './spark-mark'

const NAV_LINKS = ['Explore', 'How It Works', 'Community']

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-[#111111]/[0.06] bg-[#F6F5EF]/85 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10"
        aria-label="Primary"
      >
        <Link
          href="#"
          className="flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
        >
          <SparkMark className="h-8 w-8" />
          <span className="font-heading text-[17px] font-semibold tracking-tight text-[#111111]">
            SparkTrail
          </span>
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <Link
                href="#"
                className="group relative inline-block py-1 text-[13.5px] font-medium text-[#111111]/65 transition-colors hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
              >
                {link}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-[#111111] transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          <Link
            href="#"
            className="hidden text-[13.5px] font-medium text-[#111111]/65 transition-colors hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] sm:inline"
          >
            Log in
          </Link>
          <Link
            href="#"
            className="inline-flex items-center rounded-full bg-[#111111] px-5 py-2.5 text-[13px] font-semibold text-[#F6F5EF] shadow-[0_4px_14px_-4px_rgba(17,17,17,0.35)] transition-all hover:bg-[#111111]/88 hover:shadow-[0_6px_18px_-4px_rgba(17,17,17,0.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
          >
            Start your trail
          </Link>
        </div>
      </nav>
    </header>
  )
}
