import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Camera, Images } from 'lucide-react'
import { getMajorCategoryBySlug, getMinorCategoriesWithMeta } from '@/lib/db/queries'

export async function generateMetadata({ params }: { params: Promise<{ majorSlug: string }> }) {
  const { majorSlug } = await params
  const major = await getMajorCategoryBySlug(majorSlug)
  return { title: major ? major.name : 'Gallery' }
}

export default async function MajorCategoryPage({
  params,
}: {
  params: Promise<{ majorSlug: string }>
}) {
  const { majorSlug } = await params
  const major = await getMajorCategoryBySlug(majorSlug)
  if (!major) notFound()

  const minors = await getMinorCategoriesWithMeta(major.id)

  return (
    <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-amber-700 mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to home
      </Link>

      <h1 className="text-4xl font-bold tracking-tight text-stone-800 mb-8">{major.name}</h1>

      {minors.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-dashed border-stone-300 bg-white/60">
          <Camera size={36} className="text-stone-300 mb-4" />
          <p className="text-stone-600 font-medium">Nothing here yet</p>
          <p className="text-sm text-stone-400 mt-1">
            Photos for {major.name.toLowerCase()} are on their way — check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {minors.map((minor) => (
            <Link
              key={minor.id}
              href={`/gallery/${majorSlug}/${minor.slug}`}
              className="group bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:border-amber-400/70 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] bg-stone-100">
                {minor.cover_url ? (
                  <Image
                    src={minor.cover_url}
                    alt={minor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Images size={32} className="text-stone-300" />
                  </div>
                )}
                {minor.photo_count > 0 && (
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                    <Camera size={11} />
                    {minor.photo_count}
                  </span>
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
