import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
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
          <h1 className="text-4xl font-bold text-white mb-2">About this site</h1>
          <p className="text-slate-400 text-sm">My journey with Gemini and Claude.</p>
        </div>

        <p className="text-slate-400">Content coming soon.</p>
      </main>
    </div>
  )
}
