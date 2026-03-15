import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_EXPIRY = '24h'

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) throw new Error('ADMIN_JWT_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(getSecret())
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}
