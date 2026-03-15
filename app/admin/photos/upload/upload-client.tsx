'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, CheckCircle } from 'lucide-react'
import type { MajorCategoryWithMinors } from '@/lib/db/queries'
import { slugify } from '@/lib/utils/slugify'

type ExifData = {
  dateTaken: string | null
  latitude: number | null
  longitude: number | null
  locationName: string | null
}

type UploadState = 'idle' | 'extracting' | 'ready' | 'uploading' | 'success' | 'error'

export default function UploadClient({ categories: initialCategories }: { categories: MajorCategoryWithMinors[] }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [categories, setCategories] = useState(initialCategories)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [state, setState] = useState<UploadState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // EXIF / metadata fields
  const [minorCategoryId, setMinorCategoryId] = useState('')
  const [caption, setCaption] = useState('')
  const [locationName, setLocationName] = useState('')
  const [dateTaken, setDateTaken] = useState('')
  const [displayOrder, setDisplayOrder] = useState('0')
  const [isDragging, setIsDragging] = useState(false)

  // New album inline form
  const [showNewAlbum, setShowNewAlbum] = useState(false)
  const [newAlbumMajorId, setNewAlbumMajorId] = useState(categories[0]?.id.toString() ?? '')
  const [newAlbumName, setNewAlbumName] = useState('')
  const [newAlbumSaving, setNewAlbumSaving] = useState(false)
  const [newAlbumError, setNewAlbumError] = useState('')

  const allMinors = categories.flatMap((major) =>
    major.minors.map((minor) => ({ ...minor, majorName: major.name }))
  )

  async function processFile(selectedFile: File) {
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setState('extracting')
    setLocationName('')
    setDateTaken('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const res = await fetch('/api/admin/photos/extract-exif', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const exif: ExifData = await res.json()
        if (exif.dateTaken) {
          setDateTaken(new Date(exif.dateTaken).toISOString().slice(0, 16))
        }
        if (exif.locationName) setLocationName(exif.locationName)
      }
    } catch {
      // Non-fatal — user can fill in manually
    }

    setState('ready')
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) processFile(selected)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && /\.(heic|jpg|jpeg|png|webp)$/i.test(dropped.name)) {
      processFile(dropped)
    }
  }, [])

  function reset() {
    setFile(null)
    setPreview(null)
    setState('idle')
    setCaption('')
    setLocationName('')
    setDateTaken('')
    setDisplayOrder('0')
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleCreateAlbum() {
    if (!newAlbumName.trim() || !newAlbumMajorId) return
    setNewAlbumSaving(true)
    setNewAlbumError('')

    try {
      const res = await fetch(`/api/admin/categories/${newAlbumMajorId}/minor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAlbumName.trim(),
          slug: slugify(newAlbumName.trim()),
          description: '',
          display_order: 0,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setNewAlbumError(data.error ?? 'Failed to create album')
        return
      }

      const newMinor = await res.json()
      const majorId = parseInt(newAlbumMajorId)

      setCategories((prev) =>
        prev.map((c) =>
          c.id === majorId ? { ...c, minors: [...c.minors, newMinor] } : c
        )
      )

      setMinorCategoryId(newMinor.id.toString())
      setNewAlbumName('')
      setShowNewAlbum(false)
    } catch {
      setNewAlbumError('Failed to create album')
    } finally {
      setNewAlbumSaving(false)
    }
  }

  async function handleUpload() {
    if (!file || !minorCategoryId) return
    setState('uploading')
    setErrorMsg('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('minorCategoryId', minorCategoryId)
      formData.append('caption', caption)
      formData.append('locationName', locationName)
      formData.append('dateTaken', dateTaken)
      formData.append('displayOrder', displayOrder)

      const res = await fetch('/api/admin/photos/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setState('success')
        router.refresh()
      } else {
        const data = await res.json()
        setErrorMsg(data.error ?? 'Upload failed')
        setState('error')
      }
    } catch {
      setErrorMsg('Upload failed. Please try again.')
      setState('error')
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Drop zone */}
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-amber-400 bg-amber-50'
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
        >
          <Upload size={32} className="mx-auto mb-3 text-slate-400" />
          <p className="text-sm font-medium text-slate-600">Drop a photo here or click to browse</p>
          <p className="text-xs text-slate-400 mt-1">HEIC, JPG, PNG, WebP accepted</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".heic,.jpg,.jpeg,.png,.webp,image/heic,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Preview */}
          <div className="relative bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview!} alt="Preview" className="w-full max-h-64 object-contain" />
            <button
              onClick={reset}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
            >
              <X size={14} />
            </button>
          </div>

          {/* Metadata form */}
          <div className="p-4 space-y-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              {state === 'extracting' ? 'Extracting metadata…' : file.name}
            </p>

            {/* Album */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Album *</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                value={showNewAlbum ? '__new__' : minorCategoryId}
                onChange={(e) => {
                  if (e.target.value === '__new__') {
                    setShowNewAlbum(true)
                    setMinorCategoryId('')
                  } else {
                    setShowNewAlbum(false)
                    setMinorCategoryId(e.target.value)
                  }
                }}
                required
              >
                <option value="">Select an album…</option>
                <option value="__new__">+ New album…</option>
                {allMinors.map((minor) => (
                  <option key={minor.id} value={minor.id}>
                    {minor.majorName} → {minor.name}
                  </option>
                ))}
              </select>

              {showNewAlbum && (
                <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Create new album</p>

                  {/* Major category */}
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    value={newAlbumMajorId}
                    onChange={(e) => setNewAlbumMajorId(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  {/* Album name */}
                  <input
                    type="text"
                    placeholder="Album name…"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleCreateAlbum() }}
                  />

                  {newAlbumError && <p className="text-xs text-red-600">{newAlbumError}</p>}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateAlbum}
                      disabled={!newAlbumName.trim() || newAlbumSaving}
                      className="flex-1 bg-amber-500 text-white py-1.5 px-3 rounded text-sm font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {newAlbumSaving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowNewAlbum(false); setNewAlbumName(''); setNewAlbumError('') }}
                      className="px-3 py-1.5 rounded text-sm text-slate-600 hover:bg-stone-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Caption</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe this photo…"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Miami, Florida"
              />
            </div>

            {/* Date taken + display order */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date Taken</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  value={dateTaken}
                  onChange={(e) => setDateTaken(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

            {state === 'success' ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">Uploaded successfully!</span>
                <button onClick={reset} className="ml-auto text-sm text-slate-500 hover:text-slate-700 underline">
                  Upload another
                </button>
              </div>
            ) : (
              <button
                onClick={handleUpload}
                disabled={!minorCategoryId || state === 'uploading' || state === 'extracting'}
                className="w-full bg-amber-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {state === 'uploading' ? 'Uploading…' : 'Upload Photo'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
