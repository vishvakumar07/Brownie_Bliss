"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ShoppingBag, Home, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

interface OrderDetails {
  placedOrders: any[]
  formData: {
    name: string
    phone: string
    email: string
    houseNumber: string
    streetAddress: string
    area?: string
    city: string
    state: string
    pincode: string
    landmark?: string
    paymentMethod: string
  }
  finalTotal: number
  shippingCharge: number
}

// Custom Confetti Config
const colors = ["#D4A373", "#4E342E", "#C68642", "#FAF6F2", "#2D6A4F", "#7C3AED", "#EF4444", "#3B1F14"]
const confettiParticles = Array.from({ length: 90 }).map((_, i) => {
  const angle = Math.random() * Math.PI * 2
  const distance = Math.random() * 150 + 60
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 80,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4,
    shape: Math.random() > 0.5 ? "circle" : "square",
    duration: Math.random() * 1.5 + 1.2,
    delay: Math.random() * 0.1,
  }
})

export default function SuccessPage() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = sessionStorage.getItem("last_placed_order")
    if (saved) {
      try {
        setOrderDetails(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse last order details", e)
      }
    }
  }, [])

  if (!mounted) return null

  // Fallback if no order context is found (e.g. direct URL access)
  const details = orderDetails || {
    placedOrders: [],
    formData: {
      name: "Valued Customer",
      phone: "",
      email: "",
      houseNumber: "",
      streetAddress: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "COD"
    },
    finalTotal: 0,
    shippingCharge: 0
  }

  const fullAddress = details.formData.houseNumber
    ? `${details.formData.houseNumber}, ${details.formData.streetAddress}, ${details.formData.area ? details.formData.area + ", " : ""}${details.formData.city}, ${details.formData.state} - ${details.formData.pincode}${details.formData.landmark ? " (Landmark: " + details.formData.landmark + ")" : ""}`
    : "Home Delivery Address"

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col justify-between text-[#2D1B14] font-sans">
      <Navbar />

      <div className="flex-grow pt-28 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Confetti Explosion Layer */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
          {mounted && confettiParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
              animate={{
                x: p.x,
                y: p.y + 250, // drift downwards with gravity
                scale: 0.1,
                rotate: Math.random() * 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.1, 0.8, 0.3, 1], // explody ease
              }}
              className="absolute pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === "circle" ? "50%" : "2px",
              }}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDD4] shadow-xl text-center space-y-6 relative z-10 my-4"
        >
          {/* Animated Success Checkmark Ring */}
          <div className="relative w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100 shadow-inner">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
              className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 0.35 }}
                />
              </motion.svg>
            </motion.div>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1B14] flex items-center justify-center gap-1.5">
              <Sparkles className="w-5.5 h-5.5 text-[#D4A373] animate-pulse" />
              Order Confirmed!
              <Sparkles className="w-5.5 h-5.5 text-[#D4A373] animate-pulse" />
            </h1>
            <p className="text-xs sm:text-sm text-[#6D5D55] max-w-sm mx-auto leading-relaxed">
              Thank you for ordering with Brownie Bliss. Your artisanal, freshly baked brownies are being prepared in our ovens.
            </p>
          </div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-[#FFF8F0] rounded-2xl p-5 border border-[#E8DDD4] text-left space-y-4 shadow-inner"
          >
            <p className="text-[10px] font-bold text-[#C68642] uppercase tracking-widest border-b border-[#E8DDD4] pb-1.5 font-sans">
              Delivery Details
            </p>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-[#2D1B14] text-sm">{details.formData.name}</p>
              {details.formData.phone && <p className="text-[#6D5D55]">{details.formData.phone} | {details.formData.email}</p>}
              <p className="text-[#6D5D55] leading-relaxed mt-1 font-sans">{fullAddress}</p>
            </div>
            
            <div className="h-px bg-[#E8DDD4]" />
            
            <p className="text-[10px] font-bold text-[#C68642] uppercase tracking-widest pb-0.5 font-sans">
              Bliss Box
            </p>
            <div className="space-y-2.5">
              {details.placedOrders.length > 0 ? (
                details.placedOrders.map((ord: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-[#2D1B14] font-semibold">
                      {ord.product_name} <span className="text-[#8B7E74] font-medium text-[11px] ml-1">x{ord.quantity}</span>
                    </span>
                    <span className="font-sans font-bold text-[#4E342E]">₹{ord.total}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#8B7E74] italic">Freshly baked brownie box</div>
              )}
            </div>
            
            <div className="h-px bg-[#E8DDD4]" />
            
            <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-[#2D1B14]">
              <span>Grand Total ({details.formData.paymentMethod})</span>
              <span className="font-sans text-sm sm:text-base font-extrabold text-[#4E342E]">
                ₹{details.finalTotal || "0"}
              </span>
            </div>
          </motion.div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1 bg-[#4E342E] hover:bg-[#2D1B14] text-[#FFF8F0] py-6 rounded-2xl cursor-pointer text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]"
              onClick={() => router.push("/products")}
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-[#E8DDD4] hover:bg-[#FFF8F0] text-[#4E342E] py-6 rounded-2xl cursor-pointer text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
              onClick={() => router.push("/")}
            >
              Go to Home
            </Button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
