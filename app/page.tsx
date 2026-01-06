import { Navbar } from "@/components/navbar"
import { ProfessionalSection } from "@/components/professional-section"
import { PersonalSection } from "@/components/personal-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="min-h-screen pt-16 flex flex-col lg:flex-row">
        {/* Professional Side - Left on Desktop, Top on Mobile */}
        <ProfessionalSection />

        {/* Personal Side - Right on Desktop, Bottom on Mobile */}
        <PersonalSection />
      </main>
    </div>
  )
}