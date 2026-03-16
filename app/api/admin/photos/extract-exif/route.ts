import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { reverseGeocode } from '@/lib/geo/reverse-geocode'

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Dynamic import to keep exifr server-only
    const exifr = await import('exifr')

    let dateTaken: string | null = null
    let latitude: number | null = null
    let longitude: number | null = null
    let locationName: string | null = null

    // Extract date separately
    const exif = await exifr.default.parse(buffer, {
      tiff: true,
      exif: true,
      gps: false,
      pick: ['DateTimeOriginal', 'CreateDate'],
    })
    if (exif) {
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
        locationName = await reverseGeocode(latitude, longitude)
      }
    } catch {
      // No GPS data — not an error
    }

    return NextResponse.json({ dateTaken, latitude, longitude, locationName })
  } catch (error) {
    // Return empty metadata rather than failing — user can fill in manually
    console.error('EXIF extraction error:', error)
    return NextResponse.json({ dateTaken: null, latitude: null, longitude: null, locationName: null })
  }
}
