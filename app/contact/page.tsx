import Contact from '@/components/sections/Contact'
import SubpageNavigation from '@/components/ui/SubpageNavigation'

const contactSubpages = [
  {
    title: 'Location & Directions',
    href: '/contact/location',
    description: 'Find our retreat center and get directions.'
  },
  {
    title: 'Staff Directory',
    href: '/contact/staff',
    description: 'Meet our team and find the right person to contact.'
  },
  {
    title: 'Volunteer Opportunities',
    href: '/contact/volunteer',
    description: 'Learn how you can get involved and serve with us.'
  },
  {
    title: 'Prayer Requests',
    href: '/contact/prayer',
    description: 'Submit prayer requests and let us pray for you.'
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Contact />
      <SubpageNavigation
        title="Connect With Us"
        subtitle="Multiple ways to reach out and get involved"
        subpages={contactSubpages}
      />
    </div>
  )
}
