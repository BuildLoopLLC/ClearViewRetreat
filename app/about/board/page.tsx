'use client'

import SubpageLayout from '@/components/ui/SubpageLayout'
import SubpageContent from '@/components/ui/SubpageContent'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'

const defaultBoardMembers = [
  {
    name: 'Jim Nestle',
    title: 'Executive Director',
    bio: 'Jim brings over 20 years of ministry experience and a deep passion for strengthening families through Christ-centered relationships.',
    image: '/images/board/jim-nestle.jpg'
  },
  {
    name: 'Kim Nestle',
    title: 'Program Director',
    bio: 'Kim has extensive experience in family counseling and has helped countless couples and families build stronger relationships.',
    image: '/images/board/kim-nestle.jpg'
  },
  {
    name: 'Dr. Sarah Johnson',
    title: 'Board Chair',
    bio: 'Dr. Johnson is a licensed family therapist with over 15 years of experience helping families navigate difficult seasons.',
    image: '/images/board/sarah-johnson.jpg'
  },
  {
    name: 'Pastor Michael Chen',
    title: 'Spiritual Advisor',
    bio: 'Pastor Chen has served in pastoral ministry for over 25 years and brings wisdom and spiritual guidance to our board.',
    image: '/images/board/michael-chen.jpg'
  },
  {
    name: 'Lisa Rodriguez',
    title: 'Community Outreach',
    bio: 'Lisa has a heart for community engagement and helps us connect with local churches and organizations.',
    image: '/images/board/lisa-rodriguez.jpg'
  },
  {
    name: 'Tom Anderson',
    title: 'Financial Advisor',
    bio: 'Tom brings his expertise in financial management to help ensure our ministry remains financially sound and sustainable.',
    image: '/images/board/tom-anderson.jpg'
  }
]

export default function BoardPage() {
  const { content: boardContent, loading, error } = useWebsiteContent('about', 'board')
  
  // Get board members from database only
  const getBoardMembers = () => {
    if (!boardContent || loading) return []
    
    const boardMembers = []
    for (let i = 1; i <= 10; i++) { // Check up to 10 members
      const name = boardContent.find(c => c.subsection === 'board' && c.metadata?.name === `Board Member ${i} Name`)?.content
      const title = boardContent.find(c => c.subsection === 'board' && c.metadata?.name === `Board Member ${i} Title`)?.content
      const bio = boardContent.find(c => c.subsection === 'board' && c.metadata?.name === `Board Member ${i} Bio`)?.content
      const image = boardContent.find(c => c.subsection === 'board' && c.metadata?.name === `Board Member ${i} Image`)?.content
      
      if (name && title && bio) {
        boardMembers.push({
          name,
          title,
          bio,
          image: image || null
        })
      }
    }
    
    return boardMembers
  }
  
  const boardMembers = getBoardMembers()
  
  if (loading) {
    return (
      <SubpageLayout
        title="Board of Trustees"
        subtitle="Meet the dedicated leaders who guide our mission and vision"
        breadcrumbs={[
          { name: 'About', href: '/about' },
          { name: 'Board of Trustees', href: '/about/board' }
        ]}
      >
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </SubpageLayout>
    )
  }
  
  if (error) {
    return (
      <SubpageLayout
        title="Board of Trustees"
        subtitle="Meet the dedicated leaders who guide our mission and vision"
        breadcrumbs={[
          { name: 'About', href: '/about' },
          { name: 'Board of Trustees', href: '/about/board' }
        ]}
      >
        <div className="text-center py-8">
          <p className="text-red-600">Error loading board information: {error}</p>
        </div>
      </SubpageLayout>
    )
  }

  return (
    <SubpageLayout
      title="Board of Trustees"
      subtitle="Meet the dedicated leaders who guide our mission and vision"
      breadcrumbs={[
        { name: 'About', href: '/about' },
        { name: 'Board of Trustees', href: '/about/board' }
      ]}
    >
      <div className="max-w-6xl mx-auto">
        {/* Introduction - Show database content as formatted text */}
        <div className="prose prose-lg max-w-none mb-16">
          {boardContent && boardContent.find(c => c.subsection === 'board' && c.metadata?.name === 'Board Introduction')?.content && (
            <div 
              className="text-xl text-secondary-600 leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ 
                __html: boardContent.find(c => c.subsection === 'board' && c.metadata?.name === 'Board Introduction')?.content || '' 
              }}
            />
          )}
        </div>

        {/* Board Members - Always show the section */}
        <div className="mb-16">
          <h3 className="text-3xl font-display font-semibold text-secondary-900 mb-12 text-center">
            Our Leadership Team
          </h3>
          
          {boardMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {boardMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-secondary-200 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-center mb-6">
                    {member.image ? (
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-primary-600">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <h4 className="text-xl font-semibold text-secondary-900 mb-2">{member.name}</h4>
                    <p className="text-primary-600 font-medium">{member.title}</p>
                  </div>
                  <p className="text-secondary-600 leading-relaxed text-center">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary-500">No board members found. Please add board members through the admin panel.</p>
            </div>
          )}
        </div>

        {/* Board Responsibilities - From Database */}
        {boardContent && boardContent.find(c => c.subsection === 'board' && c.metadata?.name === 'Board Responsibilities')?.content && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200 mb-16">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: boardContent.find(c => c.subsection === 'board' && c.metadata?.name === 'Board Responsibilities')?.content || '' 
              }}
            />
          </div>
        )}

        {/* Call to Action - From Database */}
        {boardContent && boardContent.find(c => c.subsection === 'board' && c.metadata?.name === 'Call to Action')?.content && (
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: boardContent.find(c => c.subsection === 'board' && c.metadata?.name === 'Call to Action')?.content || '' 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </SubpageLayout>
  )
}