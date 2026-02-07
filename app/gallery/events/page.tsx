import Gallery from '@/components/sections/Gallery'

export const metadata = {
  title: 'Event Photos Gallery | Clear View Retreat',
  description: 'View photos from our seminars, workshops, retreats, and special gatherings at Clear View Retreat.',
}

export default function EventsGalleryPage() {
  return (
    <div className="min-h-screen">
      <Gallery 
        galleryType="events"
        title="Event Photos"
        subtitle="Memories captured from our seminars, workshops, retreats, and special gatherings."
        showViewFullGallery={false}
      />
    </div>
  )
}

