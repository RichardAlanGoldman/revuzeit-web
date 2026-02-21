"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowLeft, Download, Lock, Eye, EyeOff } from "lucide-react"

// ── Resume Data ───────────────────────────────────────────────────────────────

const employmentHistory = [
  {
    company: "Apple, Inc.",
    roles: [
      { title: "Creative", location: "Apple Shadyside", period: "December 2024 – Present" },
      { title: "Product Specialist", location: "Apple Shadyside", period: "January 2017 – December 2024" },
      { title: "Tech Specialist", location: "Apple Shadyside", period: "September 2014 – January 2017" },
      { title: "Product Specialist", location: "Apple Shadyside", period: "August 2013 – September 2014" },
    ],
  },
  {
    company: "Mystery Lovers Bookshop",
    roles: [
      { title: "Owner", location: "Pittsburgh, PA", period: "October 1990 – July 2012" },
    ],
  },
]

const appleExperiences = [
  { title: "Test Lead, Finance Business Process Reengineering", setting: "Remote", period: "January – May 2024" },
  { title: "Instructor, Today at Apple", setting: "In-store", period: "April – September 2023" },
  { title: "Operations Specialist", setting: "In-store", period: "January – March 2023" },
  { title: "Voice Specialist, Retail Flex Pilot", setting: "Remote", period: "August – December 2021" },
  { title: "Retail Subject Matter Expert, RCC", setting: "Remote", period: "July 2020 – June 2021" },
  { title: "Junior QA Engineer, Apple Maps Client", setting: "Santa Clara", period: "January – June 2020" },
]

const skills = [
  "Python 3",
  "Jupyter Notebooks",
  "Wrike",
  "Mozaic",
  "Caliber",
  "Pages / Numbers / Keynote",
  "EasyPay",
  "Mobile Genius",
  "Concierge",
  "Prism",
  "Toolbox",
  "Radar",
  "Webex",
  "Slack",
  "Quip",
  "Chorus",
  "HTML / CSS",
  "JavaScript (fundamentals)",
  "Web Development with Gemini & Claude Code",
]

const education = [
  { year: "2013", institution: "edX / Stanford University", detail: "CS101 – Introduction to Computer Science (Java)" },
  { year: "2022", institution: "Berlitz School of Languages", detail: "Italian Level 1 & 2" },
  { year: "2023", institution: "Coursera / University of Michigan", detail: "Basics of Web Development & Coding — 5 course certificate" },
  { year: "2023", institution: "Coursera / Google", detail: "Foundations of UX Design (ongoing)" },
  { year: "2024", institution: "Coursera / University of Michigan", detail: "Python 3 Programming — 5 course certificate" },
  { year: "2024", institution: "Coursera / IBM Skills Network", detail: "Python for Data Science, AI & Development" },
  { year: "2025", institution: "Berlitz School of Languages", detail: "Spanish Level 1" },
]

// ── Page Component ────────────────────────────────────────────────────────────

export default function ResumePage() {
  const [showPasscodeInput, setShowPasscodeInput] = useState(false)
  const [passcode, setPasscode] = useState("")
  const [passcodeError, setPasscodeError] = useState(false)
  const [showPasscodeChars, setShowPasscodeChars] = useState(false)

  const handleDownloadClick = () => {
    setShowPasscodeInput(true)
    setPasscodeError(false)
  }

  const handlePasscodeSubmit = () => {
    if (passcode === process.env.NEXT_PUBLIC_RESUME_PASSCODE) {
      const link = document.createElement("a")
      link.href = "/R. Goldman Resume 2026.pdf"
      link.download = "Richard_Goldman_Resume.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setShowPasscodeInput(false)
      setPasscode("")
      setPasscodeError(false)
    } else {
      setPasscodeError(true)
    }
  }

  const handleCancel = () => {
    setShowPasscodeInput(false)
    setPasscode("")
    setPasscodeError(false)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

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
          <h1 className="text-4xl font-bold text-white mb-1">Richard Goldman</h1>
          <p className="text-slate-400 text-sm">Pittsburgh, PA</p>
        </div>

        {/* Download card */}
        <Card className="bg-slate-800 border border-slate-700 mb-10 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-slate-300 text-sm">
                Download the full resume as a PDF (includes contact information)
              </p>
              {!showPasscodeInput && (
                <Button
                  onClick={handleDownloadClick}
                  className="bg-blue-600 hover:bg-blue-500 text-white shrink-0 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Download PDF
                </Button>
              )}
            </div>

            {/* Inline passcode input */}
            {showPasscodeInput && (
              <div className="flex flex-col gap-3">
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type={showPasscodeChars ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value)
                      setPasscodeError(false)
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handlePasscodeSubmit()}
                    placeholder="Enter passcode"
                    autoFocus
                    className={cn(
                      "w-full bg-slate-900 border rounded-md pl-9 pr-10 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                      passcodeError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-600 focus:border-blue-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscodeChars(!showPasscodeChars)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label="Toggle passcode visibility"
                  >
                    {showPasscodeChars ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {passcodeError && (
                  <p className="text-red-400 text-xs">Incorrect passcode. Please try again.</p>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handlePasscodeSubmit}
                    className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Confirm Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* ── EMPLOYMENT ───────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-blue-400 border-b border-slate-700 pb-2 mb-6">
            Employment
          </h2>
          <div className="flex flex-col gap-8">
            {employmentHistory.map((job) => (
              <div key={job.company}>
                <h3 className="text-lg font-semibold text-white mb-3">{job.company}</h3>
                <div className="flex flex-col gap-4 pl-4 border-l border-slate-700">
                  {job.roles.map((role, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <span className="text-white font-medium text-sm">{role.title}</span>
                      {role.location && (
                        <span className="text-slate-400 text-xs">{role.location}</span>
                      )}
                      <span className="text-slate-500 text-xs">{role.period}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── APPLE CAREER EXPERIENCES ─────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-blue-400 border-b border-slate-700 pb-2 mb-6">
            Apple Career Experiences
          </h2>
          <div className="flex flex-col gap-4 pl-4 border-l border-slate-700">
            {appleExperiences.map((exp, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="text-white font-medium text-sm">{exp.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs">{exp.setting}</span>
                  <span className="text-slate-600 text-xs">·</span>
                  <span className="text-slate-500 text-xs">{exp.period}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SKILLS ───────────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-blue-400 border-b border-slate-700 pb-2 mb-6">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                className="bg-slate-800 text-slate-300 border border-slate-600 hover:border-blue-500 hover:text-blue-400 transition-colors cursor-default"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </section>

        {/* ── EDUCATION ────────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-blue-400 border-b border-slate-700 pb-2 mb-6">
            Education
          </h2>
          <div className="flex flex-col gap-4 pl-4 border-l border-slate-700">
            {education.map((edu, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs font-mono">{edu.year}</span>
                  <span className="text-white font-medium text-sm">{edu.institution}</span>
                </div>
                <span className="text-slate-400 text-xs">{edu.detail}</span>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
