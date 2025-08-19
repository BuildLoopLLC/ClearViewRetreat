import SubpageLayout from '@/components/ui/SubpageLayout'

export default function BeliefsPage() {
  return (
    <SubpageLayout
      title="Our Beliefs"
      subtitle="Learn about our core beliefs and theological foundation"
      breadcrumbs={[
        { name: 'About', href: '/about' },
        { name: 'Beliefs', href: '/about/beliefs' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-16">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 text-center">
            <p className="text-xl text-secondary-600 leading-relaxed italic">
              "It is our hope that God's church—that is, His people, not some building—would be one body… unified for Him, working for Him, glorifying Him, impassioned for Him."
            </p>
          </div>
        </div>

        {/* Statement of Faith */}
        <div className="space-y-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              Our Statement of Faith
            </h3>
            <p className="text-secondary-600 leading-relaxed mb-6">
              We believe in God, the Creator of the heavens and earth, and that He exists in three persons—the Father, the Son, and the Holy Spirit. God the Son, Jesus, was born to a virgin by God the Holy Spirit. Jesus lived on earth as fully man while remaining fully God.
            </p>
            <p className="text-secondary-600 leading-relaxed mb-6">
              He lived a sinless life that ended in His death on the cross as the sacrificial Lamb, atoning for the sins of all who believe in Him and call on His name. He rose again from death after three days, and after a brief time, ascended again into heaven.
            </p>
            <p className="text-secondary-600 leading-relaxed">
              God the Holy Spirit will come and live within anyone who chooses to accept the gift of Jesus' death, burial, and resurrection. With the Holy Spirit within us, we can live life together with fellow saints and share God's Word with others who do not know Him while being able to experience the abundance of God's provision, whether in times of triumph or trial.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              Our Eternal Hope
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              After this life is over, a believer's earthly body dies, and the spiritual, eternal being lives forever with God, reunited with its glorified body after Jesus Christ comes again.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              A Note on Theological Discussion
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Of course, there are many issues within the realm of faith and biblical scholarship that we have not addressed above. This is a simple summary of many complex topics. If you would like further information, please <a href="/contact/" className="text-primary-600" target="_self" rel="noopener noreferrer">contact us</a>.
            </p>
          </div>
        </div>


        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
              Have Questions About Our Beliefs?
            </h3>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              We welcome thoughtful questions and discussions about our theological foundation. 
              If you'd like to learn more about any aspect of our beliefs, please reach out to us.
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
