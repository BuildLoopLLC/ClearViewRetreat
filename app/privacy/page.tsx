'use client'

import SubpageLayout from '@/components/ui/SubpageLayout'
import SubpageContent from '@/components/ui/SubpageContent'

export default function PrivacyPolicyPage() {
  return (
    <SubpageLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information"
      breadcrumbs={[
        { name: 'Privacy Policy', href: '/privacy' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <SubpageContent 
          section="legal" 
          subsection="privacy-policy"
          fallback={
            <div className="prose prose-lg max-w-none">
              <p className="text-secondary-600 leading-relaxed mb-6">
                Our privacy policy is being prepared. Please check back soon.
              </p>
            </div>
          }
        />
      </div>
    </SubpageLayout>
  )
}

