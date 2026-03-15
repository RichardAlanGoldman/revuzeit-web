import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import {
  getMajorCategoryBySlug,
  getMinorCategoryBySlug,
  getPhotosByMinorCategory,
} from '@/lib/db/queries'
import PhotoGrid from '@/components/gallery/photo-grid'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ majorSlug: string; minorSlug: string }>
}) {
  const { majorSlug, minorSlug } = await params
  const major = await getMajorCategoryBySlug(majorSlug)
  if (!major) return { title: 'Gallery' }
  const minor = await getMinorCategoryBySlug(major.id, minorSlug)
  return {
    title: minor ? `${minor.name} | ${major.name} | Richard Goldman` : 'Gallery',
  }
}

export default async function MinorCategoryPage({
  params,
}: {
  params: Promise<{ majorSlug: string; minorSlug: string }>
}) {
  const { majorSlug, minorSlug } = await params

  const major = await getMajorCategoryBySlug(majorSlug)
  if (!major) notFound()

  const minor = await getMinorCategoryBySlug(major.id, minorSlug)
  if (!minor) notFound()

  const photos = await getPhotosByMinorCategory(minor.id)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href={`/gallery/${majorSlug}`}
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-amber-700 mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to {major.name}
      </Link>

      <h1 className="text-3xl font-bold text-stone-800 mb-2">{minor.name}</h1>

      {/* Description (markdown) */}
      {minor.description && (
        <div className="prose prose-stone max-w-none mb-8 text-stone-600">
          <ReactMarkdown>{minor.description}</ReactMarkdown>
        </div>
      )}

      {/* Photo grid */}
      <PhotoGrid photos={photos} />
    </div>
  )
}
