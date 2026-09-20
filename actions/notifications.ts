'use server'

import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

export async function getNotifications(take: number = 50) {
  const user = await requireAuth()

  try {
    const notifications = await db.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: {
        actor: {
          select: {
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        trail: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
    })

    return { success: true, notifications }
  } catch (error) {
    console.error('Failed to get notifications:', error)
    return { success: false, error: 'Failed to get notifications' }
  }
}

export async function getUnreadNotificationCount() {
  const user = await requireAuth()

  try {
    const count = await db.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    })
    return { success: true, count }
  } catch (error) {
    console.error('Failed to get unread notification count:', error)
    return { success: false, error: 'Failed to get unread notification count', count: 0 }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  const user = await requireAuth()

  try {
    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification || notification.recipientId !== user.id) {
      return { success: false, error: 'Notification not found or unauthorized' }
    }

    await db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    revalidatePath('/notifications')
    revalidatePath('/dashboard', 'layout')
    
    return { success: true }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
    return { success: false, error: 'Failed to mark notification as read' }
  }
}

export async function markAllNotificationsAsRead() {
  const user = await requireAuth()

  try {
    await db.notification.updateMany({
      where: {
        recipientId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    })

    revalidatePath('/notifications')
    revalidatePath('/dashboard', 'layout')
    
    return { success: true }
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
    return { success: false, error: 'Failed to mark all notifications as read' }
  }
}
