import Gallery from '@/components/sections/Gallery'

export const metadata = {
  title: 'Cabins Gallery | Clear View Retreat',
  description: 'Discover our cozy cabin accommodations nestled in the peaceful surroundings of Clear View Retreat.',
}

export default function CabinsGalleryPage() {
  return (
    <div className="min-h-screen">
      <Gallery 
        galleryType="cabins"
        title="Cabins"
        subtitle="Discover our cozy cabin accommodations nestled in the peaceful surroundings."
        showViewFullGallery={false}
      />
    </div>
  )
}

