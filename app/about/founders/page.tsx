import SubpageLayout from '@/components/ui/SubpageLayout'
import Image from 'next/image'

export default function FoundersPage() {
  return (
    <SubpageLayout
      title="Founders"
      subtitle="Meet Jim and Kim Nestle, the visionaries behind Intentional Intimacy International"
      breadcrumbs={[
        { name: 'About', href: '/about' },
        { name: 'Founders', href: '/about/founders' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        {/* Family Photo */}
        <div className="text-center mb-16">
          <div className="relative w-full max-w-lg mx-auto">
            {/* Decorative background elements */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary-100 via-accent-100 to-primary-50 rounded-3xl blur-xl opacity-60"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-primary-200 to-accent-200 rounded-2xl"></div>
            
            {/* Main image container */}
            <div className="relative bg-white rounded-2xl p-3 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-3xl">
              <Image
                src="/images/Nestle-family-at-the-Vow-Renewal-2.jpg"
                alt="Nestle family at the Vow Renewal"
                width={400}
                height={268}
                className="rounded-xl w-full h-auto object-cover"
              />
              
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-primary-500 rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-accent-500 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-accent-500 rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-primary-500 rounded-br-xl"></div>
            </div>
          </div>
          
          {/* Caption - positioned outside the relative container */}
          <div className="mt-8 text-center relative z-10">
            <p className="text-lg font-medium text-secondary-700 italic mb-3">
              "Building a legacy of intentional intimacy"
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg text-secondary-600 leading-relaxed mb-6">
            For twenty-three years (23?!, oh my!) and with five active children, God has blessed us with a delightful marriage and family life. We enjoy each other and desire to glorify God in our interactions. Why did God bless us with the home life that we have? Certainly not because we deserve "wedded bliss" and "great kids" more than any other couple or family, but simply because He chose to lead us as we sought His will in our home. He has taught us principles for relating, for living life with <em className="text-secondary-600 font-semibold">intentional intimacy</em>, and we want to share this with others.
          </p>
          
          <p className="text-lg text-secondary-600 leading-relaxed mb-8">
            Please don't misunderstand; we have had hardships and trials. We have had difficult seasons in our marriage. <strong>But, God</strong> has pulled us through. In the spring of 2011 we said goodbye to our infant son, <a href="https://www.wearejedidiah.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">Jedidiah</a>, who lived 63,660 seconds. We are not perfect spouses, nor do we have perfect kids. <strong>But, God</strong> redeems our lives and shows us how to smooth the rough spots and polish the good ones. Through all of life's trials and triumphs, our hearts are about reaching others with the hope of Christ in every moment of life.
          </p>
        </div>

        {/* Jim Nestle Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200 mb-8">
          <h2 className="text-3xl font-display font-bold text-secondary-900 mb-6">
            James (Jim) Nestle
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-secondary-900">Education</h4>
                    <p className="text-secondary-600">Masters of Arts Christian Counseling and Discipleship (MACCD), BSN, RN</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-secondary-900">Ministry</h4>
                    <p className="text-secondary-600">Grief Mentor with Grief Care Fellowship</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-secondary-900">Credentials</h4>
                    <p className="text-secondary-600">Commissioned Minister by LifePoint Church Commissioning Council</p>
                  </div>
                </div>
              </div>
              
              <p className="text-secondary-600 leading-relaxed">
                Jim spent four years working at Capital Bible Seminary as the full-time Men's Mentor and a part-time adjunct professor. A former naval officer who served as a Division Officer, Jim also held a nurse supervisory position in the Surgery Department of Johns Hopkins Hospital for three years, overseeing the management of 220 beds and the staff that performed direct patient care. During these last years, God has called Jim to challenge the men, women, and children he has mentored/counseled to be intentionally intimate in the relationships they held dear. Through this time, he realized the need for more families to see what God really intends in relationships. Jim volunteered at a <a href="http://sonrisemountainranch.org/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">small group, family-focused retreat</a> for five weeks during the summer of 2007 to see if God was, indeed, calling his family to this life-changing ministry. These leadership positions and volunteer experience uniquely qualify him to lead staff in day-to-day duties and guests in small group discussions. Currently, Jim works full-time as an RN, trains in blacksmithing, mentors marriages, and runs CVR.
              </p>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-primary-50 rounded-xl p-6">
                <h4 className="font-semibold text-secondary-900 mb-3">Key Experience</h4>
                <ul className="space-y-2 text-sm text-secondary-600">
                  <li>• Capital Bible Seminary - Men's Mentor</li>
                  <li>• Naval Officer - Division Officer</li>
                  <li>• Johns Hopkins Hospital - Nurse Supervisor</li>
                  <li>• Grief Care Fellowship - Grief Mentor</li>
                  <li>• Marriage Mentor</li>
                  <li>• Blacksmithing Trainer</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Kim Nestle Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200 mb-12">
          <h2 className="text-3xl font-display font-bold text-secondary-900 mb-6">
            Kim Nestle
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-secondary-900">Education</h4>
                    <p className="text-secondary-600">BS in Secondary Education–Speech Communication and English</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-secondary-900">Ministry</h4>
                    <p className="text-secondary-600">Grief Mentor with Grief Care Fellowship</p>
                  </div>
                </div>
              </div>
              
              <p className="text-secondary-600 leading-relaxed">
                Kim received honors in interpersonal communication at Northern Arizona University. As a homeschooling mother, Kim educated both of the Nestle's older boys; one of whom is now in university and one who finished an applied technology college this winter. With three boys still homeschooling, Kim also mentors married couples and has facilitated the grief/loss support groups at her church. Kim has participated in various community and church organizations including MOPS, Priest Lake Academy (PLA), La Leche League, and H.I.S. (Home Instruction Support), helping with the organizational, financial, administrative, and presentation aspects of these groups. She also volunteered at a small group <a href="http://sonrisemountainranch.org/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">family-focused retreat</a> in the summer of 2007. Kim has spoken at various women's events on the topics of parenting, grief, and biblical relationships.
              </p>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-accent-50 rounded-xl p-6">
                <h4 className="font-semibold text-secondary-900 mb-3">Community Involvement</h4>
                <ul className="space-y-2 text-sm text-secondary-600">
                  <li>• MOPS</li>
                  <li>• Priest Lake Academy (PLA)</li>
                  <li>• La Leche League</li>
                  <li>• H.I.S. (Home Instruction Support)</li>
                  <li>• Church Grief/Loss Support Groups</li>
                  <li>• Women's Event Speaker</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
              Experience Intentional Intimacy
            </h3>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              Jim and Kim's personal journey of faith, family, and intentional intimacy has inspired the ministry 
              of Clear View Retreat. Come experience the same principles that have blessed their family for over two decades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/events"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Join Us for a Retreat
              </a>
              <a
                href="/about"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Learn More About Our Mission
              </a>
            </div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  )
}
