"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { professionalLinks, personalLinks, isDarkRoute } from "@/lib/navigation"

export function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith("/admin")) return null

  const dark = isDarkRoute(pathname)

  const headingClass = cn(
    "text-xs font-semibold uppercase tracking-widest mb-3",
    dark ? "text-slate-500" : "text-stone-400"
  )
  const linkClass = cn(
    "text-sm transition-colors",
    dark ? "text-slate-400 hover:text-white" : "text-stone-500 hover:text-stone-900"
  )

  return (
    <footer
      className={cn(
        "border-t",
        dark ? "bg-slate-950 border-slate-800" : "bg-stone-100 border-stone-200"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className={cn("font-semibold text-lg", dark ? "text-white" : "text-stone-900")}>
              Richard Goldman
            </p>
            <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-slate-400" : "text-stone-500")}>
              A career and a life, collected in one place.
            </p>
          </div>

          {/* Professional links */}
          <div>
            <p className={headingClass}>Professional</p>
            <ul className="space-y-2">
              {professionalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Personal links */}
          <div>
            <p className={headingClass}>Personal</p>
            <ul className="space-y-2">
              {personalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={cn(
            "mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3",
            dark ? "border-slate-800" : "border-stone-200"
          )}
        >
          <p className={cn("text-xs", dark ? "text-slate-500" : "text-stone-400")}>
            © {new Date().getFullYear()} Richard Goldman
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className={cn("text-xs", linkClass)}>
              Built with Gemini &amp; Claude — the story
            </Link>
            <Link href="/admin" className={cn("text-xs", linkClass)}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
