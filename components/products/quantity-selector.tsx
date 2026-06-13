"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

interface QuantitySelectorProps {
  quantity: number
  onAdd: () => void
  onIncrease: () => void
  onDecrease: () => void
  className?: string
  disabled?: boolean
}

export function QuantitySelector({
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
  className = "",
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <AnimatePresence mode="wait">
        {quantity > 0 ? (
          <motion.div
            key="controls"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="flex items-center rounded-full overflow-hidden border border-[#4E342E] h-8.5 shadow-sm bg-[#FFF8F0]"
          >
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.stopPropagation()
                onDecrease()
              }}
              disabled={disabled}
              className="w-8.5 h-full flex items-center justify-center text-[#4E342E] hover:bg-[#F5EDE6] transition-colors focus:outline-none cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </motion.button>
            
            <motion.span
              key={quantity}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-6.5 text-center text-xs font-bold text-[#2D1B14] select-none font-sans"
            >
              {quantity}
            </motion.span>
            
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.stopPropagation()
                onIncrease()
              }}
              disabled={disabled}
              className="w-8.5 h-full flex items-center justify-center text-[#4E342E] hover:bg-[#F5EDE6] transition-colors focus:outline-none cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            key="add-btn"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => {
              e.stopPropagation()
              onAdd()
            }}
            disabled={disabled}
            className="flex items-center justify-center gap-1 text-[#FFF8F0] text-xs font-semibold px-4 py-2 rounded-full transition-all disabled:opacity-40 focus:outline-none cursor-pointer h-8.5 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #4E342E, #2D1B14)",
              boxShadow: "0 2px 8px rgba(78,52,46,0.25)",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
