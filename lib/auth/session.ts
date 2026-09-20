import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

const COOKIE_NAME = 'sparktrail_session'
if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing')
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export interface SessionPayload {
  userId: string
  email: string
  username: string
  name: string
}

/**
 * Creates and sets a signed HttpOnly JWT session cookie.
 */
export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })

  return token
}

/**
 * Verifies and returns the current session payload from the cookie.
 */
export async function verifySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      username: payload.username as string,
      name: payload.name as string,
    }
  } catch {
    return null
  }
}

/**
 * Deletes the session cookie (logout).
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Fetches the authenticated user's DB record (safe fields only, excluding passwordHash).
 */
export async function getCurrentUser() {
  const session = await verifySession()
  if (!session) return null

  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    })
    return user
  } catch {
    return null
  }
}

/**
 * Ensures the user is authenticated. Redirects to /login if not authenticated.
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}
