"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { ProductCard, Product } from "@/components/products/product-card"

const allProducts: Product[] = [
  {
    id: "1",
    name: "Classic Brownie",
    slug: "classic-brownie",
    description: "Our signature rich, fudgy chocolate brownie with a perfect crackly top. Made with premium cocoa and Belgian chocolate.",
    price: 149,
    rating: 0,
    reviews: 0,
    category: "classic",
    badge: "Best Seller",
    inStock: true,
    image: "/Classic-Brownie.webp",
  },
  {
    id: "2",
    name: "Nutella Brownie",
    slug: "nutella-brownie",
    description: "Decadent brownie swirled with creamy Nutella hazelnut spread. A chocolate lover's dream come true.",
    price: 179,
    rating: 0,
    reviews: 0,
    category: "premium",
    badge: "Popular",
    inStock: true,
    image: "/Nutela-Brownie.webp",
  },
  {
    id: "3",
    name: "Walnut Brownie",
    slug: "walnut-brownie",
    description: "Chunky California walnuts in our signature chocolate base. Perfect balance of crunch and fudge.",
    price: 169,
    rating: 0,
    reviews: 0,
    category: "classic",
    badge: "Premium",
    inStock: true,
    image: "/Wallnut-Brownie.jpg",
  },
  {
    id: "4",
    name: "Triple Chocolate Brownie",
    slug: "triple-chocolate-brownie",
    description: "Three types of chocolate — dark, milk, and white — for the ultimate chocolate indulgence.",
    price: 199,
    rating: 0,
    reviews: 0,
    category: "premium",
    badge: "Chef Special",
    inStock: true,
    image: "/Triple-Chocolate.jpg",
  },
  {
    id: "5",
    name: "Salted Caramel Brownie",
    slug: "salted-caramel-brownie",
    description: "Rich chocolate brownie drizzled with homemade salted caramel. Sweet meets salty perfection.",
    price: 189,
    rating: 0,
    reviews: 0,
    category: "special",
    badge: "New",
    inStock: true,
    image: "/salted-caramel-brownie.jpg",
  },
  {
    id: "6",
    name: "Peanut Butter Brownie",
    slug: "peanut-butter-brownie",
    description: "Creamy peanut butter swirled into our classic brownie. A heavenly combination.",
    price: 179,
    rating: 0,
    reviews: 0,
    category: "classic",
    badge: null,
    inStock: true,
    image: "/Peanut-Butter-Brownie.jpg",
  },
  {
    id: "7",
    name: "Cookie Dough Brownie",
    slug: "cookie-dough-brownie",
    description: "Edible cookie dough chunks baked into a rich chocolate brownie. Two desserts in one!",
    price: 209,
    rating: 0,
    reviews: 0,
    category: "special",
    badge: "Limited",
    inStock: true,
    image: "/Cookie-Dough-Brownie.jpg",
  },
  {
    id: "8",
    name: "Red Velvet Brownie",
    slug: "red-velvet-brownie",
    description: "A unique twist — red velvet brownie with cream cheese swirl. Elegant and delicious.",
    price: 189,
    rating: 0,
    reviews: 0,
    category: "premium",
    badge: "Seasonal",
    inStock: true,
    image: "/Red-Velvet-Brownie.jpg",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function OurProductsSection() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data: prodData, error: prodErr } = await supabase
          .from("products")
          .select("*")
          .eq("active", true)
          .limit(8)

        if (prodErr) throw prodErr

        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("product_id, rating")

        const statsMap = (reviewsData || []).reduce((acc, r) => {
          if (!acc[r.product_id]) acc[r.product_id] = { sum: 0, count: 0 }
          acc[r.product_id].sum += r.rating
          acc[r.product_id].count += 1
          return acc
        }, {} as Record<string, { sum: number; count: number }>)

        if (prodData && prodData.length > 0) {
          setProducts(
            prodData.map((p) => {
              const stats = statsMap[p.id]
              return {
                id: p.id,
                name: p.name,
                slug: p.slug || p.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
                description: p.description,
                price: Number(p.price),
                rating: stats ? Number((stats.sum / stats.count).toFixed(1)) : 0,
                reviews: stats ? stats.count : 0,
                category: p.category || "classic",
                badge: p.stock === 0 ? "Out of Stock" : p.badge,
                inStock: p.stock > 0,
                image: p.image_url ? p.image_url.split(',')[0].trim() : "",
              }
            })
          )
        }
      } catch (err) {
        console.error("Failed to fetch products for home page", err)
      }
    }
    loadProducts()
  }, [])

  const displayProducts = products.length > 0 
    ? products 
    : allProducts

  return (
    <section className="py-6 md:py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4 md:mb-10"
        >
          <p className="text-[#C68642] font-medium mb-2 uppercase tracking-wide text-xs">
            Fresh &amp; Handcrafted
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D1B14] text-balance">
            Our Products
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto text-pretty text-xs md:text-sm">
            Each brownie is baked fresh with premium ingredients, delivering an unforgettable taste experience
          </p>
        </motion.div>

        {/* ── 2-Row × 4-Col Product Grid ── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5"
        >
          {displayProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariant}
              className="flex w-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── View All Button ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <Link href="/products">
            <button className="inline-flex items-center gap-2 bg-[#4E342E] hover:bg-[#2D1B14] text-[#FFF8F0] font-semibold px-8 py-3.5 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg text-sm">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}

