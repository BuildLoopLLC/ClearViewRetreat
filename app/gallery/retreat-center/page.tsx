import Gallery from '@/components/sections/Gallery'

export const metadata = {
  title: 'Retreat Center Gallery | Clear View Retreat',
  description: 'Explore photos of our beautiful retreat center facilities including the main lodge, chapel, and meeting spaces.',
}

export default function RetreatCenterGalleryPage() {
  return (
    <div className="min-h-screen">
      <Gallery 
        galleryType="retreat-center"
        title="Retreat Center"
        subtitle="Explore our beautiful retreat center and facilities, including the main lodge, chapel, and meeting spaces."
        showViewFullGallery={false}
      />
    </div>
  )
}

