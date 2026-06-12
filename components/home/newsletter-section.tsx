"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, ArrowRight, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      toast.success("Thank you for subscribing!")
      setEmail("")
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  return (
    <section className="py-7 md:py-10 bg-chocolate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          {/* Top row: icon + heading */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(212,163,115,0.20)" }}>
              <Mail className="w-4 h-4 text-[#D4A373]" />
            </div>
            <h2 className="font-serif text-lg md:text-2xl font-bold text-cream">
              Stay in the Loop
            </h2>
          </div>

          <p className="text-cream/70 text-xs md:text-sm mb-4 leading-relaxed">
            Exclusive offers & new flavours, straight to your inbox.
          </p>

          {/* Form — single row on all screen sizes */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 min-w-0 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/45 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#D4A373] transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitted}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 active:scale-95 disabled:opacity-70"
              style={{
                background: isSubmitted ? "#2D6A4F" : "#D4A373",
                color: "#2D1B14",
                boxShadow: "0 4px 12px rgba(212,163,115,0.30)",
              }}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Done!
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-2.5 text-cream/45 text-[10px]">
            No spam — unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
