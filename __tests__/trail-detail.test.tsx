import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TrailDetailPage from '@/app/(dashboard)/trails/[id]/page'
import React from 'react'

const mockFindUnique = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    trail: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
    },
  },
}))

vi.mock('@/lib/auth/session', () => ({
  getCurrentUser: vi.fn().mockResolvedValue({
    id: 'user_owner',
    name: 'Trail Owner',
    email: 'owner@example.com',
    username: 'trailowner',
  }),
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
  useRouteTransition: () => ({
    transitionTo: vi.fn(),
    isTransitioning: false,
  }),
}))

vi.mock('@/components/sparktrail/trail-entry-form', () => ({
  TrailEntryForm: () => <div data-testid="trail-entry-form" />,
}))

vi.mock('@/components/sparktrail/delete-trail-button', () => ({
  DeleteTrailButton: () => <button data-testid="delete-button">Delete</button>,
}))

describe('TrailDetailPage Navigation', () => {
  it('renders "Back to studio" link pointing to /trails (not /dashboard)', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: 'trail_123',
      title: 'Navigation Consistency Trail',
      description: 'Testing the back button target',
      category: 'product',
      status: 'BUILDING',
      isPublic: true,
      createdAt: new Date('2026-09-01'),
      updatedAt: new Date('2026-09-19'),
      userId: 'user_owner',
      user: {
        id: 'user_owner',
        name: 'Trail Owner',
        username: 'trailowner',
        avatarUrl: null,
      },
      entries: [],
    })

    const jsx = await TrailDetailPage({
      params: Promise.resolve({ id: 'trail_123' }),
      searchParams: Promise.resolve({}),
    })
    render(jsx)

    const backLink = screen.getByRole('link', { name: /back to studio/i })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/trails')

    // Confirm no links point to /dashboard
    const allLinks = screen.getAllByRole('link')
    for (const link of allLinks) {
      expect(link.getAttribute('href')).not.toBe('/dashboard')
    }
  })

  it('renders private trail fallback with "Return to Studio" pointing to /trails', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: 'trail_private',
      title: 'Private Trail',
      description: null,
      category: null,
      status: 'BUILDING',
      isPublic: false,
      createdAt: new Date('2026-09-01'),
      updatedAt: new Date('2026-09-19'),
      userId: 'different_user',
      user: {
        id: 'different_user',
        name: 'Other User',
        username: 'other',
        avatarUrl: null,
      },
      entries: [],
    })

    const jsx = await TrailDetailPage({
      params: Promise.resolve({ id: 'trail_private' }),
      searchParams: Promise.resolve({}),
    })
    render(jsx)

    expect(screen.getByText('This Trail is Private')).toBeInTheDocument()
    const returnLink = screen.getByRole('link', { name: /return to studio/i })
    expect(returnLink).toBeInTheDocument()
    expect(returnLink).toHaveAttribute('href', '/trails')
  })
})
