import Gallery from '@/components/sections/Gallery'
import SubpageNavigation from '@/components/ui/SubpageNavigation'

const gallerySubpages = [
  {
    title: 'Retreat Center',
    href: '/gallery/retreat-center',
    description: 'Explore our beautiful retreat center and facilities.'
  },
  {
    title: 'Event Photos',
    href: '/gallery/events',
    description: 'View photos from our seminars, workshops, and retreats.'
  },
  {
    title: 'Nature & Grounds',
    href: '/gallery/nature',
    description: 'Experience the natural beauty of our surroundings.'
  },
  {
    title: 'Community Life',
    href: '/gallery/community',
    description: 'See the life and fellowship that happens here.'
  },
  {
    title: 'Testimonials Gallery',
    href: '/gallery/testimonials',
    description: 'Visual stories from our participants and guests.'
  }
]

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      <Gallery />
      <SubpageNavigation
        title="Explore Our Gallery"
        subtitle="Visual stories from our ministry and retreat center"
        subpages={gallerySubpages}
      />
    </div>
  )
}
