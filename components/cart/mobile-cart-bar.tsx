"use client"

import { useCart } from "@/hooks/use-cart"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function MobileCartBar() {
  const { cartCount, grandTotal, setIsOpen } = useCart()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Don't show on checkout, cart, or success pages to avoid duplicate CTA overlays
  const isCheckoutOrCartPage =
    pathname.startsWith("/checkout") || pathname === "/cart"

  if (isCheckoutOrCartPage) return null

  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 md:hidden"
          style={{
            background: "linear-gradient(to top, rgba(255,248,240,1) 60%, transparent)",
          }}
        >
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center justify-between px-4.5 py-3.5 rounded-2xl transition-all active:scale-[0.98] shadow-lg cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #4E342E, #2D1B14)",
              boxShadow: "0 8px 28px rgba(78,52,46,0.35)",
              color: "#FFF8F0",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold"
                  style={{ background: "#C68642", color: "#FFF8F0" }}
                >
                  {cartCount}
                </span>
              </div>
              <span className="font-semibold text-xs text-white">
                {cartCount} Item{cartCount > 1 ? "s" : ""}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm font-sans text-white">₹{grandTotal}</span>
              <span className="text-[10px] opacity-70 text-white">|</span>
              <span className="font-bold text-xs flex items-center gap-0.5 text-white">
                View Cart <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
