"use client"

import { motion } from "framer-motion"
import { Award, Leaf, Heart, Clock, Shield, Truck } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Only the finest natural ingredients, no preservatives or artificial flavors",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every brownie is handcrafted with passion and attention to detail",
  },
  {
    icon: Clock,
    title: "Fresh Daily",
    description: "Baked fresh every day to ensure maximum flavor and texture",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Belgian chocolate and gourmet ingredients in every batch",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Strict quality control for consistent deliciousness",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and safe delivery right to your doorstep",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function WhyChooseUsSection({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  return (
    <section className="py-10 md:py-14 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {!hideHeader && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D4A373] mb-1.5">Why Brownie Bliss?</p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#2D1B14] text-balance">
              What Makes Us Special
            </h2>
            <p className="mt-2 text-[#6D5D55] text-xs md:text-sm max-w-lg mx-auto text-pretty">
              We take pride in every brownie we bake, ensuring each bite delivers the perfect chocolate experience
            </p>
          </motion.div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ 
                y: -6, 
                scale: 1.03,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group p-4.5 sm:p-5 bg-white border border-[#E2D4C9] rounded-2xl shadow-[0_8px_24px_rgba(78,52,46,0.06)] hover:shadow-[0_20px_40px_rgba(78,52,46,0.12)] hover:border-[#4E342E]/30 transition-all duration-300 cursor-default"
            >
              <div className="w-9 h-9 rounded-xl bg-[#4E342E]/5 flex items-center justify-center mb-3 group-hover:bg-[#4E342E]/10 transition-colors">
                <feature.icon className="w-4.5 h-4.5 text-[#4E342E]" />
              </div>
              <h3 className="font-semibold text-sm md:text-base text-[#2D1B14] mb-1">
                {feature.title}
              </h3>
              <p className="text-[#6D5D55] text-xs leading-normal">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
