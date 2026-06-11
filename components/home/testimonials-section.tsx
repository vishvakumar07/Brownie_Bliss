"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    review:
      "Ordered the Classic Brownie for a small get-together and everyone kept asking where I got them. Dense, fudgy, and perfectly sweet — nothing like the store-bought ones.",
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
  },
  {
    id: 2,
    review:
      "Gifted the Nutella Brownie box for my wife's birthday. She said it was the best birthday surprise. The texture is incredible — soft inside with a slight crunch on top.",
    name: "Rahul Mehta",
    location: "Delhi",
    rating: 5,
  },
  {
    id: 3,
    review:
      "The Triple Chocolate Brownie is serious business. Rich, decadent, and not overly sweet. Delivery was prompt and packaging kept everything fresh. Highly recommend.",
    name: "Ananya Patel",
    location: "Bangalore",
    rating: 5,
  },
  {
    id: 4,
    review:
      "Finally found brownies that actually taste homemade. The Walnut Brownie has just the right crunch ratio. Ordered twice already and won't be stopping anytime soon.",
    name: "Vikram Singh",
    location: "Pune",
    rating: 5,
  },
  {
    id: 5,
    review:
      "Salted Caramel Brownie blew my mind. The caramel isn't overwhelming — it perfectly cuts through the chocolate richness. Will be my go-to for every celebration now.",
    name: "Sneha Iyer",
    location: "Chennai",
    rating: 5,
  },
  {
    id: 6,
    review:
      "Peanut Butter Brownie is dangerously good. The swirl of peanut butter through the chocolate base is perfectly balanced. Best brownie I've ever had, hands down.",
    name: "Arjun Nair",
    location: "Hyderabad",
    rating: 5,
  },
]

export function TestimonialsSection({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const [startIndex, setStartIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateCount = () => {
        const width = window.innerWidth
        if (width < 768) {
          setVisibleCount(1)
        } else if (width < 1024) {
          setVisibleCount(2)
        } else {
          setVisibleCount(3)
        }
      }
      updateCount()
      window.addEventListener("resize", updateCount)
      return () => window.removeEventListener("resize", updateCount)
    }
  }, [])

  const maxIndex = Math.max(0, testimonials.length - visibleCount)

  // Bound startIndex if visibleCount changes
  useEffect(() => {
    if (startIndex > maxIndex) {
      setStartIndex(maxIndex)
    }
  }, [visibleCount, maxIndex, startIndex])

  const handleNext = () => {
    if (startIndex < maxIndex) {
      setDirection(1)
      setStartIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (startIndex > 0) {
      setDirection(-1)
      setStartIndex((prev) => prev - 1)
    }
  }

  const visible = testimonials.slice(startIndex, startIndex + visibleCount)

  return (
    <section id="reviews" className="py-10 md:py-14 bg-[#FAF6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {!hideHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D4A373] mb-2">
              Customer Reviews
            </p>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D1B14] text-balance">
              What Our Customers Say
            </h2>
            <p className="mt-2 text-[#6D5D55] max-w-xl mx-auto text-pretty text-sm">
              Real words from real brownie lovers — no filters, just honest love.
            </p>
          </motion.div>
        )}

        {/* Carousel Wrapper */}
        <div className="relative flex items-center gap-3">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            aria-label="Previous testimonials"
            className="flex-shrink-0 w-10 h-10 rounded-full border border-[#4E342E] bg-[#4E342E] flex items-center justify-center text-white hover:bg-[#3E2723] hover:border-[#3E2723] hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-[#8B7E74]/10 disabled:border-[#E8DDD4] disabled:text-[#8B7E74]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Cards Row */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={startIndex}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-2"
              >
                {visible.map((t) => (
                  <motion.div
                    key={t.id}
                    whileHover={{ 
                      y: -6, 
                      scale: 1.02,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    className="flex flex-col justify-between rounded-2xl border border-[#E2D4C9] bg-white p-6 shadow-[0_8px_24px_rgba(78,52,46,0.06)] hover:shadow-[0_20px_40px_rgba(78,52,46,0.12)] hover:border-[#4E342E]/30 transition-all duration-300 cursor-default"
                    style={{ minHeight: 220 }}
                  >
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-[#5C4E46] text-sm leading-relaxed italic flex-1">
                      &ldquo;{t.review}&rdquo;
                    </p>

                    {/* Author — bottom right */}
                    <div className="mt-5 flex justify-end">
                      <div className="text-right">
                        <p className="font-semibold text-[#2D1B14] text-sm">
                          {t.name}
                        </p>
                        <p className="text-xs text-[#8B7E74]">{t.location}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            disabled={startIndex >= maxIndex}
            aria-label="Next testimonials"
            className="flex-shrink-0 w-10 h-10 rounded-full border border-[#4E342E] bg-[#4E342E] flex items-center justify-center text-white hover:bg-[#3E2723] hover:border-[#3E2723] hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-[#8B7E74]/10 disabled:border-[#E8DDD4] disabled:text-[#8B7E74]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > startIndex ? 1 : -1)
                setStartIndex(i)
              }}
              aria-label={`Go to testimonial set ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === startIndex
                  ? "bg-[#4E342E] w-4"
                  : "bg-[#E8DDD4] hover:bg-[#8B7E74]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
