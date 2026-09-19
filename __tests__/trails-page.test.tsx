import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MyTrailsPage from '@/app/(dashboard)/trails/page'
import React from 'react'

vi.mock('@/lib/auth/session', () => ({
  requireAuth: vi.fn().mockResolvedValue({
    id: 'test_user_1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    username: 'ada',
  }),
}))

const mockFindMany = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    trail: {
      findMany: (...args: any[]) => mockFindMany(...args),
    },
  },
}))

vi.mock('@/components/animations/page-transition', () => ({
  StaggerContainer: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  StaggerItem: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/components/animations/route-transition', () => ({
  TransitionLink: ({ href, children, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('MyTrailsPage', () => {
  it('renders honest empty state when user has no trails', async () => {
    mockFindMany.mockResolvedValueOnce([])

    const jsx = await MyTrailsPage()
    render(jsx)

    expect(screen.getByText('My Trails')).toBeInTheDocument()
    expect(screen.getByText('No trails started yet')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /start your first trail/i })
    ).toHaveAttribute('href', '/trails/new')
  })

  it('renders trails list with status badges, category, and links when trails exist', async () => {
    mockFindMany.mockResolvedValueOnce([
      {
        id: 'trail_1',
        title: 'Building Autonomous Agent Engine',
        description: 'Creating the next-gen autonomous coding agent.',
        category: 'ai-tools',
        status: 'BUILDING',
        isPublic: true,
        createdAt: new Date('2026-09-01'),
        updatedAt: new Date('2026-09-17'),
        userId: 'test_user_1',
        _count: { entries: 5 },
        entries: [
          {
            id: 'entry_1',
            content: 'Implemented streaming tool calls and subagent delegation.',
            statusTag: 'BUILDING',
            createdAt: new Date('2026-09-17'),
          },
        ],
      },
      {
        id: 'trail_2',
        title: 'Rust Network Stack',
        description: 'Deep dive into zero-copy packet processing.',
        category: 'systems',
        status: 'WIN',
        isPublic: false,
        createdAt: new Date('2026-08-15'),
        updatedAt: new Date('2026-09-10'),
        userId: 'test_user_1',
        _count: { entries: 12 },
        entries: [],
      },
    ])

    const jsx = await MyTrailsPage()
    render(jsx)

    // Heading & Create CTA
    expect(screen.getByText('My Trails')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /create trail/i })).toHaveAttribute(
      'href',
      '/trails/new'
    )

    // Trail 1
    expect(screen.getByText('Building Autonomous Agent Engine')).toBeInTheDocument()
    expect(screen.getByText('#ai-tools')).toBeInTheDocument()
    expect(screen.getByText('BUILDING')).toBeInTheDocument()
    expect(screen.getByText('Public')).toBeInTheDocument()
    expect(screen.getByText('5 entries')).toBeInTheDocument()
    expect(
      screen.getByText(/Implemented streaming tool calls/i)
    ).toBeInTheDocument()

    // Trail 2
    expect(screen.getByText('Rust Network Stack')).toBeInTheDocument()
    expect(screen.getByText('#systems')).toBeInTheDocument()
    expect(screen.getByText('WIN')).toBeInTheDocument()
    expect(screen.getByText('Private')).toBeInTheDocument()
    expect(screen.getByText('12 entries')).toBeInTheDocument()

    // Links to detail pages
    const trailLinks = screen.getAllByRole('link')
    const trail1Link = trailLinks.find((l) =>
      l.getAttribute('href')?.includes('/trails/trail_1')
    )
    const trail2Link = trailLinks.find((l) =>
      l.getAttribute('href')?.includes('/trails/trail_2')
    )
    expect(trail1Link).toBeDefined()
    expect(trail2Link).toBeDefined()
  })
})
