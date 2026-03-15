'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from './lightbox'
import type { Photo } from '@/lib/db/queries'

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (photos.length === 0) {
    return <p className="text-stone-400 text-sm">No photos in this album yet.</p>
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-square bg-stone-100 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <Image
              src={photo.blob_url}
              alt={photo.caption ?? ''}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Caption overlay on hover */}
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs line-clamp-2">{photo.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          initialIndex={lightboxIndex}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  )
}
