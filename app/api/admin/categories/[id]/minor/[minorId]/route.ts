import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { updateMinorCategory, deleteMinorCategory } from '@/lib/db/queries'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; minorId: string }> }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { minorId } = await params
    const { name, slug, description, display_order } = await request.json()
    const minor = await updateMinorCategory(parseInt(minorId), {
      name,
      slug,
      description,
      display_order,
    })
    if (!minor) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(minor)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; minorId: string }> }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { minorId } = await params
    await deleteMinorCategory(parseInt(minorId))
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
