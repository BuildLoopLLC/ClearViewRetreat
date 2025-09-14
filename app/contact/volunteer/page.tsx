import SubpageLayout from '@/components/ui/SubpageLayout'
import SubpageContent from '@/components/ui/SubpageContent'

export default function VolunteerPage() {
  return (
    <SubpageLayout
      title="Volunteer Opportunities"
      subtitle="Learn how you can get involved and serve with us"
      breadcrumbs={[
        { name: 'Contact', href: '/contact' },
        { name: 'Volunteer Opportunities', href: '/contact/volunteer' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <SubpageContent 
          section="contact" 
          subsection="volunteer"
          className="prose prose-lg max-w-none"
        />
      </div>
    </SubpageLayout>
  )
}
