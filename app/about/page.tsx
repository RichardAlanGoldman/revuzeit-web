"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ArrowLeft, X } from "lucide-react"

// ── Tech Stack Data ───────────────────────────────────────────────────────────

const techStack = [
  {
    category: "Framework & Language",
    items: [
      { name: "Next.js 16 with App Router", description: "The framework that powers the site" },
      { name: "React 19", description: "The UI library Next.js is built on" },
      { name: "TypeScript", description: "Adds type safety to the JavaScript code" },
    ],
  },
  {
    category: "Styling",
    items: [
      { name: "Tailwind CSS v4", description: "Utility-first CSS framework used for all styling" },
      { name: "OKLCH color system", description: "A modern color format used for the site's theme" },
    ],
  },
  {
    category: "Components & Icons",
    items: [
      { name: "Radix UI", description: "Accessible, unstyled UI primitives" },
      { name: "Lucide React", description: "The icon library used throughout the site" },
    ],
  },
  {
    category: "Hosting & Deployment",
    items: [
      { name: "GitHub", description: "All code is version-controlled here" },
      { name: "Vercel", description: "The site is deployed and hosted on Vercel, with automatic deployments on every push to the main branch" },
    ],
  },
  {
    category: "Development Tools",
    items: [
      { name: "Claude Code", description: "Anthropic's AI coding assistant, used for the majority of development" },
      { name: "VS Code", description: "Used to maintain the source and host Claude Code" },
      { name: "Gemini", description: "Google's AI assistant, used in the early phases of the project" },
    ],
  },
]

// ── Tech Stack Modal ──────────────────────────────────────────────────────────

function TechStackModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700 rounded-t-xl">
          <h2 className="text-lg font-semibold text-white">The Technology Stack</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content */}
        <div className="px-6 py-5 space-y-6">
          {techStack.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">
                {section.category}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.name} className="flex gap-2 text-sm">
                    <span className="text-blue-400 shrink-0 mt-0.5">•</span>
                    <span>
                      <span className="text-white font-medium">{item.name}</span>
                      <span className="text-slate-400"> — {item.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [showTechStack, setShowTechStack] = useState(false)

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      {showTechStack && <TechStackModal onClose={() => setShowTechStack(false)} />}

      <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
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
          <h1 className="text-4xl font-bold text-white mb-2">About This Site</h1>
          <p className="text-slate-400 text-sm">My journey with Gemini and Claude.</p>
        </div>

        <div className="space-y-12 text-slate-300 leading-relaxed">

          {/* Why I Built It */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-5">Why I Built It</h2>
            <div className="space-y-4">
              <p>The revuzeit.com domain was established when my wife Mary Alice and I sold our bookstore, Mystery Lovers Bookshop in 2012. We thought that we would use it to post book reviews, notes about travel, restaurants and so forth.</p>
              <p>It turned out it wasn't so easy to develop a website on your own. I just never seemed to have the time to figure it out: the design, the coding, css, javascript, finding a host, paying for it and so on.</p>
              <p>Fast forward 13 years. Wow, whole new world.</p>
              <p>I'd been experimenting with AI from the initial release of ChatGPT and had tried out Claude, Perplexity and, more recently, Gemini. It made sense to put generative and agentic AI to work building my site — at last.</p>
            </div>
          </section>

          {/* How I Built It */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-5">How I Built It — The AI Journey</h2>
            <p>This site was built entirely through conversation with AI tools. I have not written any of the code directly. Instead, I described what I wanted, reviewed what was produced, and guided the direction. What you see here is the result of that collaboration.</p>
          </section>

          {/* Phase 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-5">Phase 1: Gemini (December 2025 – January 2026)</h2>
            <div className="space-y-4">
              <p>
                I began the project using Google's Gemini as my development partner. Conversation with Gemini led to use of Vercel as a server-less host, free for a Hobby account. Based on Gemini suggestions I adopted the tech stack using Next JS, React and Tailwind CSS.{" "}
                <button
                  onClick={() => setShowTechStack(true)}
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                >
                  You'll find full details of the tech stack here.
                </button>
              </p>
              <p>Starting from scratch in December 2025, the first steps were:</p>
              <ul className="space-y-2">
                {[
                  "December 2025: Initial project setup, placeholder page, and official launch of revuzeit.com",
                  "I used Figma to generate a design based on a prompt. With Gemini's help I copied and pasted the Figma-generated code into the proper modules in the VS Code IDE.",
                  "January 2026: First working version of the split-screen layout — the Professional side on the left, the Personal side on the right — which remains the core design of the home page today",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-blue-400 shrink-0 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Phase 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-5">Phase 2: Claude Code (February 2026 – Present)</h2>
            <div className="space-y-4">
              <p>One of the limitations of Gemini was its inability to directly update the source code in VS Code, leading to quite a bit of copy and paste.</p>
              <p>In February 2026 I switched to Anthropic's Claude Code, a terminal-based AI coding assistant because it directly integrated with VS Code. Development accelerated quickly:</p>
              <ul className="space-y-2">
                {[
                  "Resume page with a passcode-protected PDF download",
                  "Experience page with an accordion layout showing roles and accomplishments across Apple, Mystery Lovers Bookshop, and a software career",
                  "Goals page covering my professional and personal aspirations",
                  "Skills page with hover and tap-to-reveal descriptions for each tool and technology",
                  "Navigation improvements throughout the site",
                  "This About page",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-blue-400 shrink-0 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>I would estimate that these changes required less than 10 hours of my time.</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
