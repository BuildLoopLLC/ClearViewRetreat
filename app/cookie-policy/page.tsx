'use client'

import SubpageLayout from '@/components/ui/SubpageLayout'
import SubpageContent from '@/components/ui/SubpageContent'

export default function CookiePolicyPage() {
  return (
    <SubpageLayout
      title="Cookie Policy"
      subtitle="How we use cookies and similar technologies on our website"
      breadcrumbs={[
        { name: 'Cookie Policy', href: '/cookie-policy' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <SubpageContent 
          section="legal" 
          subsection="cookie-policy"
          fallback={
            <div className="prose prose-lg max-w-none">
              <p className="text-secondary-600 leading-relaxed mb-6">
                Our cookie policy is being prepared. Please check back soon.
              </p>
            </div>
          }
        />
      </div>
    </SubpageLayout>
  )
}

