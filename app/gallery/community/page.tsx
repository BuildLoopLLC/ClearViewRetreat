import Gallery from '@/components/sections/Gallery'

export const metadata = {
  title: 'Community Life Gallery | Clear View Retreat',
  description: 'See the life and fellowship that happens at Clear View Retreat—shared meals, worship, and connections.',
}

export default function CommunityGalleryPage() {
  return (
    <div className="min-h-screen">
      <Gallery 
        galleryType="community"
        title="Community Life"
        subtitle="See the life and fellowship that happens here—shared meals, worship, and connections."
        showViewFullGallery={false}
      />
    </div>
  )
}

