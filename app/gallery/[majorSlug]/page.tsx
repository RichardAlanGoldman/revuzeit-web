import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Images } from 'lucide-react'
import {
  getMajorCategoryBySlug,
  getMinorCategoriesByMajor,
  getFirstPhotoForMinorCategory,
} from '@/lib/db/queries'
import type { MinorCategory, Photo } from '@/lib/db/queries'

export async function generateMetadata({ params }: { params: Promise<{ majorSlug: string }> }) {
  const { majorSlug } = await params
  const major = await getMajorCategoryBySlug(majorSlug)
  return { title: major ? `${major.name} | Richard Goldman` : 'Gallery' }
}

type MinorWithPhoto = MinorCategory & { firstPhoto: Photo | null }

export default async function MajorCategoryPage({
  params,
}: {
  params: Promise<{ majorSlug: string }>
}) {
  const { majorSlug } = await params
  const major = await getMajorCategoryBySlug(majorSlug)
  if (!major) notFound()

  const minors = await getMinorCategoriesByMajor(major.id)
  const minorsWithPhotos: MinorWithPhoto[] = await Promise.all(
    minors.map(async (minor) => ({
      ...minor,
      firstPhoto: await getFirstPhotoForMinorCategory(minor.id),
    }))
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-amber-700 mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to home
      </Link>

      <h1 className="text-3xl font-bold text-stone-800 mb-8">{major.name}</h1>

      {minorsWithPhotos.length === 0 ? (
        <p className="text-stone-400 text-sm">No albums yet. Add some in the admin.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {minorsWithPhotos.map((minor) => (
            <Link
              key={minor.id}
              href={`/gallery/${majorSlug}/${minor.slug}`}
              className="group bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] bg-stone-100">
                {minor.firstPhoto ? (
                  <Image
                    src={minor.firstPhoto.blob_url}
                    alt={minor.firstPhoto.caption ?? minor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Images size={32} className="text-stone-300" />
                  </div>
                )}
              </div>
              {/* Card info */}
              <div className="p-4">
                <h2 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                  {minor.name}
                </h2>
                {minor.description && (
                  <p className="text-sm text-stone-500 mt-1 line-clamp-2">{minor.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
