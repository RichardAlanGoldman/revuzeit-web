import { NextRequest, NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { requireAdmin } from '@/lib/auth/require-admin'
import { updatePhoto, deletePhoto, getPhotoById } from '@/lib/db/queries'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await params
    const { caption, location_name, display_order, date_taken } = await request.json()
    const photo = await updatePhoto(parseInt(id), {
      caption,
      location_name,
      display_order,
      date_taken,
    })
    if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(photo)
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
    const photo = await getPhotoById(parseInt(id))
    if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Delete from Vercel Blob first
    await del(photo.blob_url)

    // Then delete from database
    await deletePhoto(parseInt(id))

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
