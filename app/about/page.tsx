import About from '@/components/sections/About'
import SubpageNavigation from '@/components/ui/SubpageNavigation'

const aboutSubpages = [
  {
    title: 'History',
    href: '/about/history',
    description: 'Discover the journey and milestones that have shaped our organization.'
  },
  {
    title: 'Beliefs',
    href: '/about/beliefs',
    description: 'Learn about our core beliefs and theological foundation.'
  },
  {
    title: 'Board of Trustees',
    href: '/about/board',
    description: 'Meet the dedicated leaders who guide our mission and vision.'
  },
  {
    title: 'Founders',
    href: '/about/founders',
    description: 'Learn about the visionaries who started this ministry.'
  },
  {
    title: 'With Gratitude',
    href: '/about/gratitude',
    description: 'Expressing our thanks to those who have supported our mission.'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <About showCTA={false} />
      <SubpageNavigation
        title="Learn More About Us"
        subtitle="Explore the different aspects of our organization and mission"
        subpages={aboutSubpages}
      />
    </div>
  )
}
