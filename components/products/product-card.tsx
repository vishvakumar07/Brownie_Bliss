"use client"

import { motion } from "framer-motion"
import { Star, Heart } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { QuantitySelector } from "./quantity-selector"

export interface Product {
  id: string | number
  name: string
  slug: string
  description: string
  price: number
  rating: number
  reviews: number
  category: string
  badge: string | null
  inStock: boolean
  image: string
}

interface ProductCardProps {
  product: Product
}

function badgeStyle(badge: string | null) {
  switch (badge?.toLowerCase()) {
    case "best seller": return { bg: "#D4A373", text: "#2D1B14" }
    case "chef special": return { bg: "#4E342E", text: "#FFF8F0" }
    case "new": return { bg: "#2D6A4F", text: "#fff" }
    case "limited": return { bg: "#9A3412", text: "#fff" }
    case "seasonal": return { bg: "#7C3AED", text: "#fff" }
    default: return { bg: "#4E342E", text: "#FFF8F0" }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { items, addItem, updateQuantity } = useCart()
  const { wishlist, toggleWishlist } = useWishlist()

  const productIdStr = product.id.toString()
  const cartItem = items.find((i) => i.id === productIdStr)
  const cartQty = cartItem?.quantity ?? 0
  const isWishlisted = wishlist.includes(productIdStr)
  const bs = product.badge ? badgeStyle(product.badge) : null

  const handleAdd = () => {
    addItem({
      id: productIdStr,
      name: product.name,
      price: product.price,
      image: product.image,
    }, 1)
    toast.success(`${product.name} added to cart`, {
      style: { background: "#4E342E", color: "#FFF8F0" },
    })
  }

  const handleUpdate = (delta: number) => {
    updateQuantity(productIdStr, delta)
    if (delta > 0) {
      toast.success(`Increased ${product.name} quantity`, {
        style: { background: "#4E342E", color: "#FFF8F0" },
      })
    } else {
      toast.success(`Decreased ${product.name} quantity`, {
        style: { background: "#4E342E", color: "#FFF8F0" },
      })
    }
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleWishlist(productIdStr)
    if (isWishlisted) {
      toast.success(`Removed ${product.name} from favorites`, {
        style: { background: "#FFF8F0", color: "#4E342E" },
      })
    } else {
      toast.success(`Added ${product.name} to favorites ♥`, {
        style: { background: "#4E342E", color: "#FFF8F0" },
      })
    }
  }

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-[#EDE5DC] h-full shadow-[0_4px_16px_rgba(45,27,20,0.04)] hover:shadow-[0_10px_24px_rgba(45,27,20,0.10)]"
    >
      {/* Image container 1:1 ratio */}
      <div
        className="relative w-full overflow-hidden bg-[#FAF6F1] cursor-pointer"
        style={{ aspectRatio: "1 / 1" }}
        onClick={handleCardClick}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={false}
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F5EDE6] to-[#EFE4CC]">
            <span className="font-serif text-[#4E342E]/50 text-xs font-bold text-center px-3 leading-snug">
              {product.name}
            </span>
          </div>
        )}

        {/* Badge */}
        {bs && product.badge && (
          <span
            className="absolute top-2.5 left-2.5 text-[9px] font-extrabold px-2.5 py-1 rounded-full tracking-wide shadow-sm"
            style={{ background: bs.bg, color: bs.text }}
          >
            ★ {product.badge}
          </span>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-[#FFF8F0]/75 flex items-center justify-center backdrop-blur-[1px] z-10">
            <span className="bg-[#2D1B14] text-[#FFF8F0] text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#EDE5DC] shadow-sm uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist/Favorite Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-20 shadow-[0_2px_8px_rgba(45,27,20,0.15)] cursor-pointer"
          style={{
            background: isWishlisted ? "#4E342E" : "rgba(255,248,240,0.90)",
          }}
          aria-label="Toggle wishlist"
        >
          <Heart
            className="w-4 h-4"
            style={{
              color: isWishlisted ? "#FFF8F0" : "#4E342E",
              fill: isWishlisted ? "#FFF8F0" : "none",
            }}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-3 sm:p-4 bg-white">
        {/* Category badge */}
        <span className="text-[10px] uppercase font-bold text-[#C68642] tracking-wider mb-1 font-sans">
          {product.category}
        </span>

        {/* Product Title */}
        <h3
          className="font-serif font-bold text-[#2D1B14] leading-tight line-clamp-1 mb-2 text-sm sm:text-base cursor-pointer hover:text-[#C68642] transition-colors"
          onClick={handleCardClick}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#6D5D55] line-clamp-2 mb-3.5 leading-relaxed flex-grow">
          {product.description}
        </p>

        {/* Pricing & Cart Controls */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-[#FAF6F1]">
          <span className="font-sans font-extrabold text-[#2D1B14] text-base sm:text-lg">
            ₹{product.price}
          </span>

          <QuantitySelector
            quantity={cartQty}
            onAdd={handleAdd}
            onIncrease={() => handleUpdate(1)}
            onDecrease={() => handleUpdate(-1)}
            disabled={!product.inStock}
          />
        </div>

        {/* Rating & Review info */}
        <div className="flex items-center gap-1.5 mt-2.5 pt-1.5 border-t border-[#FAF6F1] text-[11px] text-[#6D5D55] font-sans">
          <div className="flex items-center gap-0.5 text-[#D4A373]">
            <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
          </div>
          {product.reviews > 0 ? (
            <>
              <span className="font-bold text-[#2D1B14]">{product.rating.toFixed(1)}</span>
              <span>({product.reviews} reviews)</span>
            </>
          ) : (
            <span>New Release</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
