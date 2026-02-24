import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ProfessionalSection } from "@/components/professional-section"
import { PersonalSection } from "@/components/personal-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* About banner */}
      <div className="pt-16">
        <Link
          href="/about"
          className="group flex flex-col items-center py-3 px-4 text-center bg-slate-800 border-b border-slate-700 hover:bg-slate-750 transition-colors duration-200"
        >
          <span className="text-white text-xl font-semibold group-hover:text-blue-400 transition-colors duration-200">
            About this site...
          </span>
          <span className="text-white text-base group-hover:text-blue-300 transition-colors duration-200">
            My journey with Gemini and Claude.
          </span>
        </Link>
      </div>

      <main className="min-h-screen flex flex-col lg:flex-row">
        {/* Professional Side - Left on Desktop, Top on Mobile */}
        <ProfessionalSection />

        {/* Personal Side - Right on Desktop, Bottom on Mobile */}
        <PersonalSection />
      </main>
    </div>
  )
}