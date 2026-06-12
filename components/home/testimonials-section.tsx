"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  { id: 1, review: "Ordered the Classic Brownie for a small get-together and everyone kept asking where I got them. Dense, fudgy, and perfectly sweet — nothing like the store-bought ones.", name: "Priya Sharma", location: "Mumbai", rating: 5 },
  { id: 2, review: "Gifted the Nutella Brownie box for my wife's birthday. She said it was the best birthday surprise. The texture is incredible — soft inside with a slight crunch on top.", name: "Rahul Mehta", location: "Delhi", rating: 5 },
  { id: 3, review: "The Triple Chocolate Brownie is serious business. Rich, decadent, and not overly sweet. Delivery was prompt and packaging kept everything fresh. Highly recommend.", name: "Ananya Patel", location: "Bangalore", rating: 5 },
  { id: 4, review: "Finally found brownies that actually taste homemade. The Walnut Brownie has just the right crunch ratio. Ordered twice already and won't be stopping anytime soon.", name: "Vikram Singh", location: "Pune", rating: 5 },
  { id: 5, review: "Salted Caramel Brownie blew my mind. The caramel isn't overwhelming — it perfectly cuts through the chocolate richness. Will be my go-to for every celebration now.", name: "Sneha Iyer", location: "Chennai", rating: 5 },
  { id: 6, review: "Peanut Butter Brownie is dangerously good. The swirl of peanut butter through the chocolate base is perfectly balanced. Best brownie I've ever had, hands down.", name: "Arjun Nair", location: "Hyderabad", rating: 5 },
]

export function TestimonialsSection({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const total = testimonials.length

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1)
    setCurrent((idx + total) % total)
  }
  const next = () => goTo(current + 1)
  const prev = () => goTo(current - 1)

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev() }
    touchStartX.current = null
  }

  const t = testimonials[current]

  return (
    <section id="reviews" className="py-6 md:py-12 bg-[#FAF6F1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        {!hideHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4 md:mb-6"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#D4A373] mb-1">
              Customer Reviews
            </p>
            <h2 className="font-serif text-xl md:text-3xl lg:text-4xl font-bold text-[#2D1B14]">
              What Our Customers Say
            </h2>
          </motion.div>
        )}

        {/* ── MOBILE: compact swipe carousel ── */}
        <div className="block md:hidden">
          {/* Card swipe area — 90% width centred */}
          <div
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -50 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="w-[90%] mx-auto rounded-xl border border-[#E2D4C9] bg-white
                           shadow-[0_2px_12px_rgba(78,52,46,0.08)]"
                style={{ padding: "14px" }}
              >
                {/* Top row: avatar + name + stars */}
                <div className="flex items-center gap-2.5 mb-2.5">
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#4E342E,#C68642)", color: "#FFF8F0" }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#2D1B14] text-xs leading-tight">{t.name}</p>
                    <p className="text-[10px] text-[#8B7E74]">{t.location}</p>
                  </div>
                  {/* Stars right-aligned */}
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Review — 3-line clamp to reduce card height */}
                <p className="text-[#5C4E46] text-xs leading-relaxed italic line-clamp-3">
                  &ldquo;{t.review}&rdquo;
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls row: prev · dots · next */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <button
              onClick={prev}
              className="w-7 h-7 rounded-full border border-[#E8DDD4] flex items-center justify-center active:scale-90 transition-all"
              style={{ background: "#fff" }}
            >
              <ChevronLeft className="w-3.5 h-3.5 text-[#4E342E]" />
            </button>

            <div className="flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 18 : 5,
                    height: 5,
                    background: i === current ? "#4E342E" : "#E8DDD4",
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-all"
              style={{ background: "#4E342E" }}
            >
              <ChevronRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Desktop: 3-column grid with arrows */}
        <div className="hidden md:block">
          <div className="relative flex items-center gap-3">
            <button
              onClick={prev}
              className="flex-shrink-0 w-10 h-10 rounded-full border border-[#4E342E] bg-[#4E342E] flex items-center justify-center text-white hover:bg-[#3E2723] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={Math.floor(current / 3)}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-2 lg:grid-cols-3 gap-5 py-2"
                >
                  {testimonials.slice(0, 3).map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                      className="flex flex-col justify-between rounded-2xl border border-[#E2D4C9] bg-white p-6 shadow-[0_8px_24px_rgba(78,52,46,0.06)] cursor-default"
                      style={{ minHeight: 220 }}
                    >
                      <div className="flex items-center gap-0.5 mb-4">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-[#5C4E46] text-sm leading-relaxed italic flex-1">
                        &ldquo;{item.review}&rdquo;
                      </p>
                      <div className="mt-5 flex justify-end">
                        <div className="text-right">
                          <p className="font-semibold text-[#2D1B14] text-sm">{item.name}</p>
                          <p className="text-xs text-[#8B7E74]">{item.location}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
            <button
              onClick={next}
              className="flex-shrink-0 w-10 h-10 rounded-full border border-[#4E342E] bg-[#4E342E] flex items-center justify-center text-white hover:bg-[#3E2723] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="h-1.5 rounded-full transition-all"
                style={{ width: i === current ? 20 : 6, background: i === current ? "#4E342E" : "#E8DDD4" }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
