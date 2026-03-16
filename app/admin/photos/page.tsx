import Link from 'next/link'
import { getAllPhotos, getAllMajorCategoriesWithMinors, type PhotoWithCategory, type MajorCategoryWithMinors } from '@/lib/db/queries'
import PhotosListClient from './photos-list-client'

export default async function AdminPhotosPage() {
  let photos: PhotoWithCategory[] = []
  let categories: MajorCategoryWithMinors[] = []
  try {
    ;[photos, categories] = await Promise.all([
      getAllPhotos(),
      getAllMajorCategoriesWithMinors(),
    ])
  } catch {
    // DB not yet migrated
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Photos</h1>
        <Link
          href="/admin/photos/upload"
          className="bg-amber-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors"
        >
          Upload Photos
        </Link>
      </div>
      <PhotosListClient initialPhotos={photos} categories={categories} />
    </div>
  )
}
