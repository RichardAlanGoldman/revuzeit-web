import { getAllMajorCategoriesWithMinors, type MajorCategoryWithMinors } from '@/lib/db/queries'
import CategoriesClient from './categories-client'

export default async function CategoriesPage() {
  let categories: MajorCategoryWithMinors[] = []
  try {
    categories = await getAllMajorCategoriesWithMinors()
  } catch {
    // DB not yet migrated
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Categories</h1>
      <CategoriesClient initialCategories={categories} />
    </div>
  )
}
