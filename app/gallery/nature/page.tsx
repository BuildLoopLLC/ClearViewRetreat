import Gallery from '@/components/sections/Gallery'

export const metadata = {
  title: 'Nature & Grounds Gallery | Clear View Retreat',
  description: 'Experience the natural beauty of our surroundings, trails, and landscapes at Clear View Retreat.',
}

export default function NatureGalleryPage() {
  return (
    <div className="min-h-screen">
      <Gallery 
        galleryType="nature"
        title="Nature & Grounds"
        subtitle="Experience the natural beauty of our surroundings, trails, and peaceful landscapes."
        showViewFullGallery={false}
      />
    </div>
  )
}

