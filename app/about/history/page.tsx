import SubpageLayout from '@/components/ui/SubpageLayout'

export default function HistoryPage() {
  return (
    <SubpageLayout
      title="Our History"
      subtitle="Discover the journey and milestones that have shaped our organization"
      breadcrumbs={[
        { name: 'About', href: '/about' },
        { name: 'History', href: '/about/history' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-16">
          <p className="text-xl text-secondary-600 leading-relaxed mb-8">
            Marriages are falling apart, children are alienated from their parents, and no one in these families seems to know what to do. Pastors and mentors are working overtime to bring hope, to infuse optimism, and to convey forgiveness and reconciliation. Even within the church, so many families are trying to "go it alone" without true accountability and intimacy with each other.
          </p>
        </div>

        {/* Main Story */}
        <div className="space-y-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              The Foundation of Intentional Intimacy International
            </h3>
            <p className="text-secondary-600 leading-relaxed mb-6">
            <a href="/about/founders/" className="text-primary-600" target="_self" rel="noopener noreferrer">Jim and Kim Nestle</a> established Intentional Intimacy International (III) in the spring of 2008 as a nonprofit ministry to strengthen families. While legally established, the early years were slow preparation and waiting for the time when God would open the door to more opportunities to grow III.
            </p>
            <p className="text-secondary-600 leading-relaxed">
              The III dream has been to open Clear View Retreat–a facility that focuses on small groups of families building intimacy and accountability in a fun, God-honoring environment. The ministry purchased a property in Lancing, Tennessee, in May 2012 and worked on renovations during the limited operating months for the last few years. III began doing business as Clear View Retreat in 2016.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              Our Partnership with Churches
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              CVR wants to partner with your church leadership in the work you are already doing to help equip and empower your members and the community by teaching the fundamental principles that God puts forth in His Word concerning relationships. By partnering with your church, we can assist in the work that is already being done to reach out to the families of the church as well as help further develop the vision of deeper, more meaningful relationships that we feel every child of God longs for (yet may not know how to achieve).
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              Why We're Different
            </h3>
            <p className="text-secondary-600 leading-relaxed mb-6">
              By bringing families away from familiar, sometimes stressful environments and surrounding them with God's natural creation, families can begin to escape from the world and focus on what God has for them. There are so many capable retreat centers out there. So, why have we decided to start a new one?
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">Small Group Focus</h4>
                  <p className="text-secondary-600 leading-relaxed">
                    We want each group that comes away together to be small. When dozens and dozens of people are away together, there are too many opportunities to disengage and feel isolated within the crowd. With only four or so families coming away together, the family members really get a chance to get to know each other better and to connect more deeply with others in the group.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">Easing the Burden on Leaders</h4>
                  <p className="text-secondary-600 leading-relaxed">
                    We want to ease the burden on small group/church leaders by giving them the opportunity to grow closer with their group and the Lord – a time of respite for the whole group. We write and execute the curriculum, and we prepare all meals. In short, we do all the work. All the guests have to do is show up and let the Lord work in their hearts.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">Unique Ministry Model</h4>
                  <p className="text-secondary-600 leading-relaxed">
                    When researching what God would have us do to reach families, we found only one other retreat in the country (<a className="text-primary-600" href="http://www.sonrisemountainranch.org/" target="_blank" rel="noopener noreferrer">Sonrise Mountain Ranch</a>) that is small in nature while providing the entire curriculum and teaching, lodging and three meals a day, and operating solely to biblically deepen relationships. To better reach families and communities, we need more of these small-group retreats around the country.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              The Vision for Family Transformation
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Churches usually have wonderful men's, women's, and youth retreats at various locations, but families are not always "on the same page," even after these great and much-needed events. By bringing the whole family away together in a small, intimate setting, we can expand God's kingdom and live life on this earth more abundantly, as He plans for us.
            </p>
          </div>
        </div>

        {/* Key Milestones */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-8 text-center">
            Key Milestones in Our Journey
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <div className="text-3xl font-bold text-primary-600 mb-2">2008</div>
              <h4 className="font-semibold text-secondary-900 mb-2">Ministry Founded</h4>
              <p className="text-sm text-secondary-600">
                Jim and Kim Nestle establish Intentional Intimacy International
              </p>
            </div>
            <div className="text-center p-6 bg-accent-50 rounded-xl">
              <div className="text-3xl font-bold text-accent-600 mb-2">2012</div>
              <h4 className="font-semibold text-secondary-900 mb-2">Property Acquired</h4>
              <p className="text-sm text-secondary-600">
                Ministry purchases property in Lancing, Tennessee
              </p>
            </div>
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <div className="text-3xl font-bold text-primary-600 mb-2">2016</div>
              <h4 className="font-semibold text-secondary-900 mb-2">Clear View Retreat Opens</h4>
              <p className="text-sm text-secondary-600">
                III begins doing business as Clear View Retreat
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
              Join Us in Building Stronger Families
            </h3>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              Experience the transformative power of intentional intimacy in a small, God-honoring environment. 
              Let us partner with your church to strengthen families and build deeper relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/events"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Explore Our Retreats
              </a>
              <a
                href="/contact"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Partner With Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  )
}
