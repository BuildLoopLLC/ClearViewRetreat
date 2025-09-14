import SubpageLayout from '@/components/ui/SubpageLayout'
import SubpageContent from '@/components/ui/SubpageContent'

export default function PrayerPage() {
  return (
    <SubpageLayout
      title="Prayer Requests"
      subtitle="Submit prayer requests and let us pray for you"
      breadcrumbs={[
        { name: 'Contact', href: '/contact' },
        { name: 'Prayer Requests', href: '/contact/prayer' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <SubpageContent 
          section="contact" 
          subsection="prayer"
          className="prose prose-lg max-w-none"
        />
      </div>
    </SubpageLayout>
  )
}
