import { neon } from '@neondatabase/serverless'

function getDb() {
  const sql = neon(process.env.DATABASE_URL!)
  return sql
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type MajorCategory = {
  id: number
  name: string
  slug: string
  created_at: string
}

export type MinorCategory = {
  id: number
  major_category_id: number
  name: string
  slug: string
  description: string | null
  display_order: number
  created_at: string
}

export type MinorCategoryWithMajor = MinorCategory & {
  major_name: string
  major_slug: string
}

export type Photo = {
  id: number
  minor_category_id: number
  caption: string | null
  blob_url: string
  original_filename: string | null
  date_taken: string | null
  latitude: number | null
  longitude: number | null
  location_name: string | null
  display_order: number
  created_at: string
}

export type PhotoWithCategory = Photo & {
  minor_name: string
  major_name: string
}

export type MajorCategoryWithMinors = MajorCategory & {
  minors: MinorCategory[]
}

// ─── Major Categories ─────────────────────────────────────────────────────────

export async function getMajorCategories(): Promise<MajorCategory[]> {
  const sql = getDb()
  const rows = await sql`SELECT * FROM major_categories ORDER BY name ASC`
  return rows as MajorCategory[]
}

export async function getMajorCategoryBySlug(slug: string): Promise<MajorCategory | null> {
  const sql = getDb()
  const rows = await sql`SELECT * FROM major_categories WHERE slug = ${slug} LIMIT 1`
  return (rows[0] as MajorCategory) ?? null
}

export async function getAllMajorCategoriesWithMinors(): Promise<MajorCategoryWithMinors[]> {
  const sql = getDb()
  const majors = await sql`SELECT * FROM major_categories ORDER BY name ASC`
  const minors = await sql`SELECT * FROM minor_categories ORDER BY display_order ASC, name ASC`

  return (majors as MajorCategory[]).map((major) => ({
    ...major,
    minors: (minors as MinorCategory[]).filter((m) => m.major_category_id === major.id),
  }))
}

export async function createMajorCategory(name: string, slug: string): Promise<MajorCategory> {
  const sql = getDb()
  const rows = await sql`
    INSERT INTO major_categories (name, slug)
    VALUES (${name}, ${slug})
    RETURNING *
  `
  return rows[0] as MajorCategory
}

export async function updateMajorCategory(
  id: number,
  name: string,
  slug: string
): Promise<MajorCategory | null> {
  const sql = getDb()
  const rows = await sql`
    UPDATE major_categories SET name = ${name}, slug = ${slug}
    WHERE id = ${id} RETURNING *
  `
  return (rows[0] as MajorCategory) ?? null
}

export async function deleteMajorCategory(id: number): Promise<void> {
  const sql = getDb()
  await sql`DELETE FROM major_categories WHERE id = ${id}`
}

// ─── Minor Categories ─────────────────────────────────────────────────────────

export async function getMinorCategoriesByMajor(majorId: number): Promise<MinorCategory[]> {
  const sql = getDb()
  const rows = await sql`
    SELECT * FROM minor_categories
    WHERE major_category_id = ${majorId}
    ORDER BY display_order ASC, name ASC
  `
  return rows as MinorCategory[]
}

export async function getMinorCategoryBySlug(
  majorId: number,
  slug: string
): Promise<MinorCategory | null> {
  const sql = getDb()
  const rows = await sql`
    SELECT * FROM minor_categories
    WHERE major_category_id = ${majorId} AND slug = ${slug}
    LIMIT 1
  `
  return (rows[0] as MinorCategory) ?? null
}

export async function createMinorCategory(
  majorCategoryId: number,
  name: string,
  slug: string,
  description: string,
  displayOrder: number
): Promise<MinorCategory> {
  const sql = getDb()
  const rows = await sql`
    INSERT INTO minor_categories (major_category_id, name, slug, description, display_order)
    VALUES (${majorCategoryId}, ${name}, ${slug}, ${description}, ${displayOrder})
    RETURNING *
  `
  return rows[0] as MinorCategory
}

export async function updateMinorCategory(
  id: number,
  updates: { name?: string; slug?: string; description?: string; display_order?: number }
): Promise<MinorCategory | null> {
  const sql = getDb()
  const rows = await sql`
    UPDATE minor_categories
    SET
      name = COALESCE(${updates.name ?? null}, name),
      slug = COALESCE(${updates.slug ?? null}, slug),
      description = COALESCE(${updates.description ?? null}, description),
      display_order = COALESCE(${updates.display_order ?? null}, display_order)
    WHERE id = ${id}
    RETURNING *
  `
  return (rows[0] as MinorCategory) ?? null
}

export async function deleteMinorCategory(id: number): Promise<void> {
  const sql = getDb()
  await sql`DELETE FROM minor_categories WHERE id = ${id}`
}

// ─── Photos ───────────────────────────────────────────────────────────────────

export async function getPhotosByMinorCategory(minorId: number): Promise<Photo[]> {
  const sql = getDb()
  const rows = await sql`
    SELECT * FROM photos
    WHERE minor_category_id = ${minorId}
    ORDER BY display_order ASC, date_taken ASC
  `
  return rows as Photo[]
}

export async function getFirstPhotoForMinorCategory(minorId: number): Promise<Photo | null> {
  const sql = getDb()
  const rows = await sql`
    SELECT * FROM photos
    WHERE minor_category_id = ${minorId}
    ORDER BY display_order ASC, date_taken ASC
    LIMIT 1
  `
  return (rows[0] as Photo) ?? null
}

export async function getAllPhotos(filters?: { minorCategoryId?: number }): Promise<PhotoWithCategory[]> {
  const sql = getDb()
  if (filters?.minorCategoryId) {
    const rows = await sql`
      SELECT p.*, mn.name as minor_name, mj.name as major_name
      FROM photos p
      JOIN minor_categories mn ON p.minor_category_id = mn.id
      JOIN major_categories mj ON mn.major_category_id = mj.id
      WHERE p.minor_category_id = ${filters.minorCategoryId}
      ORDER BY p.display_order ASC, p.created_at DESC
    `
    return rows as PhotoWithCategory[]
  }
  const rows = await sql`
    SELECT p.*, mn.name as minor_name, mj.name as major_name
    FROM photos p
    JOIN minor_categories mn ON p.minor_category_id = mn.id
    JOIN major_categories mj ON mn.major_category_id = mj.id
    ORDER BY p.created_at DESC
  `
  return rows as PhotoWithCategory[]
}

export async function createPhoto(data: {
  minor_category_id: number
  caption: string | null
  blob_url: string
  original_filename: string | null
  date_taken: string | null
  latitude: number | null
  longitude: number | null
  location_name: string | null
  display_order: number
}): Promise<Photo> {
  const sql = getDb()
  const rows = await sql`
    INSERT INTO photos (
      minor_category_id, caption, blob_url, original_filename,
      date_taken, latitude, longitude, location_name, display_order
    ) VALUES (
      ${data.minor_category_id}, ${data.caption}, ${data.blob_url}, ${data.original_filename},
      ${data.date_taken}, ${data.latitude}, ${data.longitude}, ${data.location_name}, ${data.display_order}
    )
    RETURNING *
  `
  return rows[0] as Photo
}

export async function updatePhoto(
  id: number,
  updates: {
    caption?: string | null
    location_name?: string | null
    display_order?: number
    date_taken?: string | null
  }
): Promise<Photo | null> {
  const sql = getDb()
  const rows = await sql`
    UPDATE photos
    SET
      caption = COALESCE(${updates.caption !== undefined ? updates.caption : null}, caption),
      location_name = COALESCE(${updates.location_name !== undefined ? updates.location_name : null}, location_name),
      display_order = COALESCE(${updates.display_order ?? null}, display_order),
      date_taken = COALESCE(${updates.date_taken !== undefined ? updates.date_taken : null}, date_taken)
    WHERE id = ${id}
    RETURNING *
  `
  return (rows[0] as Photo) ?? null
}

export async function deletePhoto(id: number): Promise<Photo | null> {
  const sql = getDb()
  const rows = await sql`DELETE FROM photos WHERE id = ${id} RETURNING *`
  return (rows[0] as Photo) ?? null
}

export async function getPhotoById(id: number): Promise<Photo | null> {
  const sql = getDb()
  const rows = await sql`SELECT * FROM photos WHERE id = ${id} LIMIT 1`
  return (rows[0] as Photo) ?? null
}

export async function getCounts(): Promise<{ majors: number; minors: number; photos: number }> {
  const sql = getDb()
  const rows = await sql`
    SELECT
      (SELECT COUNT(*) FROM major_categories) as majors,
      (SELECT COUNT(*) FROM minor_categories) as minors,
      (SELECT COUNT(*) FROM photos) as photos
  `
  const row = rows[0] as { majors: string; minors: string; photos: string }
  return {
    majors: parseInt(row.majors),
    minors: parseInt(row.minors),
    photos: parseInt(row.photos),
  }
}
