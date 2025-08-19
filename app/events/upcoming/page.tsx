import SubpageLayout from '@/components/ui/SubpageLayout'
import { motion } from 'framer-motion'
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

// Mock data - in real app this would come from the database
const upcomingEvents = [
  {
    id: 1,
    title: 'Spring Renewal Retreat',
    date: 'March 15-17, 2024',
    location: 'Main Lodge',
    participants: '25/30',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'A weekend of spiritual renewal, prayer, and community building in the beauty of spring.',
    featured: true,
    price: '$299',
    category: 'Spiritual Renewal'
  },
  {
    id: 2,
    title: 'Family Adventure Camp',
    date: 'April 5-7, 2024',
    location: 'Outdoor Pavilion',
    participants: '40/50',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    description: 'Fun-filled activities for the whole family, including hiking, crafts, and worship.',
    featured: false,
    price: '$199',
    category: 'Family'
  },
  {
    id: 3,
    title: 'Men\'s Wilderness Challenge',
    date: 'April 19-21, 2024',
    location: 'Wilderness Area',
    participants: '15/20',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'An outdoor adventure designed to challenge men physically and spiritually.',
    featured: false,
    price: '$249',
    category: 'Men'
  },
  {
    id: 4,
    title: 'Marriage Enrichment Weekend',
    date: 'May 10-12, 2024',
    location: 'Garden Cottage',
    participants: '20/25',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Strengthen your marriage through biblical teaching, communication exercises, and quality time together.',
    featured: false,
    price: '$399',
    category: 'Marriage'
  },
  {
    id: 5,
    title: 'Women\'s Spiritual Retreat',
    date: 'May 24-26, 2024',
    location: 'Sunset Lodge',
    participants: '30/35',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'A time for women to connect, grow spiritually, and find renewal in God\'s presence.',
    featured: false,
    price: '$279',
    category: 'Women'
  },
  {
    id: 6,
    title: 'Youth Leadership Summit',
    date: 'June 7-9, 2024',
    location: 'Conference Center',
    participants: '50/60',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Equipping young leaders with skills and spiritual foundation for ministry and service.',
    featured: false,
    price: '$179',
    category: 'Youth'
  }
]

const categories = ['All', 'Spiritual Renewal', 'Family', 'Men', 'Women', 'Marriage', 'Youth']

export default function UpcomingEventsPage() {
  return (
    <SubpageLayout
      title="Upcoming Events"
      subtitle="Join us for transformative experiences that will renew your spirit and strengthen your faith"
      breadcrumbs={[
        { name: 'Events', href: '/events' },
        { name: 'Upcoming Events', href: '/events/upcoming' }
      ]}
    >
      <div className="max-w-7xl mx-auto">
        {/* Event Categories Filter */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full border border-secondary-300 text-secondary-700 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Event */}
        {upcomingEvents.filter(event => event.featured).map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-secondary-200">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${event.image}')` }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                      Featured Event
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-100 text-accent-800">
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                    {event.title}
                  </h3>
                  <p className="text-lg text-secondary-600 mb-6 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-primary-600" />
                      <span className="text-secondary-700">{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="h-5 w-5 text-primary-600" />
                      <span className="text-secondary-700">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <UsersIcon className="h-5 w-5 text-primary-600" />
                      <span className="text-secondary-700">{event.participants} participants</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-8">
                    <span className="text-3xl font-bold text-primary-600">{event.price}</span>
                    <span className="text-sm text-secondary-500">per person</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={`/events/${event.id}`}
                      className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center group"
                    >
                      Learn More
                      <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                    <Link
                      href={`/events/${event.id}/register`}
                      className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
                    >
                      Register Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Other Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.filter(event => !event.featured).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="card h-full overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-secondary-200">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url('${event.image}')` }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-display font-semibold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    {event.title}
                  </h3>
                  
                  <p className="text-secondary-600 mb-4 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4 text-sm text-secondary-600">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-primary-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-4 w-4 text-primary-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UsersIcon className="h-4 w-4 text-primary-600" />
                      <span>{event.participants} participants</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary-600">{event.price}</span>
                    <span className="text-xs text-secondary-500">per person</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <Link
                      href={`/events/${event.id}`}
                      className="btn-primary flex-1 text-center py-3"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/events/${event.id}/register`}
                      className="btn-outline flex-1 text-center py-3"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              We offer custom retreats and events for groups of all sizes. Contact us to discuss 
              your specific needs and how we can serve you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Contact Us
              </Link>
              <Link
                href="/events/types"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Learn About Event Types
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  )
}
