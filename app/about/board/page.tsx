import SubpageLayout from '@/components/ui/SubpageLayout'

const boardMembers = [
  {
    name: 'Nathan Primm',
    role: 'Secretary/Treasurer',
    yearJoined: '2011',
    description: 'Nathan has been serving on the board since 2011, bringing financial expertise and organizational leadership to our ministry.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Rex Parker',
    role: 'Board Member',
    yearJoined: '2014-2015',
    description: 'Rex joined as a Junior Board member in 2014 and became a full Board member in 2015, contributing valuable insights and experience.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Matthew Iverson',
    role: 'Board Member',
    yearJoined: '2023',
    description: 'Matthew joined the board in 2023, bringing fresh perspective and dedication to our mission of strengthening families.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Megan Iverson',
    role: 'Board Member',
    yearJoined: '2023',
    description: 'Megan joined the board in 2023, contributing her passion for family ministry and community building.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }
]

export default function BoardPage() {
  return (
    <SubpageLayout
      title="Board of Trustees"
      subtitle="Meet the dedicated leaders who guide our mission and vision"
      breadcrumbs={[
        { name: 'About', href: '/about' },
        { name: 'Board of Trustees', href: '/about/board' }
      ]}
    >
      <div className="max-w-7xl mx-auto">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-16">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 text-center">
            <p className="text-xl text-secondary-600 leading-relaxed">
              Our Board of Trustees provides strategic leadership and oversight for Intentional Intimacy International 
              and Clear View Retreat. These dedicated individuals bring diverse expertise and a shared commitment 
              to strengthening families through biblical teaching and intentional intimacy.
            </p>
          </div>
        </div>

        {/* Board Members List */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-8 text-center">
            Our Board Members
          </h3>
          <div className="max-w-4xl mx-auto">
            {boardMembers.map((member, index) => (
              <div key={member.name} className="flex items-center space-x-6 p-6 border-b border-secondary-200 last:border-b-0 hover:bg-secondary-50 transition-colors duration-200">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary-200">
                    <div 
                      className="w-full h-full bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url('${member.image}')` }}
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-xl font-display font-semibold text-secondary-900">
                      {member.name}
                    </h4>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                      {member.role}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-2">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Joined {member.yearJoined}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Active Member</span>
                    </div>
                  </div>
                  
                  <p className="text-secondary-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Board Structure Information */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200 mb-16">
          <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
            Our Board Structure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-2">Strategic Oversight</h4>
              <p className="text-secondary-600 text-sm">
                Our board provides strategic direction and oversight for all ministry activities and financial decisions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-2">Diverse Expertise</h4>
              <p className="text-secondary-600 text-sm">
                Board members bring varied backgrounds and skills to ensure comprehensive ministry leadership.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-2">Faithful Stewardship</h4>
              <p className="text-secondary-600 text-sm">
                Committed to faithful stewardship of resources and ministry opportunities entrusted to us.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
              Interested in Serving?
            </h3>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              Our board is always looking for individuals who share our passion for strengthening families 
              and building intentional intimacy. If you feel called to serve in this capacity, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Contact Us
              </a>
              <a
                href="/about"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Learn More About Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  )
}
