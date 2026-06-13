"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function CheckoutPage() {
  const router = useRouter()
  const {
    items: cart,
    subtotal: cartTotal,
    deliveryFee: shippingCharge,
    grandTotal: finalTotal,
    clearCart,
  } = useCart()

  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    houseNumber: "",
    streetAddress: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    specialInstructions: "",
    paymentMethod: "COD"
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if cart is empty on mount
  useEffect(() => {
    if (mounted && cart.length === 0) {
      toast.error("Your cart is empty!")
      router.push("/products")
    }
  }, [mounted, cart, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (cart.length === 0) {
      toast.error("No items in cart!")
      return
    }

    if (!formData.name || !formData.phone || !formData.email || !formData.houseNumber || !formData.streetAddress || !formData.city || !formData.state || !formData.pincode) {
      toast.error("Please fill in all required fields.")
      return
    }

    setLoading(true)

    try {
      // Simulate processing delay for online payment
      if (formData.paymentMethod === "Online") {
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      // Concatenated address for legacy systems
      const fullAddress = `${formData.houseNumber}, ${formData.streetAddress}, ${formData.area ? formData.area + ", " : ""}${formData.city}, ${formData.state} - ${formData.pincode}${formData.landmark ? " (Landmark: " + formData.landmark + ")" : ""}`

      const orderPromises = cart.map(async (item) => {
        const orderData = {
          customer_name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: fullAddress,
          house_number: formData.houseNumber,
          street_address: formData.streetAddress,
          area: formData.area || null,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark || null,
          product_name: item.name,
          product_id: item.id.toString().includes("fallback") ? null : (isNaN(Number(item.id)) ? item.id : Number(item.id)),
          quantity: item.quantity,
          total: item.price * item.quantity,
          payment_method: formData.paymentMethod,
          special_instructions: formData.specialInstructions || null,
          status: "Pending"
        }

        const { data, error } = await supabase
          .from("orders")
          .insert(orderData)
          .select()

        if (error) throw error
        return data ? data[0] : null
      })

      const results = await Promise.all(orderPromises)
      
      // Save details to sessionStorage for success page presentation
      sessionStorage.setItem(
        "last_placed_order",
        JSON.stringify({
          placedOrders: results.filter(Boolean),
          formData,
          finalTotal,
          shippingCharge
        })
      )

      // Clear Zustand Cart
      clearCart()
      toast.success("Order placed successfully!")
      router.push("/checkout/success")
    } catch (err: any) {
      console.error("Order insertion failed:", err)
      toast.error("Failed to place order: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center pt-28 pb-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#4E342E]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col justify-between text-[#2D1B14] font-sans">
      <Navbar />

      <div className="flex-grow pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Back Button */}
        <button 
          onClick={() => router.push("/cart")}
          className="flex items-center gap-2 text-[#4E342E] hover:text-[#2D1B14] font-semibold text-xs mb-8 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Cart
        </button>

        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#2D1B14] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Section */}
          <div className="lg:col-span-7 space-y-6">
            <CheckoutForm
              formData={formData}
              loading={loading}
              finalTotal={finalTotal}
              handleInputChange={handleInputChange}
              handlePaymentChange={handlePaymentChange}
              handleSubmit={handleSubmit}
            />
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <Card className="border-[#E8DDD4] shadow-sm bg-white overflow-hidden rounded-2xl">
              <div className="bg-[#FFF8F0] border-b border-[#E8DDD4] px-6 py-4">
                <h2 className="font-serif text-base sm:text-lg font-bold text-[#2D1B14] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#4E342E]" />
                  Order Summary
                </h2>
              </div>
              <CardContent className="p-6 space-y-4">
                
                {/* Items List */}
                <div className="max-h-[260px] overflow-y-auto divide-y divide-[#E8DDD4] pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 py-3.5 first:pt-0 last:pb-0 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-gradient-to-br from-[#3B1F14] to-[#1a0e08] rounded-xl overflow-hidden shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center px-1">
                              <span className="font-serif text-white/70 text-[9px] font-bold text-center leading-tight">
                                {item.name}
                              </span>
                            </div>
                          )}
                          <span className="absolute -top-1.5 -right-1.5 bg-[#4E342E] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs sm:text-sm text-[#2D1B14] truncate">{item.name}</p>
                          <p className="font-sans text-[11px] text-[#6D5D55]">₹{item.price} each</p>
                        </div>
                      </div>
                      <p className="font-sans font-bold text-xs sm:text-sm text-[#4E342E] shrink-0">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[#E8DDD4] my-2" />

                {/* Subtotal & Delivery Charges */}
                <div className="space-y-2 text-xs sm:text-sm text-[#6D5D55]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-sans font-semibold text-[#2D1B14]">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-sans font-semibold text-[#2D1B14]">
                      {shippingCharge === 0 ? (
                        <span className="text-green-600 font-extrabold font-sans">FREE</span>
                      ) : (
                        `₹${shippingCharge}`
                      )}
                    </span>
                  </div>
                  {shippingCharge > 0 && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100 mt-1">
                      💡 Tip: Add items worth ₹{500 - cartTotal} more for FREE delivery!
                    </p>
                  )}
                </div>

                <div className="h-px bg-[#E8DDD4] my-2" />

                {/* Grand Total */}
                <div className="flex justify-between items-baseline pt-2">
                  <span className="font-bold text-sm sm:text-base text-[#2D1B14]">Total Amount</span>
                  <span className="font-sans text-xl sm:text-2xl font-extrabold text-[#4E342E]">₹{finalTotal}</span>
                </div>

                {/* Submit Button for Desktop View */}
                <div className="hidden lg:block pt-4">
                  <Button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#4E342E] hover:bg-[#2D1B14] text-[#FFF8F0] font-bold py-6.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        Place Order · ₹{finalTotal}
                      </>
                    )}
                  </Button>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>

      </div>
      <Footer />
    </div>
  )
}
