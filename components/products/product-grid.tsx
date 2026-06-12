"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, ShoppingBag, Plus, Minus, X, ChevronRight, Heart, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

// ─── Fallback products ────────────────────────────────────────────
const FALLBACK_PRODUCTS = [
  { id: "fallback-1", name: "Classic Brownie", slug: "classic-brownie", description: "Our signature rich, fudgy chocolate brownie with a perfect crackly top.", price: 149, rating: 0, reviews: 0, category: "classic", badge: "Best Seller", inStock: true, image: "/Classic-Brownie.webp" },
  { id: "fallback-2", name: "Nutella Brownie", slug: "nutella-brownie", description: "Decadent brownie swirled with creamy Nutella hazelnut spread.", price: 179, rating: 0, reviews: 0, category: "premium", badge: "Popular", inStock: true, image: "/Nutela-Brownie.webp" },
  { id: "fallback-3", name: "Walnut Brownie", slug: "walnut-brownie", description: "Chunky California walnuts in our signature chocolate base.", price: 169, rating: 0, reviews: 0, category: "classic", badge: "Premium", inStock: true, image: "/Wallnut-Brownie.jpg" },
  { id: "fallback-4", name: "Triple Chocolate Brownie", slug: "triple-chocolate-brownie", description: "Three types of chocolate — dark, milk, and white — for ultimate indulgence.", price: 199, rating: 0, reviews: 0, category: "premium", badge: "Chef Special", inStock: true, image: "/Triple-Chocolate.jpg" },
  { id: "fallback-5", name: "Salted Caramel Brownie", slug: "salted-caramel-brownie", description: "Rich chocolate brownie drizzled with homemade salted caramel. Sweet meets salty perfection.", price: 189, rating: 0, reviews: 0, category: "special", badge: "New", inStock: true, image: "/salted-caramel-brownie.jpg" },
  { id: "fallback-6", name: "Peanut Butter Brownie", slug: "peanut-butter-brownie", description: "Creamy peanut butter swirled into our classic brownie. A heavenly combination.", price: 179, rating: 0, reviews: 0, category: "classic", badge: null, inStock: true, image: "/Peanut-Butter-Brownie.jpg" },
  { id: "fallback-7", name: "Cookie Dough Brownie", slug: "cookie-dough-brownie", description: "Edible cookie dough chunks baked into a rich chocolate brownie. Two desserts in one!", price: 209, rating: 0, reviews: 0, category: "special", badge: "Limited", inStock: false, image: "/Cookie-Dough-Brownie.jpg" },
  { id: "fallback-8", name: "Red Velvet Brownie", slug: "red-velvet-brownie", description: "A unique twist — red velvet brownie with cream cheese swirl. Elegant and delicious.", price: 189, rating: 0, reviews: 0, category: "premium", badge: "Seasonal", inStock: true, image: "/Red-Velvet-Brownie.jpg" },
]

const CATEGORIES = [
  { value: "all", label: "All Brownies" },
  { value: "classic", label: "Classic" },
  { value: "premium", label: "Premium" },
  { value: "special", label: "Special Edition" },
]

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]

interface Product {
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

interface CartItem {
  product: Product
  quantity: number
}

// ─── Badge colour map ─────────────────────────────────────────────
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

// ─── Single product card ───────────────────────────────────────────
function ProductCard({
  product,
  cartQty,
  onAdd,
  onUpdate,
  onWishlist,
  wishlisted,
  onCardClick,
}: {
  product: Product
  cartQty: number
  onAdd: () => void
  onUpdate: (delta: number) => void
  onWishlist: () => void
  wishlisted: boolean
  onCardClick: () => void
}) {
  const bs = product.badge ? badgeStyle(product.badge) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="group flex flex-col rounded-xl overflow-hidden bg-white border border-[#EDE5DC]"
      style={{ boxShadow: "0 2px 10px rgba(45,27,20,0.07)" }}
    >
      {/* ── Image container 1:1 ────────────────── */}
      <div
        className="relative w-full overflow-hidden bg-[#FAF6F1] cursor-pointer"
        style={{ aspectRatio: "1 / 1" }}
        onClick={onCardClick}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-400 group-hover:scale-107"
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F5EDE6] to-[#EFE4CC]">
            <span className="font-serif text-[#4E342E]/50 text-sm font-bold text-center px-3 leading-snug">
              {product.name}
            </span>
          </div>
        )}

        {/* Badge */}
        {bs && product.badge && (
          <span
            className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide"
            style={{ background: bs.bg, color: bs.text, fontSize: "10px", lineHeight: "1.4" }}
          >
            ★ {product.badge}
          </span>
        )}

        {/* Out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/65 flex items-center justify-center">
            <span className="bg-white text-[#2D1B14] text-xs font-semibold px-3 py-1 rounded-full border border-[#E8DDD4]">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.stopPropagation(); onWishlist() }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
          style={{
            background: wishlisted ? "#4E342E" : "rgba(255,248,240,0.90)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
          aria-label="Wishlist"
        >
          <Heart
            className="w-3.5 h-3.5"
            style={{ color: wishlisted ? "#FFF8F0" : "#4E342E", fill: wishlisted ? "#FFF8F0" : "none" }}
          />
        </button>
      </div>

      {/* ── Content ───────────────────────────── */}
      <div className="flex flex-col flex-1 px-2.5 pt-2 pb-2.5">
        {/* Name */}
        <h3
          className="font-semibold text-[#2D1B14] leading-snug line-clamp-2 mb-1.5 cursor-pointer hover:underline"
          style={{ fontSize: "clamp(11px, 3vw, 13px)" }}
          onClick={onCardClick}
        >
          {product.name}
        </h3>

        {/* Price + Add — most prominent row */}
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span
            className="font-sans font-bold text-[#2D1B14]"
            style={{ fontSize: "clamp(13px, 3.5vw, 15px)", letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}
          >
            ₹{product.price}
          </span>

          {cartQty > 0 ? (
            <div
              className="flex items-center rounded-full overflow-hidden border border-[#4E342E] h-7"
              style={{ background: "#FFF8F0" }}
            >
              <button
                onClick={() => onUpdate(-1)}
                className="w-7 h-full flex items-center justify-center text-[#4E342E] hover:bg-[#F5EDE6] transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center text-xs font-bold text-[#2D1B14]">{cartQty}</span>
              <button
                onClick={() => onUpdate(1)}
                className="w-7 h-full flex items-center justify-center text-[#4E342E] hover:bg-[#F5EDE6] transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              disabled={!product.inStock}
              className="flex items-center gap-1 text-[#FFF8F0] text-[11px] font-semibold px-2.5 py-1.5 rounded-full transition-all duration-150 disabled:opacity-40 active:scale-95"
              style={{ background: "linear-gradient(135deg,#4E342E,#2D1B14)", boxShadow: "0 2px 8px rgba(78,52,46,0.25)" }}
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          )}
        </div>

        {/* Rating row — below price */}
        <div className="flex items-center gap-1 font-sans">
          <Star className="w-3 h-3 fill-[#D4A373] text-[#D4A373]" />
          {product.reviews > 0 ? (
            <>
              <span className="text-[11px] font-semibold text-[#2D1B14]">{product.rating.toFixed(1)}</span>
              <span className="text-[10px] text-[#8B7E74]">({product.reviews})</span>
            </>
          ) : (
            <span className="text-[10px] text-[#8B7E74]">No reviews yet</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────
export function ProductGrid() {
  const router = useRouter()
  const filterBarRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [displayProducts, setDisplayProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Set<string | number>>(new Set())
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("brownie_cart")
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)) } catch { /* ignore */ }
    }
  }, [])

  const saveCart = (c: CartItem[]) => localStorage.setItem("brownie_cart", JSON.stringify(c))

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data: productsData, error: prodError } = await supabase
          .from("products").select("*").eq("active", true).gt("stock", 0).order("created_at", { ascending: false })
        if (prodError) throw prodError

        const { data: reviewsData } = await supabase
          .from("reviews").select("product_id, rating")

        const statsMap = (reviewsData || []).reduce((acc, r) => {
          if (!acc[r.product_id]) acc[r.product_id] = { sum: 0, count: 0 }
          acc[r.product_id].sum += r.rating
          acc[r.product_id].count += 1
          return acc
        }, {} as Record<string, { sum: number; count: number }>)

        if (productsData && productsData.length > 0) {
          setDisplayProducts(productsData.map((p) => {
            const stats = statsMap[p.id]
            return {
              id: p.id,
              name: p.name,
              slug: p.slug || p.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
              description: p.description,
              price: Number(p.price),
              rating: stats ? stats.sum / stats.count : 0,
              reviews: stats ? stats.count : 0,
              category: p.category || "classic",
              badge: p.badge || null,
              inStock: p.stock > 0 && p.active,
              image: p.image_url || "",
            }
          }))
        } else { setDisplayProducts(FALLBACK_PRODUCTS) }
      } catch { setDisplayProducts(FALLBACK_PRODUCTS) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const filteredProducts = displayProducts
    .filter((p) => {
      const q = searchQuery.toLowerCase()
      return (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
        (selectedCategory === "all" || p.category === selectedCategory)
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "rating") return b.rating - a.rating
      return b.reviews - a.reviews
    })

  const addToCart = (product: Product, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      const updated = existing
        ? prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i)
        : [...prev, { product, quantity: qty }]
      saveCart(updated)
      return updated
    })
    toast.success(`Added ${qty} × ${product.name} to cart`)
    setSelectedProduct(null)
    setQuantity(1)
  }

  const removeFromCart = (id: string | number) => {
    setCart((prev) => { const u = prev.filter((i) => i.product.id !== id); saveCart(u); return u })
  }

  const updateCartQty = (id: string | number, delta: number) => {
    setCart((prev) => {
      const u = prev.map((i) => i.product.id === id ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
      saveCart(u)
      return u
    })
  }

  const getQty = (id: string | number) => cart.find((i) => i.product.id === id)?.quantity ?? 0
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  const toggleWishlist = (id: string | number) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); toast("Removed from wishlist") }
      else { next.add(id); toast.success("Added to wishlist ♥") }
      return next
    })
  }

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort"

  return (
    <div className="min-h-screen" style={{ paddingTop: "56px" }}>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div
        className="px-4 pt-5 pb-4"
        style={{ background: "linear-gradient(150deg,#FDF8F2 0%,#FAF3E8 60%,#F5ECD8 100%)" }}
      >
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#D4A373] mb-1">
            Handcrafted with Love
          </p>
          <h1 className="font-serif text-2xl md:text-4xl font-bold text-[#2D1B14]">Our Brownies</h1>
          <p className="mt-1 text-[#6D5D55] text-sm leading-relaxed max-w-md">
            Premium handcrafted brownies — each baked fresh to order.
          </p>
        </motion.div>
      </div>

      {/* ── Sticky Filter / Sort Bar ─────────────────────────────────── */}
      <div
        ref={filterBarRef}
        className="sticky z-30 bg-white border-b border-[#EDE5DC]"
        style={{ top: "56px" }}
      >
        {/* Category chips — horizontal scroll */}
        <div className="flex items-center gap-0 overflow-x-auto px-3 pt-2.5 pb-0 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className="flex-shrink-0 mr-2 mb-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95"
                style={{
                  background: active ? "#4E342E" : "#FAF6F1",
                  color: active ? "#FFF8F0" : "#6D5D55",
                  border: active ? "none" : "1px solid #E8DDD4",
                  boxShadow: active ? "0 2px 8px rgba(78,52,46,0.22)" : "none",
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Search + Sort row */}
        <div className="flex items-center gap-2 px-3 pb-2.5">
          {/* Search toggle */}
          <AnimatePresence mode="wait">
            {showSearch ? (
              <motion.div
                key="search-open"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="flex-1 flex items-center gap-2 bg-[#FAF6F1] rounded-full px-3 py-2 border border-[#E8DDD4]"
              >
                <Search className="w-4 h-4 text-[#8B7E74] flex-shrink-0" />
                <input
                  autoFocus
                  type="search"
                  placeholder="Search brownies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-[#2D1B14] placeholder:text-[#8B7E74] outline-none min-w-0"
                />
                <button onClick={() => { setShowSearch(false); setSearchQuery("") }}>
                  <X className="w-4 h-4 text-[#8B7E74]" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="search-closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FAF6F1] border border-[#E8DDD4] text-xs text-[#6D5D55] font-medium flex-shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                Search
              </motion.button>
            )}
          </AnimatePresence>

          {/* Sort dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FAF6F1] border border-[#E8DDD4] text-xs text-[#6D5D55] font-medium transition-colors"
              style={{ background: showSort ? "#4E342E" : "", color: showSort ? "#FFF8F0" : "" }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentSortLabel}</span>
              <span className="sm:hidden">Sort</span>
              <ChevronDown className="w-3 h-3" style={{ transform: showSort ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-1 w-48 rounded-xl overflow-hidden z-50"
                  style={{ background: "#fff", border: "1px solid #E8DDD4", boxShadow: "0 8px 24px rgba(45,27,20,0.13)" }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSort(false) }}
                      className="w-full text-left px-4 py-3 text-xs font-medium transition-colors hover:bg-[#FAF6F1]"
                      style={{
                        color: sortBy === opt.value ? "#4E342E" : "#6D5D55",
                        fontWeight: sortBy === opt.value ? 700 : 500,
                      }}
                    >
                      {sortBy === opt.value && "✓ "}{opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Product count ────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-xs text-[#8B7E74]">
          {loading ? "Loading…" : `${filteredProducts.length} brownie${filteredProducts.length !== 1 ? "s" : ""}`}
          {selectedCategory !== "all" && !loading && ` in ${CATEGORIES.find(c => c.value === selectedCategory)?.label}`}
        </p>
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────── */}
      <div className="px-3 pb-32">
        {loading ? (
          /* Skeleton */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white border border-[#EDE5DC] animate-pulse">
                <div className="aspect-square bg-[#F5EDE6]" />
                <div className="p-2.5 space-y-2">
                  <div className="h-3 bg-[#F5EDE6] rounded-full w-4/5" />
                  <div className="h-2.5 bg-[#F5EDE6] rounded-full w-2/5" />
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-[#F5EDE6] rounded-full w-1/3" />
                    <div className="h-7 w-14 bg-[#F5EDE6] rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#8B7E74] text-base font-medium">No brownies found.</p>
            <button
              onClick={() => { setSelectedCategory("all"); setSearchQuery("") }}
              className="mt-3 text-sm text-[#4E342E] font-semibold underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2"
          >
            <AnimatePresence>
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04, duration: 0.24 }}
                >
                  <ProductCard
                    product={product}
                    cartQty={getQty(product.id)}
                    onAdd={() => addToCart(product, 1)}
                    onUpdate={(delta) => updateCartQty(product.id, delta)}
                    onWishlist={() => toggleWishlist(product.id)}
                    wishlisted={wishlist.has(product.id)}
                    onCardClick={() => router.push(`/products/${product.slug}`)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── Sticky Cart Bar ───────────────────────────────────────────── */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2"
            style={{ background: "linear-gradient(to top, rgba(255,248,240,1) 60%, transparent)" }}
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg,#4E342E,#2D1B14)",
                boxShadow: "0 8px 28px rgba(78,52,46,0.38)",
                color: "#FFF8F0",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ background: "#D4A373", color: "#2D1B14" }}
                  >
                    {cartCount}
                  </span>
                </div>
                <span className="font-semibold text-sm">{cartCount} item{cartCount > 1 ? "s" : ""} in cart</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">₹ {cartTotal}</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Dialog Removed */}

      {/* ── Cart Dialog ───────────────────────────────────────────────── */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-[#2D1B14] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Your Cart
            </DialogTitle>
          </DialogHeader>
          {cart.length === 0 ? (
            <p className="text-center py-8 text-[#6D5D55]">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              <div className="max-h-[280px] overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 pb-3 border-b border-[#E8DDD4]">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#2D1B14] line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-[#6D5D55]">₹ {item.product.price} each</p>
                    </div>
                    <div className="flex items-center border border-[#E8DDD4] rounded-full overflow-hidden">
                      <button className="w-7 h-7 flex items-center justify-center hover:bg-[#F5EDE6] text-[#4E342E]"
                        onClick={() => updateCartQty(item.product.id, -1)}>
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-[#2D1B14]">{item.quantity}</span>
                      <button className="w-7 h-7 flex items-center justify-center hover:bg-[#F5EDE6] text-[#4E342E]"
                        onClick={() => updateCartQty(item.product.id, 1)}>
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-[#2D1B14] w-16 text-right shrink-0">
                      ₹ {item.product.price * item.quantity}
                    </p>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-[#8B7E74] hover:text-[#9A3412] transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#E8DDD4]">
                <p className="font-semibold text-[#2D1B14]">Subtotal</p>
                <span
                  className="font-sans font-bold text-[#2D1B14]"
                  style={{ fontSize: "1.125rem", letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}
                >
                  ₹{cartTotal}
                </span>
              </div>
              <Button
                className="w-full py-3 rounded-xl transition-all active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg,#4E342E,#2D1B14)", color: "#FFF8F0", boxShadow: "0 4px 14px rgba(78,52,46,0.28)" }}
                onClick={() => { setIsCartOpen(false); router.push("/checkout") }}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
