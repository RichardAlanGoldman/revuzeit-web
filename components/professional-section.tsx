"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Briefcase, FileText, Code, Target } from "lucide-react"

const professionalCards = [
  {
    id: "resume",
    title: "Resume",
    description: "View my complete professional background and qualifications",
    icon: FileText,
    href: "/resume",
  },
  {
    id: "experience",
    title: "Experience",
    description: "Explore my career journey and key accomplishments",
    icon: Briefcase,
    href: "/experience",
  },
  {
    id: "skills",
    title: "Skills",
    description: "Technical expertise and core competencies",
    icon: Code,
    href: "/skills",
  },
  {
    id: "goals",
    title: "Goals",
    description: "My professional aspirations and future objectives",
    icon: Target,
    href: "/goals",
  },
]

export function ProfessionalSection() {
  return (
    <section className="w-full lg:w-1/2 bg-slate-900 px-6 lg:px-12 py-14 lg:py-20 flex items-start justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-white mb-2">Professional</h2>
          <p className="text-slate-400 text-sm">Expertise, experience, and career trajectory</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {professionalCards.map((card) => {
            const Icon = card.icon
            const cardHref = card.href ?? `#${card.id}`
            const Comp = card.href ? Link : "a"
            return (
              <Comp key={card.id} href={cardHref} id={card.id} className="group cursor-pointer">
                <Card className="h-full bg-slate-800/50 border border-slate-700 hover:border-blue-500/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-950/50">
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-all duration-300">
                      <Icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                </Card>
              </Comp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
