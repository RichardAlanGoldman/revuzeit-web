import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { updateMajorCategory, deleteMajorCategory } from '@/lib/db/queries'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await params
    const { name, slug } = await request.json()
    if (!name || !slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })
    }
    const category = await updateMajorCategory(parseInt(id), name, slug)
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await params
    await deleteMajorCategory(parseInt(id))
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
