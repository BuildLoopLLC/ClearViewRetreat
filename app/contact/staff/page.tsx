import SubpageLayout from '@/components/ui/SubpageLayout'
import SubpageContent from '@/components/ui/SubpageContent'

const staffMembers = [
  {
    name: 'Jim Nestle',
    title: 'Executive Director',
    email: 'jim@clearviewretreat.com',
    phone: '(555) 123-4567',
    bio: 'Jim leads our ministry with over 20 years of experience in family ministry and pastoral care.',
    image: '/images/staff/jim-nestle.jpg'
  },
  {
    name: 'Kim Nestle',
    title: 'Program Director',
    email: 'kim@clearviewretreat.com',
    phone: '(555) 123-4568',
    bio: 'Kim oversees our retreat programs and brings extensive experience in family counseling.',
    image: '/images/staff/kim-nestle.jpg'
  },
  {
    name: 'Sarah Johnson',
    title: 'Retreat Coordinator',
    email: 'sarah@clearviewretreat.com',
    phone: '(555) 123-4569',
    bio: 'Sarah ensures every retreat runs smoothly and that our guests have an exceptional experience.',
    image: '/images/staff/sarah-johnson.jpg'
  },
  {
    name: 'Michael Chen',
    title: 'Facilities Manager',
    email: 'michael@clearviewretreat.com',
    phone: '(555) 123-4570',
    bio: 'Michael keeps our facilities in perfect condition and manages our beautiful natural setting.',
    image: '/images/staff/michael-chen.jpg'
  },
  {
    name: 'Lisa Rodriguez',
    title: 'Hospitality Coordinator',
    email: 'lisa@clearviewretreat.com',
    phone: '(555) 123-4571',
    bio: 'Lisa ensures our guests feel welcome and comfortable throughout their stay.',
    image: '/images/staff/lisa-rodriguez.jpg'
  },
  {
    name: 'Tom Anderson',
    title: 'Worship Leader',
    email: 'tom@clearviewretreat.com',
    phone: '(555) 123-4572',
    bio: 'Tom leads our worship times and helps create meaningful spiritual experiences.',
    image: '/images/staff/tom-anderson.jpg'
  }
]

export default function StaffPage() {
  return (
    <SubpageLayout
      title="Staff Directory"
      subtitle="Meet our team and find the right person to contact"
      breadcrumbs={[
        { name: 'Contact', href: '/contact' },
        { name: 'Staff Directory', href: '/contact/staff' }
      ]}
    >
      <div className="max-w-6xl mx-auto">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-16">
          <SubpageContent 
            section="contact" 
            subsection="staff"
            className="text-xl text-secondary-600 leading-relaxed mb-8"
          />
        </div>

        {/* Staff Members */}
        <div className="mb-16">
          <h3 className="text-3xl font-display font-semibold text-secondary-900 mb-12 text-center">
            Our Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staffMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-secondary-200 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-primary-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h4 className="text-xl font-semibold text-secondary-900 mb-2">{member.name}</h4>
                  <p className="text-primary-600 font-medium mb-4">{member.title}</p>
                  <p className="text-secondary-600 leading-relaxed text-sm mb-4">
                    {member.bio}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${member.email}`} className="text-primary-600 hover:text-primary-700 text-sm">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${member.phone}`} className="text-primary-600 hover:text-primary-700 text-sm">
                      {member.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200 mb-16">
          <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
            General Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">Main Office</h4>
              <div className="space-y-3 text-secondary-600">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p>info@clearviewretreat.com</p>
                    <p>retreats@clearviewretreat.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p>(555) 123-4567</p>
                    <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">Emergency Contact</h4>
              <div className="space-y-3 text-secondary-600">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p>Emergency: (555) 123-9999</p>
                    <p>Available 24/7 during retreats</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
              Ready to Connect?
            </h3>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              We're here to help you plan your perfect retreat experience. 
              Don't hesitate to reach out with any questions or to discuss your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Contact Us
              </a>
              <a
                href="/events"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                View Retreats
              </a>
            </div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  )
}