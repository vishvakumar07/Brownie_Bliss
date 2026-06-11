import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { OurProductsSection } from "@/components/home/our-products-section"
import { WhyChooseUsSection } from "@/components/home/why-choose-us-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { FaqSection } from "@/components/home/faq-section"
import { NewsletterSection } from "@/components/home/newsletter-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <OurProductsSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <FaqSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
