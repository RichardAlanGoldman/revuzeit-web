import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { getMinorCategoriesByMajor, createMinorCategory } from '@/lib/db/queries'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await params
    const minors = await getMinorCategoriesByMajor(parseInt(id))
    return NextResponse.json(minors)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await params
    const { name, slug, description, displayOrder } = await request.json()
    if (!name || !slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })
    }
    const minor = await createMinorCategory(
      parseInt(id),
      name,
      slug,
      description ?? '',
      displayOrder ?? 0
    )
    return NextResponse.json(minor, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
