'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react'
import type { Photo } from '@/lib/db/queries'

type LightboxProps = {
  photos: Photo[]
  initialIndex: number
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function Lightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const photo = photos[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(currentIndex - 1)
      if (e.key === 'ArrowRight' && hasNext) onNavigate(currentIndex + 1)
    },
    [onClose, onNavigate, currentIndex, hasPrev, hasNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Prev */}
      {hasPrev && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-2 bg-black/30 rounded-full"
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1) }}
          aria-label="Previous photo"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Next */}
      {hasNext && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-2 bg-black/30 rounded-full"
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1) }}
          aria-label="Next photo"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-5xl max-h-[80vh] w-full mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[70vh]">
          <Image
            src={photo.blob_url}
            alt={photo.caption ?? ''}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Caption bar */}
        {(photo.caption || photo.location_name || photo.date_taken) && (
          <div className="bg-black/60 text-white px-4 py-3 rounded-b">
            {photo.caption && <p className="text-sm">{photo.caption}</p>}
            <div className="flex items-center gap-4 mt-1">
              {photo.location_name && (
                <span className="flex items-center gap-1 text-xs text-white/60">
                  <MapPin size={11} />
                  {photo.location_name}
                </span>
              )}
              {photo.date_taken && (
                <span className="flex items-center gap-1 text-xs text-white/60">
                  <Calendar size={11} />
                  {new Date(photo.date_taken).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
