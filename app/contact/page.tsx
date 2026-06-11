"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Mail, Phone, MapPin, Send, Clock, Instagram } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98765 43210",
    sub: "Mon – Sat, 9 AM – 7 PM",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@browniebliss.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Chennai, Tamil Nadu",
    sub: "India",
  },
  {
    icon: Clock,
    label: "Order Hours",
    value: "9 AM – 6 PM",
    sub: "Fresh orders daily",
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message: form.message,
      })
      if (error) throw error
      toast.success("Message sent! We'll get back to you soon 🍫")
      setForm({ name: "", email: "", phone: "", message: "" })
    } catch (err: any) {
      toast.error("Failed to send message: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Page Hero */}
      <section
        className="pt-32 pb-16 text-center"
        style={{
          background:
            "linear-gradient(150deg, #FDF8F2 0%, #FAF3E8 50%, #F5ECD8 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C68642] mb-3">
            Get in Touch
          </p>
          <h1
            className="font-serif font-bold text-balance"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              lineHeight: 1.1,
              color: "#2D1B14",
            }}
          >
            We&apos;d Love to Hear From You
          </h1>
          <p className="mt-5 text-[#6D5D55] leading-relaxed max-w-xl mx-auto">
            Have a custom order in mind? Want to know more? Drop us a message
            and we&apos;ll be in touch quickly.
          </p>
        </div>
      </section>

      {/* Contact Body */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* ── Left: Info cards + social ── */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
              >
                <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Contact Information
                </h2>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                  Reach us through any of the channels below — we&apos;re always happy to help.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {contactInfo.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.45 }}
                      className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-xl bg-chocolate/10 flex items-center justify-center mb-3">
                        <item.icon className="w-5 h-5 text-chocolate" />
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
                        {item.label}
                      </p>
                      <p className="font-semibold text-foreground text-sm">{item.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Social */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com/browniebliss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-chocolate hover:text-chocolate transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    @browniebliss
                  </a>
                  <a
                    href="mailto:contact@browniebliss.com"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-chocolate hover:text-chocolate transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email Us
                  </a>
                </div>
              </motion.div>
            </div>

            {/* ── Right: Contact Form ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="rounded-2xl border border-border bg-card p-8 shadow-sm"
            >
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">
                    Your Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-chocolate/30 focus:border-chocolate transition-colors"
                  />
                </div>

                {/* Email + Phone row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-chocolate/30 focus:border-chocolate transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground mb-1.5">
                      Phone
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+91 XXXXXXXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-chocolate/30 focus:border-chocolate transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Tell us about your order or any questions you have..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-chocolate/30 focus:border-chocolate transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all duration-300 disabled:opacity-70"
                  style={{
                    background: "linear-gradient(135deg, #4E342E 0%, #2D1B14 100%)",
                    color: "#FFF8F0",
                    letterSpacing: "0.03em",
                    boxShadow: "0 4px 20px rgba(78,52,46,0.25)",
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
