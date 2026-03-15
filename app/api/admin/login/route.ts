import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = await createSessionToken()

    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
