import SubpageLayout from '@/components/ui/SubpageLayout'
import SubpageContent from '@/components/ui/SubpageContent'

export default function LocationPage() {
  return (
    <SubpageLayout
      title="Location & Directions"
      subtitle="Find our retreat center and get directions"
      breadcrumbs={[
        { name: 'Contact', href: '/contact' },
        { name: 'Location & Directions', href: '/contact/location' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <SubpageContent 
          section="contact" 
          subsection="location"
          className="prose prose-lg max-w-none"
        />
      </div>
    </SubpageLayout>
  )
}
