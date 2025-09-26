import Events from '@/components/sections/Events'
import SubpageNavigation from '@/components/ui/SubpageNavigation'

const eventsSubpages = [
  // {
  //   title: 'Upcoming Events',
  //   href: '/events/upcoming',
  //   description: 'View our calendar of upcoming seminars, workshops, and retreats.'
  // },
  {
    title: 'Past Events',
    href: '/events/past',
    description: 'Explore highlights and photos from our previous events.'
  },
  {
    title: 'Event Registration',
    href: '/events/register',
    description: 'Register for upcoming events and secure your spot.'
  },
  {
    title: 'Event Types',
    href: '/events/types',
    description: 'Learn about the different types of events we offer.'
  },
  {
    title: 'Payment',
    href: '/events/payment',
    description: 'Payment information for events and retreats.'
  }
]

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <Events showCTA={false} />
      <SubpageNavigation
        title="Explore Our Events"
        subtitle="Discover the various ways to engage with our ministry"
        subpages={eventsSubpages}
      />
    </div>
  )
}
