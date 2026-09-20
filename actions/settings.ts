'use server'

import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/session'
import { createSession, deleteSession } from '@/lib/auth/session'
import { verifyPassword, hashPassword } from '@/lib/auth/password'
import { uploadAvatarToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary'
import { updateProfileSchema, changePasswordSchema, type UpdateProfileInput, type ChangePasswordInput } from '@/lib/validations/settings'
import { revalidatePath } from 'next/cache'

export type SettingsActionResult = {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Server Action: Updates user profile (name, username, bio, avatar).
 * Re-issues the session JWT when name or username changes.
 */
export async function updateProfile(data: UpdateProfileInput): Promise<SettingsActionResult> {
  const user = await requireAuth()

  const validated = updateProfileSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      error: 'Invalid profile data.',
      fieldErrors: validated.error.flatten().fieldErrors,
    }
  }

  const { name, username, bio, avatarData } = validated.data
  const cleanUsername = username.toLowerCase().trim()

  try {
    // Check username uniqueness if it changed
    if (cleanUsername !== user.username) {
      const existingUser = await db.user.findUnique({
        where: { username: cleanUsername },
      })

      if (existingUser && existingUser.id !== user.id) {
        return {
          success: false,
          error: 'This username is already taken.',
          fieldErrors: { username: ['This username is already taken.'] },
        }
      }
    }

    // Handle avatar upload if new image data provided
    let avatarUrl: string | undefined = undefined
    if (avatarData) {
      if (!isCloudinaryConfigured) {
        return {
          success: false,
          error: 'Avatar upload is currently unavailable. Please try again later.',
        }
      }

      try {
        const uploadResult = await uploadAvatarToCloudinary(avatarData)
        avatarUrl = uploadResult.url
      } catch (uploadErr) {
        console.error('Avatar upload error:', uploadErr)
        let safeErrorMessage = 'Avatar upload failed. Please try again.'
        if (uploadErr instanceof Error) {
          if (
            uploadErr.message.includes('maximum allowed size') ||
            uploadErr.message.includes('Invalid image type')
          ) {
            safeErrorMessage = uploadErr.message
          }
        }
        return { success: false, error: safeErrorMessage }
      }
    }

    // Build update payload
    const updateData: {
      name: string
      username: string
      bio: string | null
      avatarUrl?: string
    } = {
      name: name.trim(),
      username: cleanUsername,
      bio,
    }

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
      },
    })

    // Re-issue session JWT if identity fields changed
    if (updatedUser.name !== user.name || updatedUser.username !== user.username) {
      await createSession({
        userId: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
      })
    }

    revalidatePath('/settings')
    revalidatePath(`/profile/${updatedUser.username}`)
    revalidatePath('/dashboard')

    return { success: true }
  } catch (err) {
    console.error('Error updating profile:', err)
    return { success: false, error: 'Failed to update profile. Please try again.' }
  }
}

/**
 * Server Action: Changes the user's password.
 * Requires current password verification.
 */
export async function changePassword(data: ChangePasswordInput): Promise<SettingsActionResult> {
  const user = await requireAuth()

  const validated = changePasswordSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      error: 'Invalid password data.',
      fieldErrors: validated.error.flatten().fieldErrors,
    }
  }

  const { currentPassword, newPassword } = validated.data

  try {
    // Fetch user with passwordHash
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    })

    if (!dbUser) {
      return { success: false, error: 'User not found.' }
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, dbUser.passwordHash)
    if (!isValid) {
      return {
        success: false,
        error: 'Current password is incorrect.',
        fieldErrors: { currentPassword: ['Current password is incorrect.'] },
      }
    }

    // Hash and save new password
    const newHash = await hashPassword(newPassword)
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    })

    return { success: true }
  } catch (err) {
    console.error('Error changing password:', err)
    return { success: false, error: 'Failed to change password. Please try again.' }
  }
}

/**
 * Server Action: Permanently deletes the user's account.
 * Prisma cascade deletes handle all related data.
 */
export async function deleteAccount(): Promise<SettingsActionResult> {
  const user = await requireAuth()

  try {
    await db.user.delete({
      where: { id: user.id },
    })

    await deleteSession()

    return { success: true }
  } catch (err) {
    console.error('Error deleting account:', err)
    return { success: false, error: 'Failed to delete account. Please try again.' }
  }
}
