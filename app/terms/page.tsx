'use client'

import SubpageLayout from '@/components/ui/SubpageLayout'
import SubpageContent from '@/components/ui/SubpageContent'

export default function TermsPage() {
  return (
    <SubpageLayout
      title="Terms & Conditions"
      subtitle="Terms of service and conditions for using our website"
      breadcrumbs={[
        { name: 'Terms & Conditions', href: '/terms' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <SubpageContent 
          section="legal" 
          subsection="terms-conditions"
          fallback={
            <div className="prose prose-lg max-w-none">
              <p className="text-secondary-600 leading-relaxed mb-6">
                Our terms and conditions are being prepared. Please check back soon.
              </p>
            </div>
          }
        />
      </div>
    </SubpageLayout>
  )
}

