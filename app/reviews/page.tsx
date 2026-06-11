import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { TestimonialsSection } from "@/components/home/testimonials-section"

export const metadata = {
  title: "Customer Reviews — Brownie Bliss",
  description: "See what our happy customers say about Brownie Bliss — real reviews from real brownie lovers across India.",
}

export default function ReviewsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Page Hero */}
      <section
        className="pt-32 pb-16 text-center"
        style={{
          background: "linear-gradient(150deg, #FDF8F2 0%, #FAF3E8 50%, #F5ECD8 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C68642] mb-3">
            Testimonials
          </p>
          <h1
            className="font-serif font-bold text-balance"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", lineHeight: 1.1, color: "#2D1B14" }}
          >
            What Our Customers Say
          </h1>
          <p className="mt-5 text-[#6D5D55] leading-relaxed max-w-xl mx-auto">
            Honest words from our happiest customers. No filters — just the real brownie love we get every day.
          </p>
        </div>
      </section>

      <TestimonialsSection hideHeader={true} />

      <Footer />
    </main>
  )
}
