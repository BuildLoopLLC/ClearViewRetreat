'use client'

import { useState } from 'react'
import SubpageLayout from '@/components/ui/SubpageLayout'
import { 
  HeartIcon, 
  ShoppingBagIcon, 
  HomeModernIcon, 
  ClipboardDocumentListIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'
import SupportOptionModal from '@/components/ui/SupportOptionModal'

// Default support options - can be extended via admin
const defaultSupportOptions = [
  {
    id: 'support-donate',
    title: 'Donate',
    icon: HeartIcon,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    description: 'Make a financial contribution to support our ministry and retreat programs.',
  },
  {
    id: 'support-shop',
    title: 'Shop to Support',
    icon: ShoppingBagIcon,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    description: 'Purchase merchandise and items that support our mission.',
  },
  {
    id: 'support-adopt-cabin',
    title: 'Adopt-a-Cabin',
    icon: HomeModernIcon,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Sponsor a cabin to help maintain and improve our retreat facilities.',
  },
  {
    id: 'support-items-needed',
    title: 'Items Needed',
    icon: ClipboardDocumentListIcon,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'View our wish list of items and supplies that would help our ministry.',
  },
]

// Icon mapping for dynamic options
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'HeartIcon': HeartIcon,
  'ShoppingBagIcon': ShoppingBagIcon,
  'HomeModernIcon': HomeModernIcon,
  'ClipboardDocumentListIcon': ClipboardDocumentListIcon,
  'SparklesIcon': SparklesIcon,
}

// Color presets for dynamic options
const colorPresets = [
  { color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-200' },
  { color: 'text-violet-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-200' },
  { color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  { color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
  { color: 'text-pink-600', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' },
]

export default function SupportUsPage() {
  const [selectedOption, setSelectedOption] = useState<typeof defaultSupportOptions[0] | null>(null)
  
  // Fetch support option content from database
  const { content: donateContent } = useWebsiteContent('support', 'support-donate')
  const { content: shopContent } = useWebsiteContent('support', 'support-shop')
  const { content: adoptCabinContent } = useWebsiteContent('support', 'support-adopt-cabin')
  const { content: itemsNeededContent } = useWebsiteContent('support', 'support-items-needed')

  // Build support options from database content or use defaults
  const getSupportOptions = () => {
    // For now, use default options. In future, could dynamically add options from database
    return defaultSupportOptions
  }

  // Get modal content for a support option
  const getModalContent = (optionId: string): string => {
    const contentMap: Record<string, any[]> = {
      'support-donate': donateContent,
      'support-shop': shopContent,
      'support-adopt-cabin': adoptCabinContent,
      'support-items-needed': itemsNeededContent,
    }
    
    const content = contentMap[optionId]
    if (content && content.length > 0) {
      return content[0]?.content || ''
    }
    return ''
  }

  const supportOptions = getSupportOptions()

  const handleOptionClick = (option: typeof defaultSupportOptions[0]) => {
    setSelectedOption(option)
  }

  return (
    <SubpageLayout
      title="Support Us"
      subtitle="Partner with us to make a lasting impact through Clear View Retreat"
      breadcrumbs={[
        { name: 'Contact', href: '/contact' },
        { name: 'Support Us', href: '/contact/support-us' }
      ]}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-lg text-gray-600">
            Your generous support helps us continue our mission of providing transformative retreat experiences 
            for families, couples, and ministry leaders. There are many ways you can partner with us to make a difference.
          </p>
        </div>

        {/* Support Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {supportOptions.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className={`group relative bg-white rounded-xl border-2 ${option.borderColor} overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] text-left w-full`}
              >
                {/* Card Content */}
                <div className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 ${option.bgColor} rounded-lg p-3`}>
                      <Icon className={`h-8 w-8 ${option.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold ${option.color} group-hover:underline mb-2`}>
                        {option.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className={`absolute bottom-4 right-4 ${option.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            )
          })}
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Every Gift Makes a Difference
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Whether through financial giving, purchasing items from our wish list, or adopting a cabin, 
            your support directly impacts the families and individuals we serve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 transition-colors"
            >
              Make a Donation
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-rose-600 text-base font-medium rounded-md text-rose-600 bg-white hover:bg-rose-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">Your Support in Action</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-rose-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Families Served Annually</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-violet-600 mb-2">25+</div>
              <div className="text-sm text-gray-600">Years of Ministry</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Of Gifts Go to Ministry</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedOption && (
        <SupportOptionModal
          isOpen={!!selectedOption}
          onClose={() => setSelectedOption(null)}
          title={selectedOption.title}
          content={getModalContent(selectedOption.id)}
          icon={selectedOption.icon}
          color={selectedOption.color}
          bgColor={selectedOption.bgColor}
        />
      )}
    </SubpageLayout>
  )
}

