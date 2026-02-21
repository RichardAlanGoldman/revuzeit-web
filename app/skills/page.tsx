import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ArrowLeft } from "lucide-react"

// ── Skills Data ───────────────────────────────────────────────────────────────

const intro = "A collection of technical and professional tools developed across a career in software, retail, and operations."

const skillSections = [
  {
    title: "Development & Programming",
    items: ["Python 3", "Jupyter Notebooks", "HTML / CSS", "JavaScript (fundamentals)", "Web Development with Gemini & Claude Code"],
  },
  {
    title: "Apple Retail Tools",
    items: ["EasyPay", "Mobile Genius", "Concierge", "Prism", "Toolbox"],
  },
  {
    title: "Project & Quality Management",
    items: ["Wrike", "Mozaic", "Caliber", "Radar"],
  },
  {
    title: "Collaboration & Communication",
    items: ["Slack", "Webex", "Quip", "Chorus"],
  },
  {
    title: "Productivity",
    items: ["Pages / Numbers / Keynote"],
  },
]

// ── Page Component ────────────────────────────────────────────────────────────

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to home</span>
        </Link>

        {/* Page header */}
        <div className="mb-10 border-b border-slate-700 pb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Skills</h1>
          <p className="text-slate-400 text-sm">{intro}</p>
        </div>

        {/* Skill sections */}
        <div className="space-y-12">
          {skillSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold text-blue-400 mb-6">{section.title}</h2>
              <ul className="space-y-4">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-slate-300 leading-relaxed">
                    <span className="text-blue-400 shrink-0 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
