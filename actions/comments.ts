'use server'

import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const commentSchema = z.object({
  trailId: z.string(),
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
})

export async function addComment(trailId: string, content: string) {
  const user = await requireAuth()
  
  try {
    const validated = commentSchema.parse({ trailId, content })

    const comment = await db.comment.create({
      data: {
        userId: user.id,
        trailId: validated.trailId,
        content: validated.content,
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    })

    revalidatePath(`/trails/${trailId}`)
    revalidatePath(`/explore`)

    return { success: true, comment }
  } catch (error) {
    console.error('Failed to add comment:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: (error as any).errors[0].message }
    }
    return { success: false, error: 'Failed to add comment.' }
  }
}

const updateCommentSchema = z.object({
  commentId: z.string(),
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
})

export async function updateComment(commentId: string, content: string) {
  const user = await requireAuth()

  try {
    const validated = updateCommentSchema.parse({ commentId, content })

    const comment = await db.comment.findUnique({
      where: { id: validated.commentId },
    })

    if (!comment) {
      return { success: false, error: 'Comment not found.' }
    }

    if (comment.userId !== user.id) {
      return { success: false, error: 'Unauthorized to edit this comment.' }
    }

    await db.comment.update({
      where: { id: validated.commentId },
      data: { content: validated.content },
    })

    revalidatePath(`/trails/${comment.trailId}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to update comment:', error)
    return { success: false, error: 'Failed to update comment.' }
  }
}

export async function deleteComment(commentId: string) {
  const user = await requireAuth()

  try {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return { success: false, error: 'Comment not found.' }
    }

    if (comment.userId !== user.id) {
      return { success: false, error: 'Unauthorized to delete this comment.' }
    }

    await db.comment.delete({
      where: { id: commentId },
    })

    revalidatePath(`/trails/${comment.trailId}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete comment:', error)
    return { success: false, error: 'Failed to delete comment.' }
  }
}

export async function getMoreComments(trailId: string, cursor: string, take: number = 20) {
  try {
    const comments = await db.comment.findMany({
      where: { trailId },
      take,
      skip: 1, // Skip the cursor
      cursor: { id: cursor },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: { name: true, username: true, avatarUrl: true },
        },
      },
    })
    return { success: true, comments }
  } catch (error) {
    console.error('Failed to fetch more comments:', error)
    return { success: false, error: 'Failed to fetch more comments.' }
  }
}
