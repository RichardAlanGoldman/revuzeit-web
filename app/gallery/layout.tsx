import { Navbar } from '@/components/navbar'

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="pt-16">{children}</div>
    </div>
  )
}
