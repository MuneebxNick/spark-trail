'use server'

import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth/session'
import {
  createTrailSchema,
  addTrailEntrySchema,
  type CreateTrailInput,
  type AddTrailEntryInput,
  type progressStatusEnum,
} from '@/lib/validations/trail'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { uploadTrailImageToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary'

type ProgressStatusType = z.infer<typeof progressStatusEnum>

export type TrailActionResult = {
  success: boolean
  error?: string
  trailId?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Server Action: Creates a new Trail.
 */
export async function createTrail(data: CreateTrailInput): Promise<TrailActionResult> {
  const session = await verifySession()
  if (!session) {
    return { success: false, error: 'You must be logged in to create a trail.' }
  }

  const validated = createTrailSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      error: 'Invalid form inputs.',
      fieldErrors: validated.error.flatten().fieldErrors,
    }
  }

  const { title, description, category, status, isPublic } = validated.data

  try {
    const trail = await db.trail.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        category: category?.trim() || null,
        status,
        isPublic,
        userId: session.userId,
      },
    })

    revalidatePath('/dashboard')

    return { success: true, trailId: trail.id }
  } catch (err) {
    console.error('Error creating trail:', err)
    return {
      success: false,
      error: 'Failed to create trail. Please check your database connection.',
    }
  }
}

/**
 * Server Action: Adds a new progress entry to a Trail.
 * Automatically updates the parent Trail's status to match the entry's statusTag.
 */
export async function addTrailEntry(data: AddTrailEntryInput): Promise<TrailActionResult> {
  const session = await verifySession()
  if (!session) {
    return { success: false, error: 'You must be logged in to post an entry.' }
  }

  const validated = addTrailEntrySchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      error: 'Invalid entry payload.',
      fieldErrors: validated.error.flatten().fieldErrors,
    }
  }

  const { trailId, content, statusTag, mediaUrl, imageData } = validated.data

  try {
    // Verify trail existence & ownership
    const trail = await db.trail.findUnique({
      where: { id: trailId },
      select: { id: true, userId: true },
    })

    if (!trail) {
      return { success: false, error: 'Trail not found.' }
    }

    if (trail.userId !== session.userId) {
      return { success: false, error: 'You do not have permission to post updates to this trail.' }
    }

    let finalMediaUrl: string | null = null

    // 1. If public HTTP/HTTPS URL provided
    if (mediaUrl && (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://'))) {
      finalMediaUrl = mediaUrl.trim()
    }

    // 2. If device image uploaded (base64 data URI)
    const uploadSource = imageData || (mediaUrl && mediaUrl.startsWith('data:image/') ? mediaUrl : null)
    if (uploadSource) {
      if (!isCloudinaryConfigured) {
        return {
          success: false,
          error:
            'Cloudinary credentials are not configured in your environment. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env to upload local images, or link a public image URL.',
        }
      }

      try {
        const uploadResult = await uploadTrailImageToCloudinary(uploadSource)
        finalMediaUrl = uploadResult.url
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr)
        let safeErrorMessage = 'Image upload to Cloudinary failed. Please try again.'
        if (uploadErr instanceof Error) {
          if (
            uploadErr.message.includes('maximum allowed size') ||
            uploadErr.message.includes('Invalid image type')
          ) {
            safeErrorMessage = uploadErr.message
          }
        }
        return {
          success: false,
          error: safeErrorMessage,
        }
      }
    }

    // Create entry and update parent trail status + updatedAt timestamp in a transaction
    await db.$transaction([
      db.trailEntry.create({
        data: {
          trailId,
          content: content.trim(),
          statusTag,
          mediaUrl: finalMediaUrl,
        },
      }),
      db.trail.update({
        where: { id: trailId },
        data: {
          status: statusTag,
          updatedAt: new Date(),
        },
      }),
    ])

    revalidatePath(`/trails/${trailId}`)
    revalidatePath('/dashboard')

    return { success: true, trailId }
  } catch (err) {
    console.error('Error adding trail entry:', err)
    return {
      success: false,
      error: 'Failed to post entry. Please try again.',
    }
  }
}

/**
 * Server Action: Deletes a Trail.
 * Server-side ownership check enforced.
 */
export async function deleteTrail(trailId: string): Promise<TrailActionResult> {
  const session = await verifySession()
  if (!session) {
    return { success: false, error: 'You must be logged in.' }
  }

  try {
    const trail = await db.trail.findUnique({
      where: { id: trailId },
      select: { id: true, userId: true },
    })

    if (!trail) {
      return { success: false, error: 'Trail not found.' }
    }

    if (trail.userId !== session.userId) {
      return { success: false, error: 'Unauthorized: You can only delete your own trails.' }
    }

    await db.trail.delete({
      where: { id: trailId },
    })

    revalidatePath('/dashboard')

    return { success: true }
  } catch (err) {
    console.error('Error deleting trail:', err)
    return { success: false, error: 'Failed to delete trail.' }
  }
}

/**
 * Server Action: Updates a Trail's overall progress status.
 */
export async function updateTrailStatus(
  trailId: string,
  status: ProgressStatusType
): Promise<TrailActionResult> {
  const session = await verifySession()
  if (!session) {
    return { success: false, error: 'You must be logged in.' }
  }

  try {
    const trail = await db.trail.findUnique({
      where: { id: trailId },
      select: { id: true, userId: true },
    })

    if (!trail) {
      return { success: false, error: 'Trail not found.' }
    }

    if (trail.userId !== session.userId) {
      return { success: false, error: 'Unauthorized: You do not own this trail.' }
    }

    await db.trail.update({
      where: { id: trailId },
      data: { status, updatedAt: new Date() },
    })

    revalidatePath(`/trails/${trailId}`)
    revalidatePath('/dashboard')

    return { success: true, trailId }
  } catch (err) {
    console.error('Error updating status:', err)
    return { success: false, error: 'Failed to update trail status.' }
  }
}
