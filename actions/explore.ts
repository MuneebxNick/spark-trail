'use server'

import { db } from '@/lib/db'

export async function getExploreFeed(cursor?: string, take: number = 12) {
  try {
    const trails = await db.trail.findMany({
      where: {
        isPublic: true,
      },
      orderBy: [
        { updatedAt: 'desc' },
        { id: 'desc' }
      ],
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
      take: take + 1, // Fetch one extra to determine if there are more
      ...(cursor
        ? {
            skip: 1,
            cursor: {
              id: cursor,
            },
          }
        : {}),
    })

    let nextCursor: string | undefined = undefined
    if (trails.length > take) {
      const nextItem = trails.pop()
      nextCursor = nextItem?.id
    }

    return { success: true, trails, nextCursor }
  } catch (error) {
    console.error('Failed to fetch explore feed:', error)
    return { success: false, error: 'Failed to load community feed.' }
  }
}
