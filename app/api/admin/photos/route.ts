import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { getAllPhotos } from '@/lib/db/queries'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const minorCategoryId = request.nextUrl.searchParams.get('minorCategoryId')
    const photos = await getAllPhotos(
      minorCategoryId ? { minorCategoryId: parseInt(minorCategoryId) } : undefined
    )
    return NextResponse.json(photos)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
