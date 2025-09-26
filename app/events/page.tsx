import Events from '@/components/sections/Events'
import SubpageNavigation from '@/components/ui/SubpageNavigation'

const eventsSubpages = [
  {
    title: 'Past Events',
    href: '/events/past',
    description: 'Explore highlights and photos from our previous events.'
  },
  {
    title: 'Testimonials',
    href: '/events/testimonials',
    description: 'Read stories from participants about their event experiences.'
  }
]

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <Events showCTA={false} />
      {/* <SubpageNavigation
        title="Explore Our Events"
        subtitle="Discover the various ways to engage with our ministry"
        subpages={eventsSubpages}
      /> */}
    </div>
  )
}
