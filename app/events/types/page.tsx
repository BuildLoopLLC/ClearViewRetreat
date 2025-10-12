import SubpageLayout from '@/components/ui/SubpageLayout'
import Link from 'next/link'
import { 
  UserGroupIcon, 
  HeartIcon, 
  AcademicCapIcon, 
  HandRaisedIcon,
  HomeIcon,
  GlobeAltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const retreatTypes = [
  {
    title: 'Family Camps',
    href: '/retreats/family-camps',
    icon: UserGroupIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    bulletColor: 'bg-blue-600',
    description: 'Retreat experiences designed for the whole family to grow together in faith and fellowship.',
    features: ['All ages welcome', 'Family activities', 'Spiritual growth', 'Recreation & fun']
  },
  {
    title: 'Marriage Retreats',
    href: '/retreats/marriage',
    icon: HeartIcon,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    bulletColor: 'bg-pink-600',
    description: 'Strengthen your marriage with intimate retreats focused on building deeper connections.',
    features: ['Couples only', 'Relationship building', 'Biblical principles', 'Private time together']
  },
  {
    title: 'Pastors & Missionaries',
    href: '/retreats/ministry',
    icon: AcademicCapIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    bulletColor: 'bg-purple-600',
    description: 'Rest and renewal specifically designed for ministry leaders and missionaries.',
    features: ['Ministry leaders', 'Rest & renewal', 'Peer fellowship', 'Spiritual refreshment']
  },
  {
    title: 'Grieving Families',
    href: '/retreats/grieving',
    icon: HandRaisedIcon,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    bulletColor: 'bg-gray-600',
    description: 'A safe space for families to process grief and find healing together in community.',
    features: ['Compassionate care', 'Grief support', 'Family healing', 'Safe environment']
  },
  {
    title: 'Cabins & Facility Rental',
    href: '/retreats/facility-rental',
    icon: HomeIcon,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    bulletColor: 'bg-amber-600',
    description: 'Rent our beautiful facilities and cabins for your own group retreats and gatherings.',
    features: ['Group rentals', 'Beautiful facilities', 'Flexible scheduling', 'Full amenities']
  },
  {
    title: 'Family Mission Trips',
    href: '/retreats/mission-trips',
    icon: GlobeAltIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    bulletColor: 'bg-green-600',
    description: 'Serve together as a family on meaningful mission trips and service projects.',
    features: ['Family service', 'Hands-on ministry', 'Mission experience', 'Lasting impact']
  },
  {
    title: 'Other Options',
    href: '/retreats/other-options',
    icon: SparklesIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    bulletColor: 'bg-indigo-600',
    description: 'Explore additional retreat opportunities and special programs we offer.',
    features: ['Custom programs', 'Special events', 'Flexible options', 'Unique experiences']
  }
]

export default function EventTypesPage() {
  return (
    <SubpageLayout
      title="Retreat Types"
      subtitle="Discover the various retreat experiences we offer for individuals, families, and groups"
      breadcrumbs={[
        { name: 'Events', href: '/events' },
        { name: 'Retreat Types', href: '/events/types' }
      ]}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-lg text-gray-600">
            Clear View Retreat offers a variety of retreat experiences designed to meet the unique needs of 
            different groups. Whether you're looking for family bonding, marriage enrichment, ministry rest, 
            or mission opportunities, we have a retreat designed for you.
          </p>
        </div>

        {/* Retreat Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {retreatTypes.map((retreat) => {
            const Icon = retreat.icon
            return (
              <Link
                key={retreat.href}
                href={retreat.href}
                className={`group relative bg-white rounded-xl border-2 ${retreat.borderColor} overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
              >
                {/* Card Content */}
                <div className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`flex-shrink-0 ${retreat.bgColor} rounded-lg p-3`}>
                      <Icon className={`h-8 w-8 ${retreat.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold ${retreat.color} group-hover:underline mb-2`}>
                        {retreat.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {retreat.description}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {retreat.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${retreat.bulletColor}`}></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className={`absolute bottom-4 right-4 ${retreat.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Plan Your Retreat?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            View our schedule to see upcoming retreat dates, or contact us to discuss custom retreat options 
            for your group or organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events/registration"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              View Schedule & Register
            </Link>
            <Link
              href="/contact/contact-us"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-3xl font-bold text-primary-600 mb-2">25+</div>
            <div className="text-sm text-gray-600">Years of Ministry</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-sm text-gray-600">Guests Served Annually</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
            <div className="text-sm text-gray-600">Guest Satisfaction</div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  )
}

