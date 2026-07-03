import { getAllMajorCategoriesWithMinorMeta, type MajorCategoryWithMinorMeta } from '@/lib/db/queries'
import CategoriesClient from './categories-client'

export default async function CategoriesPage() {
  let categories: MajorCategoryWithMinorMeta[] = []
  try {
    categories = await getAllMajorCategoriesWithMinorMeta()
  } catch {
    // DB not yet migrated
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-800 mb-1">Categories</h1>
      <p className="text-sm text-slate-500 mb-6">
        Rename categories and albums, edit descriptions, and drag albums into order with the arrows.
      </p>
      <CategoriesClient initialCategories={categories} />
    </div>
  )
}
