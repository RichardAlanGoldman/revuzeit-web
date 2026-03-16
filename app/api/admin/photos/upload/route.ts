import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { requireAdmin } from '@/lib/auth/require-admin'
import { createPhoto } from '@/lib/db/queries'
import { reverseGeocode } from '@/lib/geo/reverse-geocode'
import { slugify } from '@/lib/utils/slugify'

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const minorCategoryId = formData.get('minorCategoryId') as string | null
    const caption = formData.get('caption') as string | null
    const locationNameOverride = formData.get('locationName') as string | null
    const dateTakenOverride = formData.get('dateTaken') as string | null
    const displayOrder = formData.get('displayOrder') as string | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!minorCategoryId) return NextResponse.json({ error: 'minorCategoryId is required' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const originalFilename = file.name

    // ── Extract EXIF ────────────────────────────────────────────────────────
    let dateTaken: string | null = dateTakenOverride || null
    let latitude: number | null = null
    let longitude: number | null = null
    let locationName: string | null = locationNameOverride || null

    try {
      const exifr = await import('exifr')

      // Extract date
      const exif = await exifr.default.parse(buffer, {
        tiff: true,
        exif: true,
        gps: false,
        pick: ['DateTimeOriginal', 'CreateDate'],
      })
      if (exif && !dateTaken) {
        const rawDate = exif.DateTimeOriginal ?? exif.CreateDate
        if (rawDate instanceof Date) {
          dateTaken = rawDate.toISOString()
        } else if (typeof rawDate === 'string') {
          dateTaken = new Date(rawDate).toISOString()
        }
      }

      // Extract GPS using exifr.gps() — always returns decimal degrees
      try {
        const gps = await exifr.default.gps(buffer)
        if (gps && typeof gps.latitude === 'number' && typeof gps.longitude === 'number') {
          latitude = gps.latitude
          longitude = gps.longitude
          if (!locationName) {
            locationName = await reverseGeocode(latitude, longitude)
          }
        }
      } catch {
        // No GPS data — not an error
      }
    } catch (exifError) {
      console.error('EXIF parse error (non-fatal):', exifError)
    }

    // ── Convert HEIC → JPEG if needed ────────────────────────────────────────
    const isHeic = /\.(heic|heif)$/i.test(originalFilename) || file.type === 'image/heic' || file.type === 'image/heif'
    let sharpInput: Buffer = buffer
    if (isHeic) {
      const heicConvert = (await import('heic-convert')).default
      sharpInput = Buffer.from(
        await heicConvert({ buffer, format: 'JPEG', quality: 1 })
      )
    }

    // ── Process image with Sharp ─────────────────────────────────────────────
    const sharp = (await import('sharp')).default
    const processedBuffer = await sharp(sharpInput)
      .rotate() // auto-rotate based on EXIF orientation
      .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer()

    // ── Upload to Vercel Blob ────────────────────────────────────────────────
    const baseName = originalFilename.replace(/\.[^.]+$/, '')
    const blobFilename = `${Date.now()}-${slugify(baseName)}.webp`

    const { url } = await put(blobFilename, processedBuffer, {
      access: 'public',
      contentType: 'image/webp',
    })

    // ── Save to database ─────────────────────────────────────────────────────
    const photo = await createPhoto({
      minor_category_id: parseInt(minorCategoryId),
      caption: caption || null,
      blob_url: url,
      original_filename: originalFilename,
      date_taken: dateTaken,
      latitude,
      longitude,
      location_name: locationName,
      display_order: displayOrder ? parseInt(displayOrder) : 0,
    })

    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
