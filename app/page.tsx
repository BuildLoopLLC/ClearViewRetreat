import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import About from '@/components/sections/About'
import Events from '@/components/sections/Events'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import Gallery from '@/components/sections/Gallery'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <About showCTA={true} />
      <Events showCTA={true} />
      <Gallery />
      <Testimonials />
      <Contact />
    </>
  )
}
