"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    <section className="py-10 md:py-14 bg-chocolate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/20 mb-4">
            <Mail className="w-6 h-6 text-gold" />
          </div>

          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-cream text-balance">
            Stay in the Loop
          </h2>
          
          <p className="mt-3 text-cream/80 text-sm md:text-base max-w-xl mx-auto text-pretty">
            Subscribe to get exclusive offers, new flavor announcements, and special discounts delivered to your inbox.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-cream/10 border-cream/20 text-cream placeholder:text-cream/50 focus:border-gold"
              required
            />
            <Button 
              type="submit" 
              className="bg-gold hover:bg-caramel text-cocoa font-semibold gap-2"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Subscribed
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-4 text-cream/60 text-sm">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
