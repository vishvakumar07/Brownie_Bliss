"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, HelpCircle } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { QuantitySelector } from "@/components/products/quantity-selector"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const router = useRouter()
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    deliveryFee,
    tax,
    grandTotal,
    cartCount,
  } = useCart()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#FFF8F0] flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-28 pb-16">
          <div className="w-12 h-12 rounded-full border-4 border-[#4E342E]/20 border-t-[#4E342E] animate-spin" />
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFF8F0] flex flex-col justify-between text-[#2D1B14] font-sans">
      <Navbar />

      <div className="flex-grow pt-28 pb-16 px-4 max-w-7xl mx-auto w-full">
        {/* Back Button */}
        <button
          onClick={() => router.push("/products")}
          className="flex items-center gap-2 text-[#4E342E] hover:text-[#2D1B14] font-semibold text-xs mb-8 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Continue Shopping
        </button>

        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#2D1B14] mb-8">
          Shopping Cart
        </h1>

        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.div
              key="empty-cart"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl border border-[#EDE5DC] p-10 text-center shadow-[0_4px_20px_rgba(45,27,20,0.03)] flex flex-col items-center justify-center max-w-xl mx-auto my-6"
            >
              <div className="w-20 h-20 bg-[#FFF8F0] border border-[#EDE5DC] rounded-full flex items-center justify-center mb-6 text-[#C68642] animate-bounce">
                <ShoppingBag className="w-9 h-9" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold mb-2">
                Your cart is empty
              </h2>
              <p className="text-xs sm:text-sm text-[#6D5D55] max-w-sm mb-8 leading-relaxed">
                Explore our selection of signature chocolate, nutella, walnut, and seasonal brownies to add some sweetness to your cart.
              </p>
              <Link href="/products">
                <Button
                  className="rounded-full px-8 py-5.5 text-xs font-bold shadow-md cursor-pointer hover:brightness-105 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #4E342E, #2D1B14)",
                    color: "#FFF8F0",
                  }}
                >
                  Browse Brownies
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="cart-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Cart Items List */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-[#EDE5DC] p-4 sm:p-6 shadow-[0_4px_20px_rgba(45,27,20,0.03)] space-y-4">
                <h2 className="font-serif text-lg font-bold border-b border-[#FAF6F1] pb-3 text-[#2D1B14]">
                  Items Summary ({cartCount})
                </h2>
                
                <div className="divide-y divide-[#EDE5DC] pr-1">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-4 py-4 first:pt-0 last:pb-0 items-center justify-between"
                    >
                      {/* Image */}
                      <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#EDE5DC] shrink-0 bg-[#FAF6F1]">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 80px, 80px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#F5EDE6] to-[#EFE4CC] flex items-center justify-center p-2">
                            <span className="font-serif text-[9px] font-bold text-center text-[#4E342E]/50 leading-tight">
                              {item.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info & Quantity controls */}
                      <div className="flex-1 min-w-0 ml-1 sm:ml-2">
                        <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D1B14] truncate mb-0.5">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#C68642] font-semibold mb-2">
                          ₹{item.price} each
                        </p>

                        <div className="flex items-center gap-2">
                          <QuantitySelector
                            quantity={item.quantity}
                            onAdd={() => updateQuantity(item.id, 1)}
                            onIncrease={() => updateQuantity(item.id, 1)}
                            onDecrease={() => updateQuantity(item.id, -1)}
                          />
                        </div>
                      </div>

                      {/* Total cost & Remove */}
                      <div className="flex flex-col items-end justify-between self-stretch shrink-0 py-1 pl-2">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#8B7E74] hover:text-red-600 transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                        <span className="font-sans font-extrabold text-sm sm:text-base text-[#4E342E]">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Order Summary Checkout Card */}
              <div className="lg:col-span-4 lg:sticky lg:top-28">
                <div className="bg-white rounded-3xl border border-[#EDE5DC] p-5 sm:p-6 shadow-[0_4px_20px_rgba(45,27,20,0.03)] space-y-4">
                  <h2 className="font-serif text-lg font-bold border-b border-[#FAF6F1] pb-3 text-[#2D1B14]">
                    Payment Summary
                  </h2>

                  <div className="space-y-3.5 text-xs sm:text-sm text-[#6D5D55] font-sans">
                    <div className="flex justify-between items-center">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#2D1B14]">₹{subtotal}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        GST (5% Included)
                        <HelpCircle className="w-3.5 h-3.5 text-[#8B7E74] cursor-help" title="Included in brownie price" />
                      </span>
                      <span className="font-medium text-[#2D1B14]">₹{tax}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Delivery Charges</span>
                      <span className="font-bold text-[#2D1B14]">
                        {deliveryFee === 0 ? (
                          <span className="text-green-600 font-extrabold">FREE</span>
                        ) : (
                          `₹${deliveryFee}`
                        )}
                      </span>
                    </div>

                    {deliveryFee > 0 && (
                      <div className="text-[11px] text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100/60 leading-normal">
                        💡 Tip: Add items worth <b>₹{500 - subtotal}</b> more for FREE delivery!
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-[#E8DDD4] my-2" />

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-bold text-sm sm:text-base text-[#2D1B14]">Total Amount</span>
                    <span className="font-sans text-xl sm:text-2xl font-extrabold text-[#4E342E]">₹{grandTotal}</span>
                  </div>

                  <Link href="/checkout" className="block w-full pt-4">
                    <Button
                      className="w-full py-5 rounded-2xl font-bold text-xs shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      style={{
                        background: "linear-gradient(135deg, #4E342E, #2D1B14)",
                        color: "#FFF8F0",
                      }}
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  )
}
