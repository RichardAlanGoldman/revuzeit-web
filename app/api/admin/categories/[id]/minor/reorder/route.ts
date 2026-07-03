import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { reorderMinorCategories } from '@/lib/db/queries'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await params
    const { orderedIds } = await request.json()
    if (!Array.isArray(orderedIds) || orderedIds.some((v) => typeof v !== 'number')) {
      return NextResponse.json({ error: 'orderedIds must be an array of ids' }, { status: 400 })
    }
    await reorderMinorCategories(parseInt(id), orderedIds)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
