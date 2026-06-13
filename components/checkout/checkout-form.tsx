"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Truck, CreditCard, Info, Loader2 } from "lucide-react"

interface CheckoutFormProps {
  formData: {
    name: string
    phone: string
    email: string
    houseNumber: string
    streetAddress: string
    area: string
    city: string
    state: string
    pincode: string
    landmark: string
    specialInstructions: string
    paymentMethod: string
  }
  loading: boolean
  finalTotal: number
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handlePaymentChange: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
}

export function CheckoutForm({
  formData,
  loading,
  finalTotal,
  handleInputChange,
  handlePaymentChange,
  handleSubmit,
}: CheckoutFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Customer Info */}
      <Card className="border-[#E8DDD4] shadow-sm overflow-hidden bg-white rounded-2xl">
        <div className="bg-[#FFF8F0] border-b border-[#E8DDD4] px-6 py-4 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#4E342E] text-white flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#2D1B14]">
            Customer Information
          </h2>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold text-[#2D1B14]">
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl text-xs sm:text-sm py-2.5 h-10.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-bold text-[#2D1B14]">
                Mobile Number *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl text-xs sm:text-sm py-2.5 h-10.5"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold text-[#2D1B14]">
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl text-xs sm:text-sm py-2.5 h-10.5"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Delivery Address */}
      <Card className="border-[#E8DDD4] shadow-sm overflow-hidden bg-white rounded-2xl">
        <div className="bg-[#FFF8F0] border-b border-[#E8DDD4] px-6 py-4 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#4E342E] text-white flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#2D1B14]">
            Delivery Address
          </h2>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="houseNumber" className="text-xs font-bold text-[#2D1B14]">
                Flat / House No / Building *
              </Label>
              <Input
                id="houseNumber"
                name="houseNumber"
                required
                placeholder="Apartment 4B, Bliss Residency"
                value={formData.houseNumber}
                onChange={handleInputChange}
                className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl text-xs sm:text-sm py-2.5 h-10.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="streetAddress" className="text-xs font-bold text-[#2D1B14]">
                Street Address *
              </Label>
              <Input
                id="streetAddress"
                name="streetAddress"
                required
                placeholder="Baker Street, Lane 2"
                value={formData.streetAddress}
                onChange={handleInputChange}
                className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl text-xs sm:text-sm py-2.5 h-10.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="area" className="text-xs font-bold text-[#2D1B14]">
                Area / Locality
              </Label>
              <Input
                id="area"
                name="area"
                placeholder="Near Central Park"
                value={formData.area}
                onChange={handleInputChange}
                className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl text-xs sm:text-sm py-2.5 h-10.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-xs font-bold text-[#2D1B14]">
                City *
              </Label>
              <Input
                id="city"
                name="city"
                required
                placeholder="Mumbai"
                value={formData.city}
                onChange={handleInputChange}
                className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl text-xs sm:text-sm py-2.5 h-10.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="state" className="text-xs font-bold text-[#2D1B14]">
                State *
              </Label>
              <Input
                id="state"
                name="state"
                required
                placeholder="Maharashtra"
                value={formData.state}
                onChange={handleInputChange}
                className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl text-xs sm:text-sm py-2.5 h-10.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pincode" className="text-xs font-bold text-[#2D1B14]">
                Pincode *
              </Label>
              <Input
                id="pincode"
                name="pincode"
                required
                placeholder="400001"
                value={formData.pincode}
                onChange={handleInputChange}
                className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl text-xs sm:text-sm py-2.5 h-10.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="landmark" className="text-xs font-bold text-[#2D1B14]">
                Landmark
              </Label>
              <Input
                id="landmark"
                name="landmark"
                placeholder="Opposite Post Office"
                value={formData.landmark}
                onChange={handleInputChange}
                className="bg-white border-[#E8DDD4] focus:ring-[#D4A373] focus:border-[#D4A373] rounded-xl text-xs sm:text-sm py-2.5 h-10.5"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="specialInstructions" className="text-xs font-bold text-[#2D1B14]">
              Special Instructions / Note
            </Label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              placeholder="e.g. Please leave the parcel at the door, or call before delivery."
              rows={2}
              value={formData.specialInstructions}
              onChange={handleInputChange}
              className="w-full text-xs sm:text-sm p-3 bg-white border border-[#E8DDD4] focus:ring-1 focus:ring-[#D4A373] focus:border-[#D4A373] outline-none rounded-xl font-sans"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Payment */}
      <Card className="border-[#E8DDD4] shadow-sm overflow-hidden bg-white rounded-2xl">
        <div className="bg-[#FFF8F0] border-b border-[#E8DDD4] px-6 py-4 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#4E342E] text-white flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#2D1B14]">
            Payment Method
          </h2>
        </div>
        <CardContent className="p-6">
          <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentChange} className="space-y-3">
            <div className="flex items-center justify-between border border-[#E8DDD4] rounded-2xl p-4 hover:bg-[#FFF8F0] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="COD" id="cod" className="text-[#4E342E]" />
                <Label htmlFor="cod" className="font-semibold text-xs sm:text-sm text-[#2D1B14] cursor-pointer">
                  Cash on Delivery (COD)
                </Label>
              </div>
              <Truck className="w-5 h-5 text-[#6D5D55]" />
            </div>

            <div className="flex flex-col border border-[#E8DDD4] rounded-2xl p-4 hover:bg-[#FFF8F0] transition-colors font-sans">
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Online" id="online" className="text-[#4E342E]" />
                  <Label htmlFor="online" className="font-semibold text-xs sm:text-sm text-[#2D1B14] cursor-pointer">
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
                  <div className="bg-[#FAF6F2] p-3 rounded-xl flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[#4E342E] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#6D5D55] leading-relaxed">
                      This is a secure simulation interface. Upon clicking "Place Order", a payment window will process the transaction automatically.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Submit Button for Mobile View */}
      <div className="block lg:hidden mt-6">
        <Button 
          type="submit"
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
    </form>
  )
}
