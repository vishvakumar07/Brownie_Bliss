"use client"

import { motion } from "framer-motion"
import { Award, Leaf, Heart, Clock, Shield, Truck } from "lucide-react"

const features = [
  { icon: Leaf,   title: "100% Natural",    description: "No preservatives or artificial flavors" },
  { icon: Heart,  title: "Made with Love",  description: "Handcrafted with passion & care" },
  { icon: Clock,  title: "Fresh Daily",     description: "Baked fresh for maximum flavor" },
  { icon: Award,  title: "Premium Quality", description: "Belgian chocolate, gourmet ingredients" },
  { icon: Shield, title: "Quality Assured", description: "Consistent deliciousness, every time" },
  { icon: Truck,  title: "Fast Delivery",   description: "Quick & safe to your doorstep" },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }

export function WhyChooseUsSection({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  return (
    <section className="py-8 md:py-14 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        {!hideHeader && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-5 md:mb-10"
          >
            <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#D4A373] mb-1">
              Why Brownie Bliss?
            </p>
            <h2 className="font-serif text-xl md:text-3xl font-bold text-[#2D1B14]">
              What Makes Us Special
            </h2>
            <p className="mt-1.5 text-[#6D5D55] text-xs md:text-sm max-w-lg mx-auto hidden md:block">
              We take pride in every brownie we bake, ensuring each bite delivers the perfect chocolate experience
            </p>
          </motion.div>
        )}

        {/* ── MOBILE: 2-column compact trust-badge grid ─────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{
                y: -4,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="group flex md:flex-col items-center md:items-start gap-2.5 md:gap-0
                         p-3 md:p-5
                         bg-white border border-[#EDE5DC] rounded-xl md:rounded-2xl
                         shadow-[0_2px_10px_rgba(78,52,46,0.06)] md:shadow-[0_8px_24px_rgba(78,52,46,0.06)]
                         hover:shadow-[0_8px_20px_rgba(78,52,46,0.12)] hover:border-[#4E342E]/25
                         transition-all duration-300 cursor-default"
            >
              {/* Icon — smaller on mobile */}
              <div
                className="w-7 h-7 md:w-9 md:h-9 md:mb-3 rounded-lg md:rounded-xl flex-shrink-0 flex items-center justify-center
                           bg-[#4E342E]/5 group-hover:bg-[#4E342E]/10 transition-colors"
              >
                <feature.icon className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-[#4E342E]" />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <h3 className="font-semibold text-[#2D1B14] text-xs md:text-base leading-tight mb-0 md:mb-1">
                  {feature.title}
                </h3>
                <p className="text-[#6D5D55] text-[10px] md:text-xs leading-relaxed line-clamp-2 md:line-clamp-none">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
