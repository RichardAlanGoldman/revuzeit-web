import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ArrowLeft } from "lucide-react"

// ── Goals Data ────────────────────────────────────────────────────────────────

const intro = [
  "I've had a long and successful career in a variety of occupations.",
  "Right now I'm semi-retired after spending twenty-five years in the software business followed by owning a bookstore for 22 years and now working at Apple, part-time in the Apple Shadyside store.",
  "In all likelihood, my job at Apple will be my last one, but I've had a couple of Career Experiences at Apple that have allowed me to learn new skills, meet people in a variety of roles, and develop further as a person. Going forward I'd think of my goals in the light of personal and professional.",
]

const goalSections = [
  {
    title: "Professional Goals",
    items: [
      "I'd like to continue perfecting my web development skills through the continued building of the revuzeit site, adding more features and content.",
      "I've spent time learning Python — I'd like to put it to use by developing a useful Mac app.",
      "I'd like a Career Experience that would allow me to use my writing skills. I've spent most of my life writing: software specs, documentation, the bookstore newsletter; and I'd like to develop that ability through a Career Experience.",
    ],
  },
  {
    title: "Personal Goals",
    items: [
      "I've studied several languages over the years, most recently Spanish. I'd like to pursue Spanish to the point of fluency; perhaps through immersion in a Spanish-speaking country.",
      "I'd like to flesh out this website with photos and recollections about me, Mary Alice, and my family.",
    ],
  },
]

// ── Page Component ────────────────────────────────────────────────────────────

export default function GoalsPage() {
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
          <h1 className="text-4xl font-bold text-white mb-2">Goals</h1>
          <p className="text-slate-400 text-sm">
            Professional aspirations and personal ambitions
          </p>
        </div>

        {/* Intro paragraphs */}
        <div className="space-y-4 mb-12">
          {intro.map((paragraph, i) => (
            <p key={i} className="text-slate-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Goal sections */}
        <div className="space-y-12">
          {goalSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold text-blue-400 mb-6">
                {section.title}
              </h2>
              <ul className="space-y-4">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-300 leading-relaxed">
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
