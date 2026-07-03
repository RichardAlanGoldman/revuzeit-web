'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Camera,
  Images,
  ExternalLink,
} from 'lucide-react'
import { slugify } from '@/lib/utils/slugify'
import type { MajorCategoryWithMinorMeta, MinorCategoryWithMeta } from '@/lib/db/queries'

export default function CategoriesClient({
  initialCategories,
}: {
  initialCategories: MajorCategoryWithMinorMeta[]
}) {
  const [categories, setCategories] = useState(initialCategories)
  // Expanded by default so the whole structure is visible at a glance
  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string | null>(null)

  // Add major form
  const [showAddMajor, setShowAddMajor] = useState(false)
  const [newMajorName, setNewMajorName] = useState('')

  // Edit major
  const [editMajorId, setEditMajorId] = useState<number | null>(null)
  const [editMajorName, setEditMajorName] = useState('')

  // Add minor
  const [addMinorForMajorId, setAddMinorForMajorId] = useState<number | null>(null)
  const [newMinorName, setNewMinorName] = useState('')
  const [newMinorDescription, setNewMinorDescription] = useState('')

  // Edit minor
  const [editMinor, setEditMinor] = useState<MinorCategoryWithMeta | null>(null)

  // Album ids with an in-flight reorder request
  const [reordering, setReordering] = useState(false)

  function toggleCollapse(id: number) {
    setCollapsedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function flashError(message: string) {
    setError(message)
    setTimeout(() => setError(null), 4000)
  }

  async function addMajor() {
    if (!newMajorName.trim()) return
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newMajorName.trim(), slug: slugify(newMajorName) }),
    })
    if (res.ok) {
      const newCategory = await res.json()
      setCategories((prev) => [...prev, { ...newCategory, minors: [] }])
      setNewMajorName('')
      setShowAddMajor(false)
    } else {
      flashError('Could not add category.')
    }
  }

  async function saveMajorEdit(id: number) {
    if (!editMajorName.trim()) return
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editMajorName.trim(), slug: slugify(editMajorName) }),
    })
    if (res.ok) {
      const updated = await res.json()
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: updated.name, slug: updated.slug } : c))
      )
    } else {
      flashError('Could not rename category.')
    }
    setEditMajorId(null)
  }

  async function deleteMajor(id: number, name: string) {
    if (!confirm(`Delete "${name}" and all its albums and photos?`)) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } else {
      flashError('Could not delete category.')
    }
  }

  async function addMinor(majorId: number) {
    if (!newMinorName.trim()) return
    const major = categories.find((c) => c.id === majorId)
    const res = await fetch(`/api/admin/categories/${majorId}/minor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newMinorName.trim(),
        slug: slugify(newMinorName),
        description: newMinorDescription,
        displayOrder: major?.minors.length ?? 0,
      }),
    })
    if (res.ok) {
      const newMinor = await res.json()
      setCategories((prev) =>
        prev.map((c) =>
          c.id === majorId
            ? { ...c, minors: [...c.minors, { ...newMinor, photo_count: 0, cover_url: null }] }
            : c
        )
      )
    } else {
      flashError('Could not add album.')
    }
    setAddMinorForMajorId(null)
    setNewMinorName('')
    setNewMinorDescription('')
  }

  async function saveMinorEdit(majorId: number) {
    if (!editMinor) return
    const res = await fetch(`/api/admin/categories/${majorId}/minor/${editMinor.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editMinor.name,
        slug: editMinor.slug,
        description: editMinor.description,
        display_order: editMinor.display_order,
      }),
    })
    if (res.ok) {
      const updated = await res.json()
      setCategories((prev) =>
        prev.map((c) =>
          c.id === majorId
            ? {
                ...c,
                minors: c.minors.map((m) =>
                  m.id === updated.id
                    ? { ...updated, photo_count: m.photo_count, cover_url: m.cover_url }
                    : m
                ),
              }
            : c
        )
      )
    } else {
      flashError('Could not save album changes.')
    }
    setEditMinor(null)
  }

  async function deleteMinor(majorId: number, minorId: number, name: string) {
    if (!confirm(`Delete album "${name}" and all its photos?`)) return
    const res = await fetch(`/api/admin/categories/${majorId}/minor/${minorId}`, { method: 'DELETE' })
    if (res.ok) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === majorId ? { ...c, minors: c.minors.filter((m) => m.id !== minorId) } : c
        )
      )
    } else {
      flashError('Could not delete album.')
    }
  }

  async function moveMinor(majorId: number, index: number, direction: -1 | 1) {
    const major = categories.find((c) => c.id === majorId)
    if (!major || reordering) return
    const target = index + direction
    if (target < 0 || target >= major.minors.length) return

    const reorderedMinors = [...major.minors]
    ;[reorderedMinors[index], reorderedMinors[target]] = [reorderedMinors[target], reorderedMinors[index]]
    const normalized = reorderedMinors.map((m, i) => ({ ...m, display_order: i }))
    const previous = categories

    setCategories((prev) =>
      prev.map((c) => (c.id === majorId ? { ...c, minors: normalized } : c))
    )
    setReordering(true)
    const res = await fetch(`/api/admin/categories/${majorId}/minor/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds: normalized.map((m) => m.id) }),
    })
    setReordering(false)
    if (!res.ok) {
      setCategories(previous)
      flashError('Could not save the new order.')
    }
  }

  return (
    <div className="space-y-4 max-w-4xl">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2">
          {error}
        </div>
      )}

      {/* Major category list */}
      {categories.map((major) => {
        const collapsed = collapsedIds.has(major.id)
        const photoTotal = major.minors.reduce((sum, m) => sum + m.photo_count, 0)
        return (
          <div key={major.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Major header */}
            <div className="flex items-center gap-2 px-4 py-3">
              <button
                onClick={() => toggleCollapse(major.id)}
                className="text-slate-400 hover:text-slate-600"
                aria-label={collapsed ? 'Expand category' : 'Collapse category'}
              >
                {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
              </button>

              {editMajorId === major.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    value={editMajorName}
                    onChange={(e) => setEditMajorName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveMajorEdit(major.id)}
                    autoFocus
                  />
                  <button onClick={() => saveMajorEdit(major.id)} className="text-green-600 hover:text-green-800"><Check size={16} /></button>
                  <button onClick={() => setEditMajorId(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                </div>
              ) : (
                <>
                  <span className="font-semibold text-slate-800">{major.name}</span>
                  <Link
                    href={`/gallery/${major.slug}`}
                    target="_blank"
                    className="text-slate-300 hover:text-slate-600 p-1"
                    title="View on site"
                  >
                    <ExternalLink size={13} />
                  </Link>
                  <span className="text-xs text-slate-400 ml-auto mr-2">
                    {major.minors.length} {major.minors.length === 1 ? 'album' : 'albums'} · {photoTotal}{' '}
                    {photoTotal === 1 ? 'photo' : 'photos'}
                  </span>
                  <button onClick={() => { setEditMajorId(major.id); setEditMajorName(major.name) }} className="text-slate-400 hover:text-slate-600 p-1" title="Rename"><Pencil size={14} /></button>
                  <button onClick={() => deleteMajor(major.id, major.name)} className="text-slate-400 hover:text-red-500 p-1" title="Delete"><Trash2 size={14} /></button>
                </>
              )}
            </div>

            {/* Albums */}
            {!collapsed && (
              <div className="border-t border-gray-100 px-4 py-3 space-y-1">
                {major.minors.length === 0 && addMinorForMajorId !== major.id && (
                  <p className="text-xs text-slate-400 pl-1 py-1">No albums yet.</p>
                )}

                {major.minors.map((minor, index) => (
                  <div key={minor.id}>
                    {editMinor?.id === minor.id ? (
                      <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                        <input
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-slate-400"
                          value={editMinor.name}
                          onChange={(e) => setEditMinor({ ...editMinor, name: e.target.value, slug: slugify(e.target.value) })}
                          placeholder="Album name"
                          autoFocus
                        />
                        <textarea
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full h-20 resize-none focus:outline-none focus:ring-1 focus:ring-slate-400"
                          value={editMinor.description ?? ''}
                          onChange={(e) => setEditMinor({ ...editMinor, description: e.target.value })}
                          placeholder="Description (markdown supported)"
                        />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => saveMinorEdit(major.id)} className="text-xs bg-slate-800 text-white px-3 py-1 rounded hover:bg-slate-700">Save</button>
                          <button onClick={() => setEditMinor(null)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50">
                        {/* Reorder */}
                        <div className="flex flex-col">
                          <button
                            onClick={() => moveMinor(major.id, index, -1)}
                            disabled={index === 0 || reordering}
                            className="text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300"
                            aria-label="Move up"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            onClick={() => moveMinor(major.id, index, 1)}
                            disabled={index === major.minors.length - 1 || reordering}
                            className="text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300"
                            aria-label="Move down"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>

                        {/* Cover thumbnail */}
                        <div className="relative w-14 h-14 rounded-md overflow-hidden bg-stone-100 shrink-0">
                          {minor.cover_url ? (
                            <Image src={minor.cover_url} alt="" fill className="object-cover" sizes="56px" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Images size={18} className="text-stone-300" />
                            </div>
                          )}
                        </div>

                        {/* Name + description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-800 truncate">{minor.name}</span>
                            <Link
                              href={`/gallery/${major.slug}/${minor.slug}`}
                              target="_blank"
                              className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="View on site"
                            >
                              <ExternalLink size={12} />
                            </Link>
                          </div>
                          <p className="text-xs text-slate-400 truncate">
                            {minor.description || <span className="italic">No description</span>}
                          </p>
                        </div>

                        {/* Photo count */}
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 shrink-0">
                          <Camera size={12} />
                          {minor.photo_count}
                        </span>

                        {/* Actions */}
                        <button onClick={() => setEditMinor(minor)} className="text-slate-300 hover:text-slate-600 p-1" title="Edit"><Pencil size={13} /></button>
                        <button onClick={() => deleteMinor(major.id, minor.id, minor.name)} className="text-slate-300 hover:text-red-500 p-1" title="Delete"><Trash2 size={13} /></button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add minor form */}
                {addMinorForMajorId === major.id ? (
                  <div className="mt-2 space-y-2 bg-gray-50 rounded-lg p-3">
                    <input
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-slate-400"
                      value={newMinorName}
                      onChange={(e) => setNewMinorName(e.target.value)}
                      placeholder="Album name (e.g. Ireland 2010)"
                      autoFocus
                    />
                    <textarea
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full h-20 resize-none focus:outline-none focus:ring-1 focus:ring-slate-400"
                      value={newMinorDescription}
                      onChange={(e) => setNewMinorDescription(e.target.value)}
                      placeholder="Description (markdown supported)"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => addMinor(major.id)} className="text-xs bg-slate-800 text-white px-3 py-1 rounded hover:bg-slate-700">Add Album</button>
                      <button onClick={() => setAddMinorForMajorId(null)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAddMinorForMajorId(major.id)
                      setCollapsedIds((prev) => {
                        const next = new Set(prev)
                        next.delete(major.id)
                        return next
                      })
                    }}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 py-1 pl-1"
                  >
                    <Plus size={12} /> Add album
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Add major category */}
      {showAddMajor ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={newMajorName}
              onChange={(e) => setNewMajorName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMajor()}
              placeholder="Category name (e.g. Travel)"
              autoFocus
            />
            <button onClick={addMajor} className="bg-slate-800 text-white text-sm px-3 py-1 rounded hover:bg-slate-700">Add</button>
            <button onClick={() => { setShowAddMajor(false); setNewMajorName('') }} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddMajor(true)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 bg-white rounded-lg border border-dashed border-gray-300 px-4 py-3 w-full hover:border-slate-400 transition-colors"
        >
          <Plus size={16} /> Add major category
        </button>
      )}
    </div>
  )
}
