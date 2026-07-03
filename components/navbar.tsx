"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { professionalLinks, personalLinks, isDarkRoute, type NavLink } from "@/lib/navigation"

function DesktopLink({ link, dark, accent }: { link: NavLink; dark: boolean; accent: "blue" | "amber" }) {
  return (
    <Link
      href={link.href}
      className={cn(
        "text-sm font-medium relative group transition-colors",
        dark ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900"
      )}
    >
      {link.name}
      <span
        className={cn(
          "absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300",
          accent === "blue" ? "bg-blue-500" : "bg-amber-500"
        )}
      />
    </Link>
  )
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const dark = isDarkRoute(pathname)

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b shadow-sm",
        dark ? "bg-slate-900/70 border-slate-700/60" : "bg-white/70 border-white/20"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Name */}
          <Link
            href="/"
            className={cn(
              "font-semibold text-lg transition-colors",
              dark ? "text-white hover:text-slate-300" : "text-slate-900 hover:text-slate-600"
            )}
          >
            Richard Goldman
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {professionalLinks.map((link) => (
              <DesktopLink key={link.name} link={link} dark={dark} accent="blue" />
            ))}
            <div className={cn("w-px h-6", dark ? "bg-slate-600" : "bg-slate-300")} />
            {personalLinks.map((link) => (
              <DesktopLink key={link.name} link={link} dark={dark} accent="amber" />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "lg:hidden p-2 rounded-md transition-colors",
              dark
                ? "text-slate-300 hover:text-white hover:bg-slate-800"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            )}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className={cn(
            "lg:hidden border-t backdrop-blur-md",
            dark ? "border-slate-700/60 bg-slate-900/70" : "border-white/20 bg-white/70"
          )}
        >
          {/* Professional Links Block */}
          <div className="bg-slate-700 px-4 py-3">
            <div className="text-xs font-semibold text-slate-300 mb-2">Professional</div>
            <div className="space-y-1">
              {professionalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-slate-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Personal Links Block */}
          <div className="bg-stone-200 px-4 py-3">
            <div className="text-xs font-semibold text-stone-600 mb-2">Personal</div>
            <div className="space-y-1">
              {personalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-300 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
