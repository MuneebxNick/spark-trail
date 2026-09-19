'use server'

import { db } from '@/lib/db'

export async function getExploreFeed() {
  try {
    const trails = await db.trail.findMany({
      where: {
        isPublic: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            sparks: true,
            comments: true,
            entries: true,
          },
        },
        entries: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      take: 50,
    })

    return { success: true, trails }
  } catch (error) {
    console.error('Failed to fetch explore feed:', error)
    return { success: false, error: 'Failed to load community feed.' }
  }
}
