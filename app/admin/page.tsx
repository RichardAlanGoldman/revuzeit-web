import Link from 'next/link'
import { FolderOpen, ImageIcon, FolderTree } from 'lucide-react'
import { getCounts } from '@/lib/db/queries'

export default async function AdminDashboard() {
  let counts = { majors: 0, minors: 0, photos: 0 }
  try {
    counts = await getCounts()
  } catch {
    // DB may not be migrated yet
  }

  const stats = [
    { label: 'Major Categories', value: counts.majors, icon: FolderTree, href: '/admin/categories' },
    { label: 'Albums', value: counts.minors, icon: FolderOpen, href: '/admin/categories' },
    { label: 'Photos', value: counts.photos, icon: ImageIcon, href: '/admin/photos' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon size={18} className="text-slate-500" />
              <span className="text-sm text-slate-500">{label}</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/categories"
          className="bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          Manage Categories
        </Link>
        <Link
          href="/admin/photos/upload"
          className="bg-amber-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors"
        >
          Upload Photos
        </Link>
      </div>
    </div>
  )
}
