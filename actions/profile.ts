'use server'

import { db } from '@/lib/db'
import { requireAuth, getCurrentUser } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

export async function getUserProfile(username: string) {
  try {
    const currentUser = await getCurrentUser()
    const profileUser = await db.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: { 
            followers: true, 
            following: true, 
            trails: { where: { isPublic: true } } 
          },
        },
        followers: currentUser
          ? {
              where: { followerId: currentUser.id },
              take: 1,
            }
          : false,
      },
    })

    if (!profileUser) return { success: false, error: 'User not found' }

    const isFollowing =
      currentUser && profileUser.followers
        ? profileUser.followers.length > 0
        : false

    const publicTrails = await db.trail.findMany({
      where: { userId: profileUser.id, isPublic: true },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { entries: true, sparks: true, comments: true } },
        entries: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    })

    return {
      success: true,
      profile: profileUser,
      isFollowing,
      trails: publicTrails,
    }
  } catch (error) {
    console.error('Failed to load profile:', error)
    return { success: false, error: 'Failed to load profile' }
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const user = await requireAuth()

    if (user.id === targetUserId) {
      return { success: false, error: 'You cannot follow yourself' }
    }

    const existingFollow = await db.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    })

    if (existingFollow) {
      await db.follows.delete({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: targetUserId,
          },
        },
      })
    } else {
      await db.follows.create({
        data: {
          followerId: user.id,
          followingId: targetUserId,
        },
      })
    }

    revalidatePath(`/profile/[username]`, 'page')

    return { success: true, isFollowing: !existingFollow }
  } catch (error) {
    console.error('Failed to toggle follow:', error)
    return { success: false, error: 'Failed to toggle follow' }
  }
}

export async function getFollowers(username: string) {
  try {
    const currentUser = await getCurrentUser()
    const profileUser = await db.user.findUnique({
      where: { username },
      select: { id: true, name: true, username: true }
    })

    if (!profileUser) return { success: false, error: 'User not found' }

    const followers = await db.follows.findMany({
      where: { followingId: profileUser.id },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            bio: true,
            followers: currentUser ? {
              where: { followerId: currentUser.id },
              take: 1
            } : false
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const users = followers.map(f => ({
      ...f.follower,
      isFollowing: f.follower.followers ? f.follower.followers.length > 0 : false
    }))

    return { success: true, users, profileUser }
  } catch (error) {
    console.error('Failed to load followers:', error)
    return { success: false, error: 'Failed to load followers' }
  }
}

export async function getFollowing(username: string) {
  try {
    const currentUser = await getCurrentUser()
    const profileUser = await db.user.findUnique({
      where: { username },
      select: { id: true, name: true, username: true }
    })

    if (!profileUser) return { success: false, error: 'User not found' }

    const following = await db.follows.findMany({
      where: { followerId: profileUser.id },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            bio: true,
            followers: currentUser ? {
              where: { followerId: currentUser.id },
              take: 1
            } : false
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const users = following.map(f => ({
      ...f.following,
      isFollowing: f.following.followers ? f.following.followers.length > 0 : false
    }))

    return { success: true, users, profileUser }
  } catch (error) {
    console.error('Failed to load following:', error)
    return { success: false, error: 'Failed to load following' }
  }
}

