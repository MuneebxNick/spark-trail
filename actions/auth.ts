'use server'

import { db } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { createSession, deleteSession } from '@/lib/auth/session'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validations/auth'

export type AuthActionResult = {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Server Action: Registers a new user.
 */
export async function registerUser(data: RegisterInput): Promise<AuthActionResult> {
  const validated = registerSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      error: 'Invalid inputs provided.',
      fieldErrors: validated.error.flatten().fieldErrors,
    }
  }

  const { name, username, email, password } = validated.data
  const cleanUsername = username.toLowerCase().trim()
  const cleanEmail = email.toLowerCase().trim()

  try {
    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email: cleanEmail }, { username: cleanUsername }],
      },
    })

    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return { success: false, error: 'An account with this email already exists.' }
      }
      return { success: false, error: 'This username is already taken.' }
    }

    const passwordHash = await hashPassword(password)

    const newUser = await db.user.create({
      data: {
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        passwordHash,
      },
    })

    await createSession({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      name: newUser.name,
    })

    return { success: true }
  } catch (err) {
    console.error('Registration error:', err)
    return {
      success: false,
      error: 'Database error or service unavailable. Please ensure DATABASE_URL is configured.',
    }
  }
}

/**
 * Server Action: Logs in an existing user.
 */
export async function loginUser(data: LoginInput): Promise<AuthActionResult> {
  const validated = loginSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      error: 'Invalid email or password.',
      fieldErrors: validated.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validated.data
  const cleanEmail = email.toLowerCase().trim()

  try {
    const user = await db.user.findUnique({
      where: { email: cleanEmail },
    })

    if (!user) {
      return { success: false, error: 'Invalid email or password.' }
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return { success: false, error: 'Invalid email or password.' }
    }

    await createSession({
      userId: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
    })

    return { success: true }
  } catch (err) {
    console.error('Login error:', err)
    return {
      success: false,
      error: 'Database error or service unavailable. Please ensure DATABASE_URL is configured.',
    }
  }
}

/**
 * Server Action: Logs out the current user.
 */
export async function logoutUser(): Promise<{ success: boolean }> {
  await deleteSession()
  return { success: true }
}
