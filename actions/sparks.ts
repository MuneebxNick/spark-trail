'use server'

import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

export async function toggleSpark(trailId: string) {
  const user = await requireAuth()
  
  try {
    const existingSpark = await db.spark.findUnique({
      where: {
        userId_trailId: {
          userId: user.id,
          trailId,
        },
      },
    })

    const trail = await db.trail.findUnique({
      where: { id: trailId },
      select: { userId: true },
    })

    if (!trail) {
      return { success: false, error: 'Trail not found' }
    }

    if (existingSpark) {
      await db.spark.delete({
        where: { id: existingSpark.id },
      })
      
      // Delete notification if it exists
      if (trail.userId !== user.id) {
        await db.notification.deleteMany({
          where: {
            type: 'NEW_SPARK',
            actorId: user.id,
            recipientId: trail.userId,
            trailId,
          }
        })
      }
    } else {
      await db.spark.create({
        data: {
          userId: user.id,
          trailId,
        },
      })
      
      // Create notification
      if (trail.userId !== user.id) {
        await db.notification.create({
          data: {
            type: 'NEW_SPARK',
            actorId: user.id,
            recipientId: trail.userId,
            trailId,
          }
        })
      }
    }

    revalidatePath(`/trails/${trailId}`)
    revalidatePath(`/explore`)
    revalidatePath('/dashboard', 'layout')

    return { success: true, sparked: !existingSpark }
  } catch (error) {
    console.error('Failed to toggle spark:', error)
    return { success: false, error: 'Failed to toggle spark.' }
  }
}
