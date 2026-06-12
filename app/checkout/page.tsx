"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Loader2, 
  ChevronRight, 
  Sparkles,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  image: string
}

interface CartItem {
  product: Product
  quantity: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [placedOrders, setPlacedOrders] = useState<any[]>([])

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

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("brownie_cart")
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        setCart(parsed)
        if (parsed.length === 0) {
          toast.error("Your cart is empty!")
          router.push("/products")
        }
      } catch (e) {
        console.error("Failed to parse cart", e)
        router.push("/products")
      }
    } else {
      toast.error("Your cart is empty!")
      router.push("/products")
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shippingCharge = cartTotal > 500 ? 0 : 50
  const finalTotal = cartTotal + shippingCharge

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
          product_name: item.product.name,
          product_id: item.product.id.toString().includes("fallback") ? null : item.product.id,
          quantity: item.quantity,
          total: item.product.price * item.quantity,
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
      setPlacedOrders(results.filter(Boolean))

      // Clear Cart
      localStorage.removeItem("brownie_cart")
      setCart([])
      setSuccess(true)
      toast.success("Order placed successfully!")
    } catch (err: any) {
      console.error("Order insertion failed:", err)
      toast.error("Failed to place order: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] pt-28 pb-16 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white rounded-3xl p-8 border border-[#E8DDD4] shadow-xl text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 border border-green-100">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <CheckCircle className="w-12 h-12" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold text-[#2D1B14] flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-[#D4A373] animate-pulse" />
              Order Placed!
              <Sparkles className="w-6 h-6 text-[#D4A373] animate-pulse" />
            </h1>
            <p className="text-[#6D5D55] text-pretty">
              Thank you for ordering with Brownie Bliss. Your freshly baked treats are being prepared.
            </p>
          </div>

          <div className="bg-[#FFF8F0] rounded-2xl p-5 border border-[#E8DDD4] text-left space-y-3">
            <p className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">Order Details</p>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#2D1B14]">{formData.name}</p>
              <p className="text-xs text-[#6D5D55]">{formData.phone} | {formData.email}</p>
            </div>
            <div className="h-px bg-[#E8DDD4] my-2" />
            <div className="space-y-2">
              {placedOrders.map((ord, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-[#2D1B14] font-medium">
                    {ord.product_name} <span className="text-[#6D5D55] text-xs">x{ord.quantity}</span>
                  </span>
                  <span className="font-sans font-bold text-[#4E342E]">₹{ord.total}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-[#E8DDD4] my-2" />
            <div className="flex justify-between items-center text-sm font-bold text-[#2D1B14]">
              <span>Grand Total ({formData.paymentMethod})</span>
              <span className="font-sans text-base font-bold text-[#4E342E]">₹{finalTotal}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1 bg-[#4E342E] hover:bg-[#2D1B14] text-[#FFF8F0] py-6 rounded-2xl"
              onClick={() => router.push("/products")}
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-[#E8DDD4] hover:bg-[#FFF8F0] text-[#4E342E] py-6 rounded-2xl"
              onClick={() => router.push("/")}
            >
              Go to Home Page
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => router.push("/products")}
          className="flex items-center gap-2 text-[#4E342E] hover:text-[#2D1B14] font-medium text-sm mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Store
        </button>

        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2D1B14] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Section */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section 1: Customer Info */}
              <Card className="border-[#E8DDD4] shadow-sm overflow-hidden bg-white">
                <div className="bg-[#FFF8F0] border-b border-[#E8DDD4] px-6 py-4 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#4E342E] text-white flex items-center justify-center font-bold text-sm">1</div>
                  <h2 className="font-serif text-lg font-bold text-[#2D1B14]">Customer Information</h2>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-bold text-[#2D1B14]">Full Name *</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        required 
                        placeholder="John Doe" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-bold text-[#2D1B14]">Mobile Number *</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        required 
                        placeholder="e.g. +91 98765 43210" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-[#2D1B14]">Email Address *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      required 
                      placeholder="john.doe@example.com" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Delivery Address */}
              <Card className="border-[#E8DDD4] shadow-sm overflow-hidden bg-white">
                <div className="bg-[#FFF8F0] border-b border-[#E8DDD4] px-6 py-4 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#4E342E] text-white flex items-center justify-center font-bold text-sm">2</div>
                  <h2 className="font-serif text-lg font-bold text-[#2D1B14]">Delivery Address</h2>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="houseNumber" className="text-xs font-bold text-[#2D1B14]">Flat / House No / Building *</Label>
                      <Input 
                        id="houseNumber" 
                        name="houseNumber" 
                        required 
                        placeholder="Apartment 4B, Bliss Residency" 
                        value={formData.houseNumber} 
                        onChange={handleInputChange} 
                        className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="streetAddress" className="text-xs font-bold text-[#2D1B14]">Street Address *</Label>
                      <Input 
                        id="streetAddress" 
                        name="streetAddress" 
                        required 
                        placeholder="Baker Street, Lane 2" 
                        value={formData.streetAddress} 
                        onChange={handleInputChange} 
                        className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="area" className="text-xs font-bold text-[#2D1B14]">Area / Locality</Label>
                      <Input 
                        id="area" 
                        name="area" 
                        placeholder="Near Central Park" 
                        value={formData.area} 
                        onChange={handleInputChange} 
                        className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-xs font-bold text-[#2D1B14]">City *</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        required 
                        placeholder="Mumbai" 
                        value={formData.city} 
                        onChange={handleInputChange} 
                        className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="state" className="text-xs font-bold text-[#2D1B14]">State *</Label>
                      <Input 
                        id="state" 
                        name="state" 
                        required 
                        placeholder="Maharashtra" 
                        value={formData.state} 
                        onChange={handleInputChange} 
                        className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pincode" className="text-xs font-bold text-[#2D1B14]">Pincode *</Label>
                      <Input 
                        id="pincode" 
                        name="pincode" 
                        required 
                        placeholder="400001" 
                        value={formData.pincode} 
                        onChange={handleInputChange} 
                        className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="landmark" className="text-xs font-bold text-[#2D1B14]">Landmark</Label>
                      <Input 
                        id="landmark" 
                        name="landmark" 
                        placeholder="Opposite Post Office" 
                        value={formData.landmark} 
                        onChange={handleInputChange} 
                        className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="specialInstructions" className="text-xs font-bold text-[#2D1B14]">Special Instructions / Note</Label>
                    <textarea 
                      id="specialInstructions" 
                      name="specialInstructions" 
                      placeholder="e.g. Please leave the parcel at the door, or call before delivery." 
                      rows={2}
                      value={formData.specialInstructions} 
                      onChange={handleInputChange} 
                      className="w-full text-sm p-3 bg-white border border-[#E8DDD4] focus:ring-1 focus:ring-[#D4A373] focus:border-[#D4A373] outline-none rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Section 3: Payment */}
              <Card className="border-[#E8DDD4] shadow-sm overflow-hidden bg-white">
                <div className="bg-[#FFF8F0] border-b border-[#E8DDD4] px-6 py-4 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#4E342E] text-white flex items-center justify-center font-bold text-sm">3</div>
                  <h2 className="font-serif text-lg font-bold text-[#2D1B14]">Payment Method</h2>
                </div>
                <CardContent className="p-6">
                  <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentChange} className="space-y-3">
                    <div className="flex items-center justify-between border border-[#E8DDD4] rounded-2xl p-4 hover:bg-[#FFF8F0] transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="COD" id="cod" className="text-[#4E342E]" />
                        <Label htmlFor="cod" className="font-semibold text-sm text-[#2D1B14] cursor-pointer">
                          Cash on Delivery (COD)
                        </Label>
                      </div>
                      <Truck className="w-5 h-5 text-[#6D5D55]" />
                    </div>

                    <div className="flex flex-col border border-[#E8DDD4] rounded-2xl p-4 hover:bg-[#FFF8F0] transition-colors">
                      <div className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="Online" id="online" className="text-[#4E342E]" />
                          <Label htmlFor="online" className="font-semibold text-sm text-[#2D1B14] cursor-pointer">
                            Pay Online (Cards, UPI, Netbanking)
                          </Label>
                        </div>
                        <CreditCard className="w-5 h-5 text-[#6D5D55]" />
                      </div>
                      
                      {formData.paymentMethod === "Online" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t border-[#E8DDD4] space-y-2"
                        >
                          <div className="bg-[#F5EDE6] p-3 rounded-xl flex items-start gap-3">
                            <Info className="w-4 h-4 text-[#4E342E] shrink-0 mt-0.5" />
                            <p className="text-xs text-[#6D5D55] leading-relaxed">
                              This is a secure simulation interface. Upon clicking "Place Order", a payment window will process the transaction automatically.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Submit Button for Mobile */}
              <div className="block lg:hidden mt-6">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#4E342E] hover:bg-[#2D1B14] text-[#FFF8F0] font-bold py-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      Place Order · ₹{finalTotal}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <Card className="border-[#E8DDD4] shadow-sm bg-white overflow-hidden">
              <div className="bg-[#FFF8F0] border-b border-[#E8DDD4] px-6 py-4">
                <h2 className="font-serif text-lg font-bold text-[#2D1B14] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#4E342E]" />
                  Order Summary
                </h2>
              </div>
              <CardContent className="p-6 space-y-4">
                
                {/* Items List */}
                <div className="max-h-[260px] overflow-y-auto divide-y divide-[#E8DDD4] pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center">
                      <div className="relative w-14 h-14 bg-gradient-to-br from-[#3B1F14] to-[#1a0e08] rounded-xl overflow-hidden shrink-0">
                        {item.product.image ? (
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center px-1">
                            <span className="font-serif text-white/70 text-[9px] font-bold text-center leading-tight">
                              {item.product.name}
                            </span>
                          </div>
                        )}
                        <span className="absolute -top-1.5 -right-1.5 bg-[#4E342E] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#2D1B14] truncate">{item.product.name}</p>
                        <p className="font-sans text-xs text-[#6D5D55]">₹{item.product.price} each</p>
                      </div>
                      <p className="font-sans font-bold text-sm text-[#4E342E] shrink-0">₹{item.product.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[#E8DDD4] my-2" />

                {/* Subtotal & Delivery Charges */}
                <div className="space-y-2 text-sm text-[#6D5D55]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-sans font-medium text-[#2D1B14]">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-sans font-medium text-[#2D1B14]">
                      {shippingCharge === 0 ? (
                        <span className="text-green-600 font-semibold font-sans">FREE</span>
                      ) : (
                        `₹${shippingCharge}`
                      )}
                    </span>
                  </div>
                  {shippingCharge > 0 && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 mt-1">
                      💡 Tip: Add items worth ₹{500 - cartTotal} more for FREE delivery!
                    </p>
                  )}
                </div>

                <div className="h-px bg-[#E8DDD4] my-2" />

                {/* Grand Total */}
                <div className="flex justify-between items-baseline pt-2">
                  <span className="font-bold text-base text-[#2D1B14]">Total Amount</span>
                  <span className="font-sans text-2xl font-bold text-[#4E342E]">₹{finalTotal}</span>
                </div>

                {/* Submit Button for Desktop */}
                <div className="hidden lg:block pt-4">
                  <Button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#4E342E] hover:bg-[#2D1B14] text-[#FFF8F0] font-bold py-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
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
    </div>
  )
}
