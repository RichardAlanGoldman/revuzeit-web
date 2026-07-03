import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { ProfessionalSection } from "@/components/professional-section"
import { PersonalSection } from "@/components/personal-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <header className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-slate-400 mb-4">
            Pittsburgh, PA
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Richard Goldman
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            Twenty-five years in software, twenty-two years behind the counter at
            Mystery Lovers Bookshop, and now a Creative at Apple Shadyside.
            This is where I keep both the career and the life.
          </p>

          {/* Dual-identity accent: blue for professional, amber for personal */}
          <div className="mt-8 flex h-1 w-24 rounded-full overflow-hidden">
            <div className="w-1/2 bg-blue-500" />
            <div className="w-1/2 bg-amber-500" />
          </div>

          <Link
            href="/about"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Built with Gemini &amp; Claude — read the story
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row">
        {/* Professional Side - Left on Desktop, Top on Mobile */}
        <ProfessionalSection />

        {/* Personal Side - Right on Desktop, Bottom on Mobile */}
        <PersonalSection />
      </main>
    </div>
  )
}
