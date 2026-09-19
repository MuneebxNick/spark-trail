import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AppHeader } from '@/components/sparktrail/app-header'
import { ThemeProvider } from '@/lib/theme-provider'
import React from 'react'

let currentPathname = '/dashboard'

vi.mock('next/navigation', () => ({
  usePathname: () => currentPathname,
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

vi.mock('@/components/animations/route-transition', () => ({
  useRouteTransition: () => ({
    transitionTo: vi.fn(),
    isTransitioning: false,
  }),
  TransitionLink: ({ href, children, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

vi.mock('@/actions/auth', () => ({
  logoutUser: vi.fn(),
}))

const mockUser = {
  id: 'user_1',
  email: 'test@example.com',
  username: 'testuser',
  name: 'Test User',
}

describe('AppHeader Navigation', () => {
  it('renders My Trails linking to /trails without a Soon badge', () => {
    currentPathname = '/dashboard'
    render(
      <ThemeProvider>
        <AppHeader user={mockUser} />
      </ThemeProvider>
    )

    // Find links with text "My Trails"
    const myTrailsLinks = screen.getAllByRole('link', { name: /my trails/i })
    expect(myTrailsLinks.length).toBeGreaterThan(0)
    expect(myTrailsLinks[0]).toHaveAttribute('href', '/trails')

    // Confirm My Trails does NOT have a Soon badge attached to it
    expect(myTrailsLinks[0].textContent).not.toContain('Soon')

    // Confirm Explore still has Soon badge
    const exploreLinks = screen.getAllByRole('link', { name: /explore/i })
    expect(exploreLinks[0].textContent).toContain('Soon')
  })

  it('activates My Trails when pathname is /trails', () => {
    currentPathname = '/trails'
    const { container } = render(
      <ThemeProvider>
        <AppHeader user={mockUser} />
      </ThemeProvider>
    )

    const myTrailsLink = container.querySelector('a[href="/trails"]')
    expect(myTrailsLink).toBeInTheDocument()
    expect(myTrailsLink?.className).toContain('font-semibold')
    expect(myTrailsLink?.querySelector('span.bg-\\[\\#7857FF\\]')).toBeInTheDocument()
  })

  it('activates My Trails when pathname is /trails/[id]', () => {
    currentPathname = '/trails/trail_abc123'
    const { container } = render(
      <ThemeProvider>
        <AppHeader user={mockUser} />
      </ThemeProvider>
    )

    const myTrailsLink = container.querySelector('a[href="/trails"]')
    expect(myTrailsLink).toBeInTheDocument()
    expect(myTrailsLink?.className).toContain('font-semibold')
    expect(myTrailsLink?.querySelector('span.bg-\\[\\#7857FF\\]')).toBeInTheDocument()
  })

  it('does NOT activate My Trails active indicator when pathname is /trails/new', () => {
    currentPathname = '/trails/new'
    const { container } = render(
      <ThemeProvider>
        <AppHeader user={mockUser} />
      </ThemeProvider>
    )

    const myTrailsLink = container.querySelector('a[href="/trails"]')
    expect(myTrailsLink).toBeInTheDocument()
    expect(myTrailsLink?.className).not.toContain('text-[#111111] dark:text-[#FFFFFF] font-semibold')
    expect(myTrailsLink?.querySelector('span.bg-\\[\\#7857FF\\]')).toBeNull()
  })
})
