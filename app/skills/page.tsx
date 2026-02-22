"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Skills Data ───────────────────────────────────────────────────────────────

const intro = "A collection of technical and professional tools developed across a career in software, retail, and operations."

type Skill = { name: string; description: string }
type Section = { title: string; items: Skill[] }

const skillSections: Section[] = [
  {
    title: "Development & Programming",
    items: [
      { name: "Python 3", description: "A general-purpose programming language I've used for data analysis, automation, and building Mac applications in a classroom setting." },
      { name: "Jupyter Notebooks", description: "An interactive environment for writing and running Python code, ideal for exploration and documentation." },
      { name: "HTML / CSS", description: "The foundational languages of the web, used to structure and style pages like this one." },
      { name: "JavaScript (fundamentals)", description: "The programming language that powers interactivity on the web." },
      { name: "Web Development with Gemini & Claude Code", description: "AI-assisted development tools I've used to build and iterate on this site." },
    ],
  },
  {
    title: "Apple Retail Tools",
    items: [
      { name: "EasyPay", description: "Apple's mobile point-of-sale system, used by retail specialists to process transactions anywhere on the floor." },
      { name: "Mobile Genius", description: "Apple's internal system for creating and managing repairs, and customer cases." },
      { name: "Concierge", description: "Apple's customer check-in and queue management system used at the store entrance." },
      { name: "Prism", description: "Apple's tool for Voice Specialists in the Online Store to manage customer interactions." },
      { name: "Toolbox", description: "Apple's tool for managing orders in the Online Store." },
    ],
  },
  {
    title: "Project & Quality Management",
    items: [
      { name: "Wrike", description: "A project management platform used to plan, track, and coordinate projects or other group activities." },
      { name: "Mozaic", description: "Apple's system for managing CapEx project approval and scheduling." },
      { name: "Caliber", description: "A reporting dashboard to manage UAT testing progress." },
      { name: "Radar", description: "Apple's internal bug tracking system, used to log, monitor, and follow up on software defects." },
    ],
  },
  {
    title: "Collaboration & Communication",
    items: [
      { name: "Slack", description: "Team messaging platform used for real-time communication and remote support." },
      { name: "Webex", description: "Cisco's video conferencing platform, used extensively for remote meetings and training sessions." },
      { name: "Quip", description: "Salesforce's collaborative document and spreadsheet tool, used for shared documentation." },
      { name: "Chorus", description: "An Apple tool for making internal documentation available to teams." },
    ],
  },
  {
    title: "Productivity",
    items: [
      { name: "Pages / Numbers / Keynote", description: "Apple's iWork suite covering word processing, spreadsheets, and presentations." },
    ],
  },
]

// ── Skill Item with Tooltip ───────────────────────────────────────────────────

function SkillItem({ skill, open, onToggle }: { skill: Skill; open: boolean; onToggle: () => void }) {
  return (
    <li className="relative flex gap-3 text-slate-300 leading-relaxed">
      <span className="text-blue-400 shrink-0 mt-1">•</span>
      <span
        onClick={onToggle}
        onMouseEnter={onToggle}
        onMouseLeave={onToggle}
        className={cn(
          "cursor-default underline decoration-dotted decoration-slate-500 underline-offset-4 transition-colors duration-150",
          open ? "text-white" : ""
        )}
      >
        {skill.name}
      </span>

      {/* Tooltip */}
      <div className={cn(
        "pointer-events-none absolute left-6 bottom-full mb-2 z-10",
        "w-72 px-3 py-2 rounded-md",
        "bg-slate-700 border border-slate-600",
        "text-xs text-slate-200 leading-relaxed",
        "transition-all duration-150 shadow-lg",
        open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
      )}>
        {skill.description}
        {/* Arrow */}
        <div className="absolute left-4 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-700" />
      </div>
    </li>
  )
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function SkillsPage() {
  const [openSkill, setOpenSkill] = useState<string | null>(null)

  const toggle = (name: string) =>
    setOpenSkill((prev) => (prev === name ? null : name))

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
          <p className="text-slate-400 text-sm mt-1">(Tap or hover over any skill for a description.)</p>
        </div>

        {/* Skill sections */}
        <div className="space-y-12">
          {skillSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold text-blue-400 mb-6">{section.title}</h2>
              <ul className="space-y-4">
                {section.items.map((skill) => (
                  <SkillItem
                    key={skill.name}
                    skill={skill}
                    open={openSkill === skill.name}
                    onToggle={() => toggle(skill.name)}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>

      </main>
    </div>
  )
}
