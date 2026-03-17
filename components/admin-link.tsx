'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminLink() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return (
    <Link
      href="/admin"
      className="fixed bottom-4 left-4 text-xs text-stone-400 hover:text-stone-600 transition-colors z-40"
    >
      Admin
    </Link>
  )
}
