import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhyChooseUsSection } from "@/components/home/why-choose-us-section"

export const metadata = {
  title: "About Us — Brownie Bliss",
  description: "Learn what makes Brownie Bliss special — from our premium ingredients and handcrafted recipes to our passion for the perfect chocolate brownie.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section
        className="pt-20 md:pt-28 pb-10 md:pb-16 text-center"
        style={{
          background: "linear-gradient(150deg, #FDF8F2 0%, #FAF3E8 50%, #F5ECD8 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C68642] mb-2">
            Our Story
          </p>
          <h1
            className="font-serif font-bold text-balance"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)", lineHeight: 1.1, color: "#2D1B14" }}
          >
            What Makes Us Special
          </h1>
          <p className="mt-3 text-[#6D5D55] leading-relaxed max-w-xl mx-auto text-sm md:text-base">
            Brownie Bliss started with one simple belief — that a truly great brownie can change
            your day. Every batch we bake carries that belief in every single bite.
          </p>
        </div>
      </section>

      <WhyChooseUsSection hideHeader={true} />

      <Footer />
    </main>
  )
}
