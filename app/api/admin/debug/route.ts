import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    hasJwtSecret: !!process.env.ADMIN_JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    passwordLength: process.env.ADMIN_PASSWORD?.length ?? 0,
  })
}
