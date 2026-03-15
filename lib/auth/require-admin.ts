import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME, verifySessionToken } from './session'

export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const valid = await verifySessionToken(token)
  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null // null means authorized — proceed
}
