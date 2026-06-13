"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { ProductCard, Product } from "@/components/products/product-card"
import { ProductGridSkeleton } from "@/components/ui/skeletons"

// ─── Fallback products ────────────────────────────────────────────
const FALLBACK_PRODUCTS: Product[] = [
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

export function ProductGrid() {
  const filterBarRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [displayProducts, setDisplayProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showSort, setShowSort] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

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
              image: p.image_url ? p.image_url.split(',')[0].trim() : "",
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

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort"

  return (
    <div className="min-h-screen" style={{ paddingTop: "56px" }}>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div
        className="px-4 pt-6 pb-5"
        style={{ background: "linear-gradient(150deg,#FDF8F2 0%,#FAF3E8 60%,#F5ECD8 100%)" }}
      >
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C68642] mb-1.5 font-sans">
            Handcrafted with Love
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#2D1B14] tracking-tight">Our Brownies</h1>
          <p className="mt-2 text-[#6D5D55] text-sm md:text-base leading-relaxed max-w-md">
            Premium handcrafted brownies — baked fresh using finest ingredients and delivered directly to your doorstep.
          </p>
        </motion.div>
      </div>

      {/* ── Sticky Filter / Sort Bar ─────────────────────────────────── */}
      <div
        ref={filterBarRef}
        className="sticky z-30 bg-white border-b border-[#EDE5DC] shadow-[0_2px_10px_rgba(45,27,20,0.02)]"
        style={{ top: "56px" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-2 gap-2.5">
          {/* Category chips — horizontal scroll */}
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide py-1">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className="flex-shrink-0 mr-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
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
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Search toggle */}
            <AnimatePresence mode="wait">
              {showSearch ? (
                <motion.div
                  key="search-open"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="flex items-center gap-2 bg-[#FAF6F1] rounded-full px-3.5 py-2 border border-[#E8DDD4]"
                >
                  <Search className="w-4 h-4 text-[#8B7E74] flex-shrink-0" />
                  <input
                    autoFocus
                    type="search"
                    placeholder="Search brownies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-xs text-[#2D1B14] placeholder:text-[#8B7E74] outline-none min-w-0"
                  />
                  <button onClick={() => { setShowSearch(false); setSearchQuery("") }} className="cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="search-closed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setShowSearch(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF6F1] border border-[#E8DDD4] text-xs text-[#6D5D55] font-medium flex-shrink-0 cursor-pointer hover:bg-[#FAF6F1]/80"
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF6F1] border border-[#E8DDD4] text-xs text-[#6D5D55] font-medium transition-colors cursor-pointer hover:bg-[#FAF6F1]/80"
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
                    className="absolute right-0 top-full mt-1.5 w-48 rounded-xl overflow-hidden z-50"
                    style={{ background: "#fff", border: "1px solid #E8DDD4", boxShadow: "0 8px 24px rgba(45,27,20,0.13)" }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setShowSort(false) }}
                        className="w-full text-left px-4 py-3.5 text-xs font-semibold transition-colors hover:bg-[#FAF6F1] cursor-pointer"
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
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* ── Product count ────────────────────────────────────────────── */}
        <div className="pt-4 pb-2">
          <p className="text-xs text-[#8B7E74] font-medium font-sans">
            {loading ? "Loading…" : `${filteredProducts.length} brownie${filteredProducts.length !== 1 ? "s" : ""}`}
            {selectedCategory !== "all" && !loading && ` in ${CATEGORIES.find(c => c.value === selectedCategory)?.label}`}
          </p>
        </div>

        {/* ── Grid ──────────────────────────────────────────────────────── */}
        <div className="pb-32">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#EDE5DC] p-6 shadow-sm my-4">
              <p className="text-[#8B7E74] text-base font-semibold font-serif">No brownies found matching your filters.</p>
              <button
                onClick={() => { setSelectedCategory("all"); setSearchQuery("") }}
                className="mt-4 text-xs bg-[#4E342E] text-white px-5 py-2.5 rounded-full font-bold shadow-sm cursor-pointer hover:bg-[#2D1B14] transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
