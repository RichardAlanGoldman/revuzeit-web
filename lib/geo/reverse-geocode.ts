export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'revuzeit-portfolio/1.0',
      },
    })
    if (!response.ok) return null
    const data = await response.json()
    // Return a concise location: "City, State" or "City, Country"
    const { city, town, village, state, country } = data.address ?? {}
    const place = city ?? town ?? village ?? null
    const region = state ?? country ?? null
    if (place && region) return `${place}, ${region}`
    if (place) return place
    if (region) return region
    return data.display_name ?? null
  } catch {
    return null
  }
}
