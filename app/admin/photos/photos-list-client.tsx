'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Pencil, Trash2, X, Check } from 'lucide-react'
import type { PhotoWithCategory, MajorCategoryWithMinors } from '@/lib/db/queries'

export default function PhotosListClient({
  initialPhotos,
  categories,
}: {
  initialPhotos: PhotoWithCategory[]
  categories: MajorCategoryWithMinors[]
}) {
  const router = useRouter()
  const [photos, setPhotos] = useState(initialPhotos)
  const [filterMinorId, setFilterMinorId] = useState<string>('')
  const [editPhotoId, setEditPhotoId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<{
    caption: string
    location_name: string
    display_order: string
  }>({ caption: '', location_name: '', display_order: '0' })

  const allMinors = categories.flatMap((major) =>
    major.minors.map((minor) => ({
      ...minor,
      majorName: major.name,
    }))
  )

  const filtered = filterMinorId
    ? photos.filter((p) => p.minor_category_id === parseInt(filterMinorId))
    : photos

  function startEdit(photo: PhotoWithCategory) {
    setEditPhotoId(photo.id)
    setEditValues({
      caption: photo.caption ?? '',
      location_name: photo.location_name ?? '',
      display_order: String(photo.display_order),
    })
  }

  async function saveEdit(id: number) {
    const res = await fetch(`/api/admin/photos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caption: editValues.caption || null,
        location_name: editValues.location_name || null,
        display_order: parseInt(editValues.display_order) || 0,
      }),
    })
    if (res.ok) {
      setEditPhotoId(null)
      router.refresh()
    }
  }

  async function deletePhoto(id: number) {
    if (!confirm('Delete this photo? This cannot be undone.')) return
    await fetch(`/api/admin/photos/${id}`, { method: 'DELETE' })
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-4">
        <select
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={filterMinorId}
          onChange={(e) => setFilterMinorId(e.target.value)}
        >
          <option value="">All albums</option>
          {allMinors.map((minor) => (
            <option key={minor.id} value={minor.id}>
              {minor.majorName} → {minor.name}
            </option>
          ))}
        </select>
        <span className="ml-3 text-sm text-slate-500">{filtered.length} photos</span>
      </div>

      {/* Photo grid */}
      {filtered.length === 0 ? (
        <p className="text-slate-400 text-sm">No photos found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                  src={photo.blob_url}
                  alt={photo.caption ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="p-3">
                {editPhotoId === photo.id ? (
                  <div className="space-y-2">
                    <input
                      className="border border-gray-300 rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-slate-400"
                      value={editValues.caption}
                      onChange={(e) => setEditValues({ ...editValues, caption: e.target.value })}
                      placeholder="Caption"
                    />
                    <input
                      className="border border-gray-300 rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-slate-400"
                      value={editValues.location_name}
                      onChange={(e) => setEditValues({ ...editValues, location_name: e.target.value })}
                      placeholder="Location"
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-500">Order:</label>
                      <input
                        type="number"
                        className="border border-gray-300 rounded px-2 py-1 text-xs w-16 focus:outline-none focus:ring-1 focus:ring-slate-400"
                        value={editValues.display_order}
                        onChange={(e) => setEditValues({ ...editValues, display_order: e.target.value })}
                      />
                      <div className="ml-auto flex gap-1">
                        <button onClick={() => saveEdit(photo.id)} className="text-green-600 hover:text-green-800 p-1"><Check size={14} /></button>
                        <button onClick={() => setEditPhotoId(null)} className="text-slate-400 hover:text-slate-600 p-1"><X size={14} /></button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">
                          {photo.caption || <span className="text-slate-400 italic">No caption</span>}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {photo.major_name} → {photo.minor_name}
                        </p>
                        {photo.location_name && (
                          <p className="text-xs text-slate-400">{photo.location_name}</p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => startEdit(photo)} className="text-slate-400 hover:text-slate-600 p-1"><Pencil size={13} /></button>
                        <button onClick={() => deletePhoto(photo.id)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
