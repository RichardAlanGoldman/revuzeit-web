"use client"

import { Card } from "@/components/ui/card"
import { User, Users, Plane, Utensils } from "lucide-react"

const personalCards = [
  {
    id: "biography",
    title: "Biography",
    description: "My story, background, and life journey",
    icon: User,
  },
  {
    id: "family",
    title: "Family",
    description: "The people who matter most in my life",
    icon: Users,
  },
  {
    id: "travel",
    title: "Travel",
    description: "Adventures and destinations around the world",
    icon: Plane,
  },
  {
    id: "restaurants",
    title: "Restaurants",
    description: "Favorite dining spots and culinary experiences",
    icon: Utensils,
  },
]

export function PersonalSection() {
  return (
    <section className="w-full lg:w-1/2 bg-stone-100 p-6 lg:p-12 min-h-[50vh] lg:min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-stone-900 mb-2">Personal</h2>
          <p className="text-stone-600 text-sm">Life, passions, and what makes me unique</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personalCards.map((card) => {
            const Icon = card.icon
            return (
              <a key={card.id} href={`#${card.id}`} id={card.id} className="group cursor-pointer">
                <Card className="h-full bg-white border-0 p-6 rounded-2xl shadow-md hover:shadow-2xl hover:shadow-amber-200/50 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center border border-stone-200 group-hover:border-amber-400 group-hover:bg-amber-50 transition-all duration-300">
                      <Icon className="w-6 h-6 text-stone-500 group-hover:text-amber-600 transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-sm text-stone-600 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                </Card>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
