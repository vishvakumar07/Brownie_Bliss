"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    id: 1,
    question: "How do I place an order?",
    answer:
      "Click the Add to Cart and Place the order else use WhatsApp button, share your requirements, and we'll confirm your order.",
  },
  {
    id: 2,
    question: "How much advance notice is needed?",
    answer:
      "We recommend ordering 24–48 hours in advance for the best availability.",
  },
  {
    id: 3,
    question: "Do you offer customized brownies?",
    answer:
      "Yes! We can customize brownies for birthdays, events, and special occasions.",
  },
  {
    id: 4,
    question: "What brownie flavors are available?",
    answer:
      "We offer a variety of flavors. Please refer to the product section or Contact us on WhatsApp for the latest menu.",
  },
  {
    id: 5,
    question: "Do you provide delivery?",
    answer:
      "Yes, delivery is available based on your location and order details.",
  },
  {
    id: 6,
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, Google Pay, PhonePe, Paytm, and bank transfers.",
  },
  {
    id: 7,
    question: "How long do the brownies stay fresh?",
    answer:
      "Our brownies stay fresh for 3–5 days when stored properly.",
  },
  {
    id: 8,
    question: "Can I cancel or modify my order?",
    answer:
      "Changes are possible before preparation begins, if there is any cancellation or modification in your order. Contact us as soon as possible.",
  },
  {
    id: 9,
    question: "Do you accept bulk orders?",
    answer:
      "Yes, we take bulk and corporate orders. Message us for details.",
  },
  {
    id: 10,
    question: "Are eggless brownies available?",
    answer: "Yes, eggless options are available on request.",
  },
]

export function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(1)

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <p className="text-caramel font-medium mb-2 tracking-wide uppercase text-xs">
            Got Questions?
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-cocoa text-balance">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-pretty text-xs md:text-sm">
            Everything you need to know about ordering from Brownie Bliss
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {faqs.map((faq) => {
            const isOpen = openId === faq.id
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-caramel/40 bg-gold/10 shadow-sm"
                    : "border-border bg-card hover:border-caramel/30 hover:bg-muted/50"
                }`}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between px-4 md:px-6 py-3.5 md:py-4 text-left gap-4 group"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-semibold text-sm md:text-base leading-snug transition-colors duration-200 ${
                      isOpen ? "text-chocolate" : "text-foreground group-hover:text-chocolate"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-caramel/20 text-caramel rotate-180"
                        : "bg-muted text-muted-foreground group-hover:bg-caramel/10 group-hover:text-caramel"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 md:px-6 pb-4 md:pb-5 text-muted-foreground text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
