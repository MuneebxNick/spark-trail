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
  try {
    const user = await requireAuth()

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
