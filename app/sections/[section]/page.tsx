'use client'

import { useParams } from 'next/navigation'
import SubpageLayout from '@/components/ui/SubpageLayout'
import CustomSection from '@/components/ui/CustomSection'

export default function CustomSectionPage() {
  const params = useParams()
  const section = params.section as string

  // Get the section name for display
  const sectionName = section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, ' ')

  return (
    <SubpageLayout
      title={sectionName}
      subtitle="Custom content section"
      breadcrumbs={[
        { name: 'Home', href: '/' },
        { name: sectionName, href: `/sections/${section}` }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <CustomSection section={section} />
      </div>
    </SubpageLayout>
  )
}
