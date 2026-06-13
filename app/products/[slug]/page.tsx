"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Star, ShoppingBag, Plus, Minus, ChevronDown, Check, AlertCircle, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import useEmblaCarousel from "embla-carousel-react"
import { useCart } from "@/hooks/use-cart"


// ─── Interfaces ──────────────────────────────────────────────────
interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  category: string
  badge: string | null
  image_url: string
}

interface Review {
  id: string
  customer_name: string
  rating: number
  review_title: string
  review_content: string
  created_at: string
}

interface CartItem {
  product: {
    id: string
    name: string
    slug: string
    price: number
    image: string
  }
  quantity: number
}

// Fallback matching products
const FALLBACK_PRODUCTS_MAP: Record<string, Omit<Product, "id">> = {
  "classic-brownie": {
    name: "Classic Brownie",
    slug: "classic-brownie",
    description: "Our signature rich, fudgy chocolate brownie with a perfect crackly top. Made with premium cocoa and Belgian chocolate.",
    price: 149,
    stock: 50,
    category: "classic",
    badge: "Best Seller",
    image_url: "/Classic-Brownie.webp",
  },
  "nutella-brownie": {
    name: "Nutella Brownie",
    slug: "nutella-brownie",
    description: "Decadent brownie swirled with creamy Nutella hazelnut spread. A chocolate lover's dream come true.",
    price: 179,
    stock: 30,
    category: "premium",
    badge: "Popular",
    image_url: "/Nutela-Brownie.webp",
  },
  "walnut-brownie": {
    name: "Walnut Brownie",
    slug: "walnut-brownie",
    description: "Chunky California walnuts in our signature chocolate base. Perfect balance of crunch and fudge.",
    price: 169,
    stock: 35,
    category: "classic",
    badge: "Premium",
    image_url: "/Wallnut-Brownie.jpg",
  },
  "triple-chocolate-brownie": {
    name: "Triple Chocolate Brownie",
    slug: "triple-chocolate-brownie",
    description: "Three types of chocolate — dark, milk, and white — for the ultimate chocolate indulgence.",
    price: 199,
    stock: 30,
    category: "premium",
    badge: "Chef Special",
    image_url: "/Triple-Chocolate.jpg",
  },
  "salted-caramel-brownie": {
    name: "Salted Caramel Brownie",
    slug: "salted-caramel-brownie",
    description: "Rich chocolate brownie drizzled with homemade salted caramel. Sweet meets salty perfection.",
    price: 189,
    stock: 25,
    category: "classic",
    badge: "New",
    image_url: "/salted-caramel-brownie.jpg",
  },
  "peanut-butter-brownie": {
    name: "Peanut Butter Brownie",
    slug: "peanut-butter-brownie",
    description: "Creamy peanut butter swirled into our classic brownie. A heavenly combination.",
    price: 179,
    stock: 30,
    category: "classic",
    badge: null,
    image_url: "/Peanut-Butter-Brownie.jpg",
  },
  "cookie-dough-brownie": {
    name: "Cookie Dough Brownie",
    slug: "cookie-dough-brownie",
    description: "Edible cookie dough chunks baked into a rich chocolate brownie. Two desserts in one!",
    price: 209,
    stock: 0,
    category: "premium",
    badge: "Limited",
    image_url: "/Cookie-Dough-Brownie.jpg",
  },
  "red-velvet-brownie": {
    name: "Red Velvet Brownie",
    slug: "red-velvet-brownie",
    description: "A unique twist — red velvet brownie with cream cheese swirl. Elegant and delicious.",
    price: 189,
    stock: 20,
    category: "classic",
    badge: "Seasonal",
    image_url: "/Red-Velvet-Brownie.jpg",
  },
}

// Category mappings for Accordion specs
const CATEGORY_SPECS: Record<string, { type: string; weight: string; ingredients: string }> = {
  classic: {
    type: "Eggless",
    weight: "1 pc (~85g)",
    ingredients: "Premium Cocoa Powder, Belgian Dark Chocolate Chips, Unsalted Butter, Cane Sugar, All-Purpose Flour, Vanilla Extract, Sea Salt.",
  },
  premium: {
    type: "Egg / Optional",
    weight: "1 pc (~95g)",
    ingredients: "Belgian Dark and Milk Chocolate, Creamy Hazelnut Nutella Spread, Fresh Eggs, Butter, Cane Sugar, Organic Wheat Flour.",
  },
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const { slug } = use(params)

  // States
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description")
  
  // Cart hook
  const { addItem, items } = useCart()


  // Review Drawer state
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false)
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    rating: 5,
    title: "",
    content: "",
  })
  const [submittingReview, setSubmittingReview] = useState(false)

  // Carousel refs
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setSelectedIndex(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

  // Fetch product data & reviews
  const loadProductData = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Fetch product
      const { data: dbProduct, error: prodErr } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle()

      if (prodErr) throw prodErr

      let resolvedProduct: Product | null = null

      if (dbProduct) {
        resolvedProduct = {
          id: dbProduct.id,
          name: dbProduct.name,
          slug: dbProduct.slug,
          description: dbProduct.description,
          price: Number(dbProduct.price),
          stock: Number(dbProduct.stock),
          category: dbProduct.category || "classic",
          badge: dbProduct.badge || null,
          image_url: dbProduct.image_url || "",
        }
      } else {
        // Check fallbacks to prevent screen crash
        const fallback = FALLBACK_PRODUCTS_MAP[slug]
        if (fallback) {
          resolvedProduct = {
            id: `fallback-${slug}`,
            ...fallback,
          }
        }
      }

      if (!resolvedProduct) {
        setError("Product not found")
        setLoading(false)
        return
      }

      setProduct(resolvedProduct)

      // 2. Fetch reviews
      const { data: reviewsData, error: revErr } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", resolvedProduct.id)
        .order("created_at", { ascending: false })

      if (!revErr && reviewsData) {
        setReviews(reviewsData.map((r) => ({
          id: r.id,
          customer_name: r.customer_name,
          rating: Number(r.rating),
          review_title: r.review_title || "",
          review_content: r.review_content || "",
          created_at: new Date(r.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        })))
      }

      // 3. Fetch related products (excluding current)
      const { data: relatedData } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .neq("slug", slug)
        .limit(4)

      if (relatedData && relatedData.length > 0) {
        setRelatedProducts(relatedData.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug || p.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
          description: p.description,
          price: Number(p.price),
          stock: Number(p.stock),
          category: p.category || "classic",
          badge: p.badge || null,
          image_url: p.image_url || "",
        })))
      } else {
        // fallback related products
        const fallbackList = Object.values(FALLBACK_PRODUCTS_MAP)
          .filter((f) => f.slug !== slug)
          .slice(0, 4)
          .map((f, i) => ({
            id: `fallback-rel-${i}`,
            ...f,
          }))
        setRelatedProducts(fallbackList)
      }

    } catch (err: any) {
      console.error(err)
      setError("Failed to load product details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Load product on mount
  useEffect(() => {
    loadProductData()
  }, [slug])

  const handleAddToCart = (directCheckout = false) => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url ? product.image_url.split(',')[0].trim() : "",
    }, qty)

    if (directCheckout) {
      router.push("/checkout")
    }
  }


  // Submit dynamic Supabase review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    if (!newReview.name.trim() || !newReview.email.trim() || !newReview.content.trim()) {
      toast.error("Please fill in all required fields.")
      return
    }

    setSubmittingReview(true)
    try {
      const { error: insertErr } = await supabase
        .from("reviews")
        .insert({
          product_id: product.id,
          customer_name: newReview.name,
          customer_email: newReview.email,
          rating: newReview.rating,
          review_title: newReview.title,
          review_content: newReview.content,
        })

      if (insertErr) throw insertErr

      toast.success("Review submitted successfully! Thank you.")
      setIsReviewDrawerOpen(false)
      setNewReview({ name: "", email: "", rating: 5, title: "", content: "" })
      
      // Reload product details to show new review
      loadProductData()
    } catch (err: any) {
      toast.error("Failed to submit review: " + err.message)
    } finally {
      setSubmittingReview(false)
    }
  }

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section)
  }

  // Cart calculations for details
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)


  // Calculations for average rating
  const reviewCount = reviews.length
  const avgRating = reviewCount > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1) : "0.0"

  const productImages: string[] = product?.image_url
    ? product.image_url.split(',').map((img: string) => img.trim()).filter(Boolean)
    : []

  // Spec helper mapped to product category
  const specs = CATEGORY_SPECS[product?.category || "classic"] || CATEGORY_SPECS.classic

  // Spacing helper styles
  const padding16 = "px-4 py-3 sm:px-6"

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center pt-24 pb-16 font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-chocolate/20 border-t-chocolate animate-spin mb-4" />
          <p className="text-cocoa font-medium text-sm">Loading brownie goodness...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-3" />
          <h2 className="text-xl font-bold text-cocoa font-serif">Oops! Something went wrong</h2>
          <p className="text-[#6D5D55] text-sm mt-1 max-w-sm">
            {error || "We couldn't load the product page you are looking for."}
          </p>
          <Link href="/products" className="mt-6">
            <button className="bg-chocolate hover:bg-cocoa text-[#FFF8F0] font-semibold text-xs py-3 px-6 rounded-full transition-all">
              Back to Products
            </button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const isOutOfStock = product.stock <= 0

  return (
    <main className="min-h-screen bg-[#FFF8F0] text-[#2D1B14] font-sans pb-28 pt-14">
      {/* Navbar */}
      <Navbar />

      {/* Back Button Row */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B7E74] hover:text-[#4E342E] transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Brownies
        </Link>
      </div>

      {/* Mobile Page layout container */}
      <div className="max-w-2xl mx-auto">
        
        {/* ── SECTION 1: Full-Width 1:1 Image Gallery ── */}
        <section className="relative w-full aspect-square bg-white border-b border-[#EDE5DC] overflow-hidden">
          <div ref={emblaRef} className="w-full h-full overflow-hidden">
            <div className="flex h-full">
              {productImages.length > 0 ? (
                productImages.map((imgUrl: string, idx: number) => (
                  <div key={idx} className="flex-[0_0_100%] min-w-0 relative h-full">
                    <Image
                      src={imgUrl}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                ))
              ) : (
                <div className="flex-[0_0_100%] min-w-0 relative h-full flex items-center justify-center bg-gradient-to-br from-[#F5EDE6] to-[#EFE4CC] text-cocoa/30 font-bold font-serif text-lg text-center">
                  {product.name}
                </div>
              )}
            </div>
          </div>

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-4 left-4 bg-[#D4A373] text-[#2D1B14] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10">
              ★ {product.badge}
            </span>
          )}

          {/* Out of Stock banner */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-[#FFF8F0]/70 flex items-center justify-center z-10">
              <span className="bg-[#2D1B14] text-[#FFF8F0] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-md">
                Sold Out
              </span>
            </div>
          )}

          {/* Carousel Dot Indicators */}
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
              {productImages.map((_: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    selectedIndex === idx ? "w-4 bg-chocolate" : "w-2 bg-chocolate/30"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION 2: Product Information ── */}
        <section className={padding16}>
          <div className="flex flex-col gap-1 mb-2">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-cocoa">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-1.5 text-xs text-[#2D1B14] font-medium font-sans">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(Number(avgRating))
                        ? "fill-[#D4A373] text-[#D4A373]"
                        : "fill-none text-chocolate/25"
                    }`}
                  />
                ))}
              </div>
              <span>
                {reviewCount > 0 ? `${avgRating} (${reviewCount} Reviews)` : "No reviews yet"}
              </span>
            </div>
          </div>

          {/* Price Style: Inter/Poppins, Bold, 32px, line-height: 1 */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-sans font-bold text-[32px] leading-none text-cocoa">
              ₹{product.price}
            </span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              incl. GST
            </span>
          </div>

          {/* Short Description */}
          <p className="text-[#6D5D55] text-xs leading-relaxed max-w-xl">
            {product.description}
          </p>
        </section>

        {/* ── SECTION 3: Purchase Controls ── */}
        <section className={`${padding16} bg-white border-t border-b border-[#EDE5DC] flex flex-col gap-3`}>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase text-[#8B7E74] tracking-wider font-sans">Quantity</span>
            
            {/* Quantity Selector */}
            <div className="flex items-center border border-[#E8DDD4] rounded-full overflow-hidden bg-[#FAF6F1]">
              <button
                disabled={qty <= 1 || isOutOfStock}
                onClick={() => setQty(qty - 1)}
                className="w-10 h-10 flex items-center justify-center text-[#4E342E] disabled:opacity-30 hover:bg-[#F5EDE6] transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-[#2D1B14] font-sans select-none">{qty}</span>
              <button
                disabled={isOutOfStock}
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 flex items-center justify-center text-[#4E342E] hover:bg-[#F5EDE6] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="flex flex-col gap-2 pt-1 font-sans">
            <button
              disabled={isOutOfStock}
              onClick={() => handleAddToCart(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-br from-[#4E342E] to-[#2D1B14] text-[#FFF8F0] shadow-md hover:brightness-105 active:scale-[0.99] disabled:opacity-40 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart · ₹{product.price * qty}
            </button>
            <button
              disabled={isOutOfStock}
              onClick={() => handleAddToCart(true)}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#FFF8F0] text-[#4E342E] border border-[#4E342E] hover:bg-[#F5EDE6] active:scale-[0.99] disabled:opacity-40 transition-all cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </section>

        {/* ── SECTION 4: Accordion Layout ── */}
        <section className="mt-4 border-t border-b border-[#EDE5DC] divide-y divide-[#EDE5DC] bg-white">
          
          {/* Item 1: Description */}
          <div>
            <button
              onClick={() => toggleAccordion("description")}
              className="w-full px-4 py-4 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[#4E342E]">Description</span>
              <ChevronDown
                className={`w-4 h-4 text-[#8B7E74] transition-transform duration-300 ${
                  activeAccordion === "description" ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {activeAccordion === "description" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-xs text-[#6D5D55] leading-relaxed">
                    {product.description}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Item 2: Details */}
          <div>
            <button
              onClick={() => toggleAccordion("details")}
              className="w-full px-4 py-4 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[#4E342E]">Details</span>
              <ChevronDown
                className={`w-4 h-4 text-[#8B7E74] transition-transform duration-300 ${
                  activeAccordion === "details" ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {activeAccordion === "details" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <table className="w-full text-xs border border-[#EDE5DC] rounded-lg overflow-hidden">
                      <tbody>
                        <tr className="border-b border-[#EDE5DC]">
                          <td className="w-1/3 px-3 py-2 bg-[#FAF6F1] font-bold text-cocoa">Type</td>
                          <td className="px-3 py-2 text-[#6D5D55]">{specs.type}</td>
                        </tr>
                        <tr>
                          <td className="w-1/3 px-3 py-2 bg-[#FAF6F1] font-bold text-cocoa">Weight/Units</td>
                          <td className="px-3 py-2 text-[#6D5D55]">{specs.weight}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Item 3: Ingredients */}
          <div>
            <button
              onClick={() => toggleAccordion("ingredients")}
              className="w-full px-4 py-4 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[#4E342E]">Ingredients</span>
              <ChevronDown
                className={`w-4 h-4 text-[#8B7E74] transition-transform duration-300 ${
                  activeAccordion === "ingredients" ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {activeAccordion === "ingredients" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-xs text-[#6D5D55] leading-relaxed">
                    {specs.ingredients}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Item 4: Storage */}
          <div>
            <button
              onClick={() => toggleAccordion("storage")}
              className="w-full px-4 py-4 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[#4E342E]">Storage Guidelines</span>
              <ChevronDown
                className={`w-4 h-4 text-[#8B7E74] transition-transform duration-300 ${
                  activeAccordion === "storage" ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {activeAccordion === "storage" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-xs text-[#6D5D55] leading-relaxed space-y-1">
                    <p>• Consume within 4 days of purchase.</p>
                    <p>• Store at room temperature if cool, refrigerate in summer.</p>
                    <p>• Can be enjoyed cold, warm or at room temperature.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Item 5: Shipping */}
          <div>
            <button
              onClick={() => toggleAccordion("shipping")}
              className="w-full px-4 py-4 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[#4E342E]">Shipping</span>
              <ChevronDown
                className={`w-4 h-4 text-[#8B7E74] transition-transform duration-300 ${
                  activeAccordion === "shipping" ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {activeAccordion === "shipping" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-xs text-[#6D5D55] leading-relaxed space-y-1">
                    <p>• Handcrafted and baked fresh directly for your order.</p>
                    <p>• Delivered in our premium thermal boxes in 2-4 hours.</p>
                    <p>• Only available for selected pincodes to preserve freshness.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Item 6: Reviews Panel (Dynamic data inside Accordion) */}
          <div>
            <button
              onClick={() => toggleAccordion("reviews")}
              className="w-full px-4 py-4 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[#4E342E]">
                Reviews ({reviewCount})
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#8B7E74] transition-transform duration-300 ${
                  activeAccordion === "reviews" ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {activeAccordion === "reviews" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  {/* ── SECTION 5: Reviews Inner Content ── */}
                  <div className="px-4 pb-5">
                    {/* Score summary panel */}
                    <div className="flex flex-col items-center justify-center p-4 bg-[#FAF6F1] rounded-xl border border-[#EDE5DC] text-center mb-4 font-sans">
                      <span className="text-3xl font-extrabold text-cocoa leading-none">{avgRating}</span>
                      <div className="flex items-center gap-0.5 my-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4.5 h-4.5 ${
                              i < Math.round(Number(avgRating))
                                ? "fill-[#D4A373] text-[#D4A373]"
                                : "fill-none text-chocolate/20"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#8B7E74] font-medium uppercase tracking-wider">
                        Based on {reviewCount} customer reviews
                      </span>
                      
                      <button
                        onClick={() => setIsReviewDrawerOpen(true)}
                        className="mt-3 bg-chocolate hover:bg-cocoa text-[#FFF8F0] font-bold text-xs py-2 px-5 rounded-full transition-all cursor-pointer font-sans"
                      >
                        Write a Review
                      </button>
                    </div>

                    {/* Review List */}
                    {reviews.length > 0 ? (
                      <div className="space-y-3.5 divide-y divide-[#EDE5DC] max-h-96 overflow-y-auto pr-1">
                        {reviews.map((r, index) => {
                          const initial = r.customer_name ? r.customer_name.trim().charAt(0).toUpperCase() : "?"
                          return (
                            <div key={r.id} className={`pt-3.5 ${index === 0 ? "pt-0 border-0" : "border-t"}`}>
                              <div className="flex items-start gap-3">
                                {/* Initials avatar */}
                                <div className="w-8 h-8 rounded-full bg-[#E8DDD4] text-[#4E342E] flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                                  {initial}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-semibold text-[#2D1B14] text-xs truncate">
                                      {r.customer_name}
                                    </h4>
                                    <span className="text-[10px] text-[#8B7E74]">{r.created_at}</span>
                                  </div>
                                  <div className="flex items-center gap-0.5 my-0.5">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                      <Star
                                        key={idx}
                                        className={`w-3 h-3 ${
                                          idx < r.rating
                                            ? "fill-[#D4A373] text-[#D4A373]"
                                            : "fill-none text-chocolate/20"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  {r.review_title && (
                                    <p className="font-bold text-cocoa text-xs leading-tight mb-0.5">
                                      {r.review_title}
                                    </p>
                                  )}
                                  <p className="text-xs text-[#6D5D55] leading-normal font-sans">
                                    {r.review_content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-center py-6 text-xs text-[#8B7E74] font-medium font-sans">
                        No reviews yet. Be the first to share your thoughts!
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </section>

        {/* ── SECTION 6: Related Products (Horizontal scroll carousel) ── */}
        <section className={padding16}>
          <h3 className="font-serif text-sm font-bold text-cocoa mb-3 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-caramel fill-[#D4A373]" />
            Similar Delights
          </h3>
          
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="flex-shrink-0 w-32 bg-white rounded-xl border border-[#EDE5DC] overflow-hidden flex flex-col hover:shadow-sm transition-all"
              >
                <div className="relative aspect-square w-full bg-[#FAF6F1] flex-shrink-0">
                  {p.image_url ? (
                    <Image
                      src={p.image_url.split(',')[0].trim()}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-2 bg-gradient-to-br from-[#F5EDE6] to-[#EFE4CC] text-[10px] text-cocoa/40 font-bold text-center">
                      {p.name}
                    </div>
                  )}
                </div>
                <div className="p-2 flex flex-col flex-1">
                  <h4 className="font-semibold text-cocoa text-[11px] leading-snug line-clamp-1 flex-1">
                    {p.name}
                  </h4>
                  <span className="font-sans font-bold text-[13px] leading-none text-cocoa mt-1 block">
                    ₹{p.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Page specific checkout bar removed in favor of global MobileCartBar */}


      {/* ── Custom Slide-Up Review Drawer ── */}
      <AnimatePresence>
        {isReviewDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            {/* Drawer Body */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-[#FFF8F0] rounded-t-3xl border-t border-[#EDE5DC] shadow-[0_-8px_32px_rgba(0,0,0,0.15)] flex flex-col font-sans overflow-hidden"
            >
              {/* Drag Handle indicator */}
              <div className="w-12 h-1.5 bg-chocolate/10 rounded-full mx-auto my-3 flex-shrink-0" />
              
              <div className="flex-1 overflow-y-auto px-5 pb-8">
                <h3 className="font-serif text-xl font-bold text-cocoa text-center mb-4">Rate &amp; Review</h3>
                
                {/* Form to submit review */}
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-xs font-bold uppercase text-[#8B7E74] tracking-wider">Quality Rating</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starVal = i + 1
                        return (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setNewReview({ ...newReview, rating: starVal })}
                            className="p-1 focus:outline-none transition-transform active:scale-125"
                            aria-label={`Rate ${starVal} stars`}
                          >
                            <Star
                              className={`w-8 h-8 ${
                                starVal <= newReview.rating
                                  ? "fill-[#D4A373] text-[#D4A373]"
                                  : "fill-none text-chocolate/25"
                              }`}
                            />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Name field */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="revName" className="text-xs font-bold text-cocoa uppercase tracking-wider">
                      Your Name*
                    </label>
                    <input
                      id="revName"
                      type="text"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="John Smith"
                      className="w-full bg-white border border-[#E8DDD4] px-3 py-2.5 rounded-xl text-xs placeholder:text-[#8B7E74] focus:outline-none focus:border-[#4E342E] text-cocoa font-sans"
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="revEmail" className="text-xs font-bold text-cocoa uppercase tracking-wider">
                      Your Email*
                    </label>
                    <input
                      id="revEmail"
                      type="email"
                      required
                      value={newReview.email}
                      onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                      placeholder="example@yourdomain.com"
                      className="w-full bg-white border border-[#E8DDD4] px-3 py-2.5 rounded-xl text-xs placeholder:text-[#8B7E74] focus:outline-none focus:border-[#4E342E] text-cocoa font-sans"
                    />
                  </div>

                  {/* Review Title field */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="revTitle" className="text-xs font-bold text-cocoa uppercase tracking-wider">
                      Review Title <span className="text-[10px] text-[#8B7E74] font-normal">(optional)</span>
                    </label>
                    <input
                      id="revTitle"
                      type="text"
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                      placeholder="Look great"
                      className="w-full bg-white border border-[#E8DDD4] px-3 py-2.5 rounded-xl text-xs placeholder:text-[#8B7E74] focus:outline-none focus:border-[#4E342E] text-cocoa font-sans"
                    />
                  </div>

                  {/* Review content field */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="revContent" className="text-xs font-bold text-cocoa uppercase tracking-wider">
                      Review Content*
                    </label>
                    <textarea
                      id="revContent"
                      required
                      rows={3}
                      value={newReview.content}
                      onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                      placeholder="Write something"
                      className="w-full bg-white border border-[#E8DDD4] px-3 py-2.5 rounded-xl text-xs placeholder:text-[#8B7E74] focus:outline-none focus:border-[#4E342E] text-cocoa font-sans"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsReviewDrawerOpen(false)}
                      className="flex-1 py-3 rounded-xl font-bold text-xs border border-[#4E342E] text-[#4E342E] hover:bg-[#F5EDE6] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="flex-1 py-3 bg-[#4E342E] text-[#FFF8F0] rounded-xl font-bold text-xs hover:bg-[#2D1B14] disabled:opacity-50 cursor-pointer flex items-center justify-center"
                    >
                      {submittingReview ? "Submitting..." : "Submit Your Review"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
