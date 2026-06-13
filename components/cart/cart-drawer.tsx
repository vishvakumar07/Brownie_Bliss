"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { QuantitySelector } from "@/components/products/quantity-selector"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    subtotal,
    deliveryFee,
    grandTotal,
    cartCount,
  } = useCart()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full bg-[#FFF8F0] border-l border-[#EDE5DC] shadow-2xl focus:outline-none"
      >
        {/* Drawer Header */}
        <SheetHeader className="px-5 py-4 border-b border-[#EDE5DC] flex flex-row items-center justify-between space-y-0 flex-shrink-0">
          <SheetTitle className="font-serif text-lg font-bold text-[#2D1B14] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C68642]" />
            Your Blissful Cart ({cartCount})
          </SheetTitle>
        </SheetHeader>

        {/* Drawer Body - Scrollable Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-10">
              <div className="w-20 h-20 rounded-full bg-[#FAF6F1] border border-[#EDE5DC] flex items-center justify-center mb-5 text-[#C68642] animate-bounce">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2D1B14] mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs text-[#6D5D55] max-w-[240px] mb-6 leading-relaxed">
                Add some delicious, fresh-baked brownies to fill it with happiness.
              </p>
              <SheetClose asChild>
                <Button
                  className="rounded-full px-6 py-4 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #4E342E, #2D1B14)",
                    color: "#FFF8F0",
                  }}
                >
                  Browse Brownies
                </Button>
              </SheetClose>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3.5 pb-4 border-b border-[#E8DDD4] last:border-none"
              >
                {/* Product Image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#EDE5DC] shrink-0 bg-[#FAF6F1]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F5EDE6] to-[#EFE4CC] flex items-center justify-center p-1">
                      <span className="font-serif text-[8px] font-bold text-center text-[#4E342E]/50 leading-tight">
                        {item.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-[#2D1B14] truncate mb-0.5 leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-xs font-bold text-[#C68642] font-sans mb-1.5">
                    ₹{item.price} each
                  </p>
                  
                  {/* Quantity Control */}
                  <div className="flex items-center gap-2">
                    <QuantitySelector
                      quantity={item.quantity}
                      onAdd={() => updateQuantity(item.id, 1)}
                      onIncrease={() => updateQuantity(item.id, 1)}
                      onDecrease={() => updateQuantity(item.id, -1)}
                    />
                  </div>
                </div>

                {/* Total Item Price & Remove */}
                <div className="flex flex-col items-end justify-between self-stretch shrink-0 py-0.5">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#8B7E74] hover:text-red-600 transition-colors p-1 cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="font-sans font-bold text-xs text-[#2D1B14]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer - Sticky Cart Summary & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-[#EDE5DC] bg-white px-5 py-4 space-y-4 flex-shrink-0 shadow-[0_-4px_20px_rgba(78,52,46,0.06)]">
            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-[#6D5D55]">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-sans font-semibold text-[#2D1B14]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Charge</span>
                <span className="font-sans font-semibold text-[#2D1B14]">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              
              {deliveryFee > 0 && (
                <div className="text-[10px] text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100/60 leading-normal">
                  💡 Tip: Add items worth <b>₹{500 - subtotal}</b> more for FREE delivery!
                </div>
              )}
            </div>

            <div className="h-px bg-[#E8DDD4]" />

            {/* Total */}
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-sm text-[#2D1B14]">Total Amount</span>
              <span className="font-sans text-xl font-extrabold text-[#4E342E]">₹{grandTotal}</span>
            </div>

            {/* Checkout CTA */}
            <SheetClose asChild>
              <Link href="/cart" className="block w-full">
                <Button
                  className="w-full py-4.5 rounded-xl font-bold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #4E342E, #2D1B14)",
                    color: "#FFF8F0",
                  }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
