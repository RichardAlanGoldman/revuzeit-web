import { getAllMajorCategoriesWithMinors, type MajorCategoryWithMinors } from '@/lib/db/queries'
import UploadClient from './upload-client'

export default async function UploadPage() {
  let categories: MajorCategoryWithMinors[] = []
  try {
    categories = await getAllMajorCategoriesWithMinors()
  } catch {
    // DB not yet migrated
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Upload Photos</h1>
      <UploadClient categories={categories} />
    </div>
  )
}
