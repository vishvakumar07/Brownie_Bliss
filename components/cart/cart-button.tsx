"use client"

import { useCart } from "@/hooks/use-cart"
import { ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function CartButton() {
  const { cartCount, toggleCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [bounce, setBounce] = useState(0)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (cartCount > 0) {
      setBounce((prev) => prev + 1)
    }
  }, [cartCount])

  if (!mounted) {
    return (
      <button className="relative p-2 text-[#6D5D55] hover:text-[#4E342E] transition-colors focus:outline-none">
        <ShoppingBag className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-[#6D5D55] hover:text-[#4E342E] transition-colors focus:outline-none cursor-pointer"
      aria-label="Open cart drawer"
    >
      <ShoppingBag className="w-5.5 h-5.5 text-[#2D1B14]" />
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.span
            key={bounce}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
            style={{ background: "#C68642" }}
          >
            {cartCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
