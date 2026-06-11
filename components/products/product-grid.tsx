"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Star, ShoppingBag, Plus, Minus, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

// Fallback products shown when DB has no products yet
const FALLBACK_PRODUCTS = [
  {
    id: "fallback-1",
    name: "Classic Brownie",
    description: "Our signature rich, fudgy chocolate brownie with a perfect crackly top.",
    price: 149,
    rating: 4.9,
    reviews: 127,
    category: "classic",
    badge: "Best Seller",
    inStock: true,
    image: "/Classic-Brownie.webp",
  },
  {
    id: "fallback-2",
    name: "Nutella Brownie",
    description: "Decadent brownie swirled with creamy Nutella hazelnut spread.",
    price: 179,
    rating: 4.8,
    reviews: 89,
    category: "premium",
    badge: "Popular",
    inStock: true,
    image: "/Nutela-Brownie.webp",
  },
  {
    id: "fallback-3",
    name: "Walnut Brownie",
    description: "Chunky California walnuts in our signature chocolate base.",
    price: 169,
    rating: 4.9,
    reviews: 103,
    category: "classic",
    badge: "Premium",
    inStock: true,
    image: "/Wallnut-Brownie.jpg",
  },
  {
    id: "fallback-4",
    name: "Triple Chocolate Brownie",
    description: "Three types of chocolate — dark, milk, and white — for ultimate indulgence.",
    price: 199,
    rating: 5.0,
    reviews: 156,
    category: "premium",
    badge: "Chef Special",
    inStock: true,
    image: "/Triple-Chocolate.jpg",
  },
  {
    id: "fallback-5",
    name: "Salted Caramel Brownie",
    description: "Rich chocolate brownie drizzled with homemade salted caramel. Sweet meets salty perfection.",
    price: 189,
    rating: 4.7,
    reviews: 76,
    category: "special",
    badge: "New",
    inStock: true,
    image: "/salted-caramel-brownie.jpg",
  },
  {
    id: "fallback-6",
    name: "Peanut Butter Brownie",
    description: "Creamy peanut butter swirled into our classic brownie. A heavenly combination.",
    price: 179,
    rating: 4.8,
    reviews: 92,
    category: "classic",
    badge: null,
    inStock: true,
    image: "/Peanut-Butter-Brownie.jpg",
  },
  {
    id: "fallback-7",
    name: "Cookie Dough Brownie",
    description: "Edible cookie dough chunks baked into a rich chocolate brownie. Two desserts in one!",
    price: 209,
    rating: 4.9,
    reviews: 64,
    category: "special",
    badge: "Limited",
    inStock: false,
    image: "/Cookie-Dough-Brownie.jpg",
  },
  {
    id: "fallback-8",
    name: "Red Velvet Brownie",
    description: "A unique twist — red velvet brownie with cream cheese swirl. Elegant and delicious.",
    price: 189,
    rating: 4.6,
    reviews: 58,
    category: "premium",
    badge: "Seasonal",
    inStock: true,
    image: "/Red-Velvet-Brownie.jpg",
  },
]

const categories = [
  { value: "all", label: "All Brownies" },
  { value: "classic", label: "Classic" },
  { value: "premium", label: "Premium" },
  { value: "special", label: "Special Edition" },
]

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]

interface Product {
  id: string | number
  name: string
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

interface CheckoutForm {
  name: string
  phone: string
  address: string
  payment: string
  instructions: string
}

export function ProductGrid() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [displayProducts, setDisplayProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("brownie_cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse saved cart", e)
      }
    }
  }, [])

  const saveCartToLocalStorage = (newCart: CartItem[]) => {
    localStorage.setItem("brownie_cart", JSON.stringify(newCart))
  }

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("active", true)
          .gt("stock", 0)
          .order("created_at", { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          setDisplayProducts(
            data.map((p) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: Number(p.price),
              rating: 4.8,
              reviews: Math.floor(20 + Math.random() * 80),
              category: p.category || "classic",
              badge: p.badge || null,
              inStock: p.stock > 0 && p.active,
              image: p.image_url || "",
            }))
          )
        } else {
          setDisplayProducts(FALLBACK_PRODUCTS)
        }
      } catch (err) {
        console.error("Failed to load products:", err)
        setDisplayProducts(FALLBACK_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filteredProducts = displayProducts
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price
        case "price-high": return b.price - a.price
        case "rating": return b.rating - a.rating
        default: return b.reviews - a.reviews
      }
    })

  const addToCart = (product: Product, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      const updated = existing
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + qty }
              : item
          )
        : [...prev, { product, quantity: qty }]
      saveCartToLocalStorage(updated)
      return updated
    })
    toast.success(`Added ${qty} × ${product.name} to cart`)
    setSelectedProduct(null)
    setQuantity(1)
  }

  const removeFromCart = (productId: string | number) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId)
      saveCartToLocalStorage(updated)
      return updated
    })
  }

  const updateCartQty = (productId: string | number, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter((item): item is CartItem => item !== null)
      saveCartToLocalStorage(updated)
      return updated
    })
  }

  const getCartItemQty = (productId: string | number) => {
    const item = cart.find((i) => i.product.id === productId)
    return item ? item.quantity : 0
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="bg-cream py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-cocoa">Our Brownies</h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty">
              Explore our collection of handcrafted brownies, each made with premium ingredients and a whole lot of love.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search brownies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cart Summary Bar */}
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="fixed top-[76px] md:top-[92px] left-1/2 z-40 w-[92%] max-w-4xl p-4 bg-[#FFF8F0]/95 border border-[#E8DDD4] shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#4E342E]/10 rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-[#4E342E]" />
                </div>
                <div>
                  <span className="font-semibold text-sm text-[#2D1B14] block">
                    {cartCount} item{cartCount > 1 ? "s" : ""} in cart
                  </span>
                  <span className="text-xs text-[#6D5D55]">Freshly baked treats ready</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-sans text-lg font-extrabold text-[#4E342E] tracking-tight">
                  Rs. {cartTotal}
                </span>
                <Button
                  className="bg-[#4E342E] hover:bg-[#2D1B14] text-[#FFF8F0] gap-1.5 rounded-xl text-xs font-semibold px-4 py-2 h-9 shadow-sm"
                  onClick={() => setIsCartOpen(true)}
                >
                  View Cart <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16 text-muted-foreground">Loading products…</div>
        )}

        {/* Products Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="flex"
              >
                <div className="group w-full flex flex-col rounded-2xl overflow-hidden bg-white border border-[#E8DDD4] shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.13)] transition-shadow duration-300">

                  {/* IMAGE — 1:1 square, neutral bg, no dark overlay */}
                  <div
                    className="relative w-full flex-shrink-0 overflow-hidden cursor-pointer bg-[#FAF6F1] aspect-square"
                    onClick={() => product.inStock && setSelectedProduct(product)}
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center px-5 bg-gradient-to-br from-[#F5EDE6] to-[#EFE4CC]">
                        <span className="font-serif text-[#4E342E]/60 text-lg font-bold text-center leading-snug select-none">
                          {product.name}
                        </span>
                      </div>
                    )}
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#D4A373] text-[#2D1B14] text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                        {product.badge}
                      </span>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="bg-white text-[#2D1B14] text-sm font-semibold px-4 py-1.5 rounded-full shadow border border-[#E8DDD4]">Out of Stock</span>
                      </div>
                    )}
                    {product.inStock && (
                      <div className="absolute inset-0 bg-[#2D1B14]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedProduct(product) }}
                          className="bg-white text-[#2D1B14] hover:bg-[#D4A373] hover:text-white text-sm font-semibold px-5 py-2 rounded-full shadow transition-colors duration-150"
                        >
                          Quick View
                        </button>
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-col flex-1 px-4 pt-3 pb-4 bg-white">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-semibold text-[#2D1B14] text-sm leading-snug line-clamp-1 flex-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center justify-center border border-green-600 w-3.5 h-3.5 p-[2px] rounded-[2px] shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                        </span>
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0 mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
                        <span className="text-xs font-semibold text-[#2D1B14]">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-[#6D5D55] text-xs leading-relaxed line-clamp-2 flex-1 mb-3">
                      {product.description}
                    </p>
                    <div className="h-px bg-[#E8DDD4] mb-3" />
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif text-base font-bold text-[#4E342E]">
                        Rs. {product.price}
                      </span>
                      {getCartItemQty(product.id) > 0 ? (
                        <div className="flex items-center border border-[#4E342E] rounded-full overflow-hidden bg-white shadow-sm h-8">
                          <button
                            onClick={() => updateCartQty(product.id, -1)}
                            className="w-8 h-full flex items-center justify-center hover:bg-[#F5EDE6] text-[#4E342E] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-[#2D1B14]">
                            {getCartItemQty(product.id)}
                          </span>
                          <button
                            onClick={() => updateCartQty(product.id, 1)}
                            className="w-8 h-full flex items-center justify-center hover:bg-[#F5EDE6] text-[#4E342E] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product, 1)}
                          disabled={!product.inStock}
                          className="flex items-center gap-1.5 bg-[#4E342E] hover:bg-[#2D1B14] disabled:opacity-40 disabled:cursor-not-allowed text-[#FFF8F0] text-xs font-semibold px-3.5 py-2 rounded-full transition-colors duration-150 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No brownies found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* ── Quick View Dialog ── */}
      <Dialog open={!!selectedProduct} onOpenChange={() => { setSelectedProduct(null); setQuantity(1) }}>
        <DialogContent className="max-w-md rounded-2xl overflow-hidden p-0 gap-0">
          {selectedProduct && (
            <>
              {/* Quick View image — 1:1 square, light bg */}
              <div className="relative w-full aspect-square bg-[#FAF6F1]" >
                {selectedProduct.image ? (
                  <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-contain" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center px-6 bg-gradient-to-br from-[#F5EDE6] to-[#EFE4CC]">
                    <span className="font-serif text-[#4E342E]/60 text-2xl font-bold text-center leading-snug">
                      {selectedProduct.name}
                    </span>
                  </div>
                )}
                {selectedProduct.badge && (
                  <span className="absolute top-4 left-4 bg-[#D4A373] text-[#2D1B14] text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedProduct.badge}
                  </span>
                )}
              </div>

              <div className="p-6 bg-white space-y-4">
                <div>
                  <DialogTitle className="font-serif text-2xl text-[#2D1B14] mb-1">
                    {selectedProduct.name}
                  </DialogTitle>
                  <DialogDescription className="text-[#6D5D55] leading-relaxed text-sm">
                    {selectedProduct.description}
                  </DialogDescription>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? "fill-[#D4A373] text-[#D4A373]" : "text-[#E8DDD4] fill-[#E8DDD4]"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[#2D1B14]">{selectedProduct.rating.toFixed(1)}</span>
                  <span className="text-sm text-[#6D5D55]">({selectedProduct.reviews} reviews)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl font-bold text-[#4E342E]">
                    Rs. {selectedProduct.price * quantity}
                  </span>
                  <div className="flex items-center border border-[#E8DDD4] rounded-full overflow-hidden">
                    <button
                      className="w-9 h-9 flex items-center justify-center hover:bg-[#F5EDE6] text-[#4E342E] transition-colors"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-[#2D1B14]">{quantity}</span>
                    <button
                      className="w-9 h-9 flex items-center justify-center hover:bg-[#F5EDE6] text-[#4E342E] transition-colors"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 bg-[#4E342E] hover:bg-[#2D1B14] text-[#FFF8F0] font-semibold py-3 rounded-xl transition-colors duration-200 shadow-sm"
                  onClick={() => addToCart(selectedProduct, quantity)}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart · Rs. {selectedProduct.price * quantity}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Cart Dialog ── */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#2D1B14]">Your Cart</DialogTitle>
          </DialogHeader>

          {cart.length === 0 ? (
            <p className="text-center py-8 text-[#6D5D55]">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 border-b border-[#E8DDD4] pb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-[#2D1B14]">{item.product.name}</p>
                      <p className="text-xs text-[#6D5D55]">Rs. {item.product.price} each</p>
                    </div>
                    <div className="flex items-center border border-[#E8DDD4] rounded-full overflow-hidden">
                      <button
                        className="w-7 h-7 flex items-center justify-center hover:bg-[#F5EDE6] text-[#4E342E] transition-colors"
                        onClick={() => updateCartQty(item.product.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-[#2D1B14]">{item.quantity}</span>
                      <button
                        className="w-7 h-7 flex items-center justify-center hover:bg-[#F5EDE6] text-[#4E342E] transition-colors"
                        onClick={() => updateCartQty(item.product.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-semibold text-sm text-[#2D1B14] w-20 text-right">Rs. {item.product.price * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[#6D5D55] hover:text-[#9A3412] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E8DDD4]">
                <p className="font-semibold text-[#2D1B14] text-base">Subtotal</p>
                <p className="font-serif text-xl font-bold text-[#4E342E]">Rs. {cartTotal}</p>
              </div>

              <Button
                className="w-full bg-[#4E342E] hover:bg-[#2D1B14] text-[#FFF8F0] py-3 rounded-xl transition-colors duration-200 mt-4 flex items-center justify-center gap-2"
                onClick={() => {
                  setIsCartOpen(false)
                  router.push("/checkout")
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                Proceed to Checkout
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
