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

    if (existingSpark) {
      await db.spark.delete({
        where: { id: existingSpark.id },
      })
    } else {
      await db.spark.create({
        data: {
          userId: user.id,
          trailId,
        },
      })
    }

    revalidatePath(`/trails/${trailId}`)
    revalidatePath(`/explore`)

    return { success: true, sparked: !existingSpark }
  } catch (error) {
    console.error('Failed to toggle spark:', error)
    return { success: false, error: 'Failed to toggle spark.' }
  }
}
