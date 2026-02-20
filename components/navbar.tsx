"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

type NavLink = { name: string; href: string; isRoute?: boolean }

const professionalLinks: NavLink[] = [
  { name: "Resume", href: "/resume", isRoute: true },
  { name: "Experience", href: "/experience", isRoute: true },
  { name: "Skills", href: "#skills" },
  { name: "Goals", href: "#goals" },
]

const personalLinks: NavLink[] = [
  { name: "Biography", href: "#biography" },
  { name: "Family", href: "#family" },
  { name: "Travel", href: "#travel" },
  { name: "Restaurants", href: "#restaurants" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Name */}
          <div className="font-semibold text-lg text-slate-900">Richard Goldman</div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {professionalLinks.map((link) => {
              const Comp = link.isRoute ? Link : "a"
              return (
                <Comp
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 relative group transition-colors"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                </Comp>
              )
            })}
            <div className="w-px h-6 bg-slate-300" />
            {personalLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-700 hover:text-slate-900 relative group transition-colors"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/20 backdrop-blur-md bg-white/70">
          {/* Professional Links Block */}
          <div className="bg-slate-700 px-4 py-3">
            <div className="text-xs font-semibold text-slate-300 mb-2">Professional</div>
            <div className="space-y-1">
              {professionalLinks.map((link) => {
                const Comp = link.isRoute ? Link : "a"
                return (
                  <Comp
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-slate-600 transition-colors"
                  >
                    {link.name}
                  </Comp>
                )
              })}
            </div>
          </div>

          {/* Personal Links Block */}
          <div className="bg-stone-200 px-4 py-3">
            <div className="text-xs font-semibold text-stone-600 mb-2">Personal</div>
            <div className="space-y-1">
              {personalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-300 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
