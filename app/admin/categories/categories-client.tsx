'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { slugify } from '@/lib/utils/slugify'
import type { MajorCategoryWithMinors, MinorCategory } from '@/lib/db/queries'

export default function CategoriesClient({
  initialCategories,
}: {
  initialCategories: MajorCategoryWithMinors[]
}) {
  const [categories, setCategories] = useState(initialCategories)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

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
  const [newMinorOrder, setNewMinorOrder] = useState('0')

  // Edit minor
  const [editMinor, setEditMinor] = useState<MinorCategory | null>(null)

  function toggleExpand(id: number) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
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
    }
    setEditMajorId(null)
  }

  async function deleteMajor(id: number, name: string) {
    if (!confirm(`Delete "${name}" and all its albums and photos?`)) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id))
    }
  }

  async function addMinor(majorId: number) {
    if (!newMinorName.trim()) return
    const res = await fetch(`/api/admin/categories/${majorId}/minor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newMinorName.trim(),
        slug: slugify(newMinorName),
        description: newMinorDescription,
        displayOrder: parseInt(newMinorOrder) || 0,
      }),
    })
    if (res.ok) {
      const newMinor = await res.json()
      setCategories((prev) =>
        prev.map((c) =>
          c.id === majorId ? { ...c, minors: [...c.minors, newMinor] } : c
        )
      )
    }
    setAddMinorForMajorId(null)
    setNewMinorName('')
    setNewMinorDescription('')
    setNewMinorOrder('0')
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
            ? { ...c, minors: c.minors.map((m) => (m.id === updated.id ? updated : m)) }
            : c
        )
      )
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
    }
  }

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Major category list */}
      {categories.map((major) => (
        <div key={major.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Major header */}
          <div className="flex items-center gap-2 px-4 py-3">
            <button onClick={() => toggleExpand(major.id)} className="text-slate-400 hover:text-slate-600">
              {expandedIds.has(major.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
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
                <span className="font-semibold text-slate-800 flex-1">{major.name}</span>
                <span className="text-xs text-slate-400 mr-2">{major.minors.length} albums</span>
                <button onClick={() => { setEditMajorId(major.id); setEditMajorName(major.name) }} className="text-slate-400 hover:text-slate-600 p-1"><Pencil size={14} /></button>
                <button onClick={() => deleteMajor(major.id, major.name)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={14} /></button>
              </>
            )}
          </div>

          {/* Minor categories */}
          {expandedIds.has(major.id) && (
            <div className="border-t border-gray-100 px-4 py-3 space-y-2">
              {major.minors.map((minor) => (
                <div key={minor.id} className="pl-4">
                  {editMinor?.id === minor.id ? (
                    <div className="space-y-2 bg-gray-50 rounded p-3">
                      <input
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-slate-400"
                        value={editMinor.name}
                        onChange={(e) => setEditMinor({ ...editMinor, name: e.target.value, slug: slugify(e.target.value) })}
                        placeholder="Album name"
                      />
                      <textarea
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full h-20 resize-none focus:outline-none focus:ring-1 focus:ring-slate-400"
                        value={editMinor.description ?? ''}
                        onChange={(e) => setEditMinor({ ...editMinor, description: e.target.value })}
                        placeholder="Description (markdown supported)"
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-500">Order:</label>
                        <input
                          type="number"
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-20 focus:outline-none focus:ring-1 focus:ring-slate-400"
                          value={editMinor.display_order}
                          onChange={(e) => setEditMinor({ ...editMinor, display_order: parseInt(e.target.value) || 0 })}
                        />
                        <div className="flex gap-2 ml-auto">
                          <button onClick={() => saveMinorEdit(major.id)} className="text-xs bg-slate-800 text-white px-3 py-1 rounded hover:bg-slate-700">Save</button>
                          <button onClick={() => setEditMinor(null)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 py-1">
                      <span className="text-sm text-slate-700 flex-1">{minor.name}</span>
                      <span className="text-xs text-slate-400 font-mono">{minor.slug}</span>
                      <button onClick={() => setEditMinor(minor)} className="text-slate-300 hover:text-slate-600 p-1"><Pencil size={13} /></button>
                      <button onClick={() => deleteMinor(major.id, minor.id, minor.name)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={13} /></button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add minor form */}
              {addMinorForMajorId === major.id ? (
                <div className="pl-4 mt-2 space-y-2 bg-gray-50 rounded p-3">
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
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500">Order:</label>
                    <input
                      type="number"
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-20 focus:outline-none focus:ring-1 focus:ring-slate-400"
                      value={newMinorOrder}
                      onChange={(e) => setNewMinorOrder(e.target.value)}
                    />
                    <div className="flex gap-2 ml-auto">
                      <button onClick={() => addMinor(major.id)} className="text-xs bg-slate-800 text-white px-3 py-1 rounded hover:bg-slate-700">Add Album</button>
                      <button onClick={() => setAddMinorForMajorId(null)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setAddMinorForMajorId(major.id); setExpandedIds((prev) => new Set(prev).add(major.id)) }}
                  className="pl-4 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 py-1"
                >
                  <Plus size={12} /> Add album
                </button>
              )}
            </div>
          )}
        </div>
      ))}

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
