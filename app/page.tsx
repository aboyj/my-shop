import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { HeroSection } from '@/components/hero/HeroSection'
import { FeaturedCategories } from '@/components/hero/FeaturedCategories'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedCategories />
      </main>
      <Footer />
    </>
  )
}
