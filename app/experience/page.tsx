"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowLeft, ChevronDown } from "lucide-react"

// ── Experience Data ───────────────────────────────────────────────────────────

type Role = {
  title: string
  location: string
  period: string
  description: string
  accomplishments: string[]
}

type Company = {
  name: string
  roles: Role[]
}

const experienceData: Company[] = [
  {
    name: "Apple, Inc.",
    roles: [
      {
        title: "Creative",
        location: "Apple Shadyside",
        period: "December 2024 – Present",
        description: "Creatives are responsible for delivering Today at Apple sessions to customers. In a typical week I deliver 8 hour-long sessions and 10 shorter tip sessions to between 1 and 10 customers",
        accomplishments: [
          "Primary metrics for my position are percentage of sessions delivered and average attndees. During the past year my efforts in evangelizing the store team as well as consistent interaction with customers have moved our performance to top 20% in the Market Team",
          "Faced the challenge of on-boarding a new Creative while our Creative Pro was unexpectedly on a leave. I realized that the situation was drifting and stepped in to organize a training regtime to bring my teammate up to speed.",
          "Utilize my deep understanding of Apple software and hardware to support customers both in Genius Bar and Product Zone",
          "Always looking for ways to bring new knowledge to the team. The recent introduction of Creator Studio was an opportunity to bring demos of the products to the sales floor, showing the team how to illustrate the power of these tools",
        ],
      },
      {
        title: "Product Specialist",
        location: "Apple Shadyside",
        period: "January 2017 – December 2024 / August 2013 – September 2014",
        description: "Product Specialists are responsible for creating owners in the Product Zone of retail stores. We assist customers in purchases or other transactions, advise on purchases, promotions, set-up of new devices and Apple services which benefit them.",
        accomplishments: [
          "Delivered consistently excellent service to retail customers as measured by superior NPS metrics",
          "Expanded Apple ownership by demonstrating device features & benefits and matching customer needs to specific hardware & software.",
          "Conceived and implemented a Five Minute Feature segment for our store morning meeting allowing teammates to share features they loved aimed at improving shown-a-feature scores by customers.",
          "I received Exceeds Expectations ratings for multiple periods based on exceptional customer service and support of my teammates",
        ],
      },
      {
        title: "Tech Specialist",
        location: "Apple Shadyside",
        period: "September 2014 – January 2017",
        description: "Tech Specialists are responsible for repairing relationships with customers in the Genius Bar section of retail stores. We help customers who are experiencing problems, hardware or software, with their Apple devices and offer options for repair, mitigation or replacement.",
        accomplishments: [
          "Developed a deep knowledge of Apple hardware and software; both iOS and MacOS.",
          "Used skills of troubleshooting and diagnosis to determine causes and remedies for issues in both the hardware and software.",
        ],
      },
    ],
  },
  {
    name: "Apple, Inc. Career Experiences",
    roles: [
      {
        title: "Test Lead, Finance Business Process Reengineering",
        location: "Remote",
        period: "January – May 2024",
        description: "UAT Test Leads are responsible for planning and managing the User Acceptance Testing of system changes that affect the Finance department of Apple.",
        accomplishments: [
          "Managed five projects through successful, on-time User Acceptance Tests. Developed Test Plans, oversaw creation of Test Suites, conducted planning and schedule review meetings via Webex.",
          "Worked cross functionally with teams in Finance, Retail Systems, Online Store and Media Services to coordinate testing.",
          "Worked closely with IS&T to monitor and resolve Radars filed by end-users",
          "Developed documentation of tasks required to initiate, monitor and complete UAT projects. These detailed how-to guides covered setup in Apple Directory, Slack, Radar, Mozaic, Wrike and Caliber",
        ],
      },
      {
        title: "Instructor, Today at Apple",
        location: "In-store",
        period: "April – September 2023",
        description: "As a result of unexpected employee departures our store found itself short-handed of Creatives to teach Today at Apple sessions. Consequently leadership created an in-store experience for two instructors.",
        accomplishments: [
          "Delivered dynamic presentations to a diverse customer audience providing surprise and delight as they discovered new and useful features.",
          "Improved Sessions Delivered by pursuing opportunities among customers awaiting service resulting in top tier results in our Market Team",
        ],
      },
      {
        title: "Operations Specialist",
        location: "In-store",
        period: "January – March 2023",
        description: "Having worked in both Product Zone and Genius Bar, I wanted to broaden my experience to include backstage operations. Working with my manager, we developed a plan for me to flex to operations allowing to learn that role.",
        accomplishments: [
          "Mastered the elements of Inventory operations including receiving, pickups and returns.",
          "Took the initiative to resolve issues in the daily cycle counts that interfered with critical tasksff",
        ],
      },
      {
        title: "Voice Specialist, Retail Flex Pilot",
        location: "Remote",
        period: "August – December 2021",
        description: "I was chosen for a pilot project to determine the feasibility of retail employees flexing between in-store work and at-home, remote service as specialists in the Retail Contact Center for the Apple Online Store.",
        accomplishments: [
          "Employed a tailored approach to customer sales that emphasized understanding needs resulting in superior metrics for sales closed and NPS.",
        ],
      },
      {
        title: "Retail Subject Matter Expert, RCC",
        location: "Remote",
        period: "July 2020 – June 2021",
        description: "When I returned from my Career Experience in Cupertino, we were in the midst of the Pandemic and most retail employees were working from home either in Apple Care or the Retail Contact Center. I was initially assigned to Store Contacts and then to Customer Service. The challenge of moving 1,200 people into the CS role resulted in my joining a small group who used Slack and Webex to support other specialists rather than speaking directly to customers.",
        accomplishments: [
          "Developed workflows, procedures and methods to enable a diverse team of specialists to adapt to challenging circumstances in a work-from-home environment without precedent at Apple.",
          "Supported team members via Slack and Webex guiding them through the resolution of complex customer service issues.",
          "Developed numerous documents to educate specialists about methods and procedures.",
          "Achieved 100% NPS",
        ],
      },
      {
        title: "Junior QA Engineer, Apple Maps Client",
        location: "Santa Clara",
        period: "January – June 2020",
        description: "I was responsible for executing suites of tests against developemnt versions of iOS 14 and MacOS 11. I documented bugs in Radar and followed up their analysis, resoltuion and closure.",
        accomplishments: [
          "Consistently exceeded targets for execution of test plans",
          "Took initiative to revise several test suites for consistency with iOS 14 features",
          "Ensured the quality of released software by documenting bugs and following up on fixes via Radar and other tools",
          "Produced documentation for a testing tool using Quip.",
        ],
      },
    ],
  },
  {
    name: "Mystery Lovers Bookshop",
    roles: [
      {
        title: "Owner",
        location: "Pittsburgh, PA",
        period: "October 1990 – July 2012",
        description: "After careers in software (me) and non-profit management (my wife), we fulfilledd a life-long dream by opening Mystery Lovers Bookshop, specializing in crime and mystery fiction.",
        accomplishments: [
          "Founded and operated the third largest bookshop specializing in crime and mystery fiction.",
          "Received a Raven Award from the Mystery Writers of America as Bookseller of the Year.",
          "Designed and developed the sales and inventory systems providing unique features including customer rewards and bibliographic data.",
          "Designed and launched an e-commerce website, a first for a mystery bookstore, that eventually supported 40% of the store's sales.",
          "Wrote and edited a 16 page, bi-monthly store newsletter using Adobe Photoshop and InDesign.",
          "Regularly taught adult education courses in mystery fiction that always had a waiting list.",
        ],
      },
    ],
  },
]

// ── Accordion Component ───────────────────────────────────────────────────────

type AccordionItemProps = {
  role: Role
  isOpen: boolean
  onToggle: () => void
}

function AccordionItem({ role, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden transition-all duration-200">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-start justify-between gap-4 bg-slate-800 hover:bg-slate-750 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white mb-1.5">{role.title}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs">
            <span className="text-slate-400">{role.location}</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-500">{role.period}</span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 mt-1",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 py-4 bg-slate-850 border-t border-slate-700">
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{role.description}</p>
            <ul className="space-y-2">
              {role.accomplishments.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                  <span className="text-blue-400 shrink-0 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function ExperiencePage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (companyIndex: number, roleIndex: number) => {
    const key = `${companyIndex}-${roleIndex}`
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

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
          <h1 className="text-4xl font-bold text-white mb-2">Experience</h1>
          <p className="text-slate-400 text-sm">
            Career journey, accomplishments, and professional roles
          </p>
        </div>

        {/* Experience sections */}
        <div className="space-y-12">
          {experienceData.map((company, companyIndex) => (
            <section key={companyIndex}>
              <h2 className="text-2xl font-semibold text-blue-400 mb-6">{company.name}</h2>
              <div className="space-y-3">
                {company.roles.map((role, roleIndex) => (
                  <AccordionItem
                    key={roleIndex}
                    role={role}
                    isOpen={openItems[`${companyIndex}-${roleIndex}`] || false}
                    onToggle={() => toggleItem(companyIndex, roleIndex)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
