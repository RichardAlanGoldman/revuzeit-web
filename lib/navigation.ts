export type NavLink = { name: string; href: string }

export const professionalLinks: NavLink[] = [
  { name: "Resume", href: "/resume" },
  { name: "Experience", href: "/experience" },
  { name: "Skills", href: "/skills" },
  { name: "Goals", href: "/goals" },
]

export const personalLinks: NavLink[] = [
  { name: "Biography", href: "/gallery/biography" },
  { name: "Family", href: "/gallery/family" },
  { name: "Travel", href: "/gallery/travel" },
  { name: "Restaurants", href: "/gallery/restaurants" },
  { name: "Bookstore", href: "/gallery/bookstore-memories" },
]

// Routes rendered on the dark slate theme; everything else uses the light stone theme
const darkRoutes = ["/", "/resume", "/experience", "/skills", "/goals", "/about"]

export function isDarkRoute(pathname: string): boolean {
  return darkRoutes.some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(route + "/"))
  )
}
