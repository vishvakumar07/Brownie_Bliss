"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Plus, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

const allProducts = [
  {
    id: 1,
    name: "Classic Brownie",
    description: "Our signature rich, fudgy chocolate brownie with a perfect crackly top. Made with premium cocoa and Belgian chocolate.",
    price: 149,
    rating: 4.9,
    badge: "Best Seller",
    inStock: true,
    image: "/Classic-Brownie.webp",
  },
  {
    id: 2,
    name: "Nutella Brownie",
    description: "Decadent brownie swirled with creamy Nutella hazelnut spread. A chocolate lover's dream come true.",
    price: 179,
    rating: 4.8,
    badge: "Popular",
    inStock: true,
    image: "/Nutela-Brownie.webp",
  },
  {
    id: 3,
    name: "Walnut Brownie",
    description: "Chunky California walnuts in our signature chocolate base. Perfect balance of crunch and fudge.",
    price: 169,
    rating: 4.9,
    badge: "Premium",
    inStock: true,
    image: "/Wallnut-Brownie.jpg",
  },
  {
    id: 4,
    name: "Triple Chocolate Brownie",
    description: "Three types of chocolate — dark, milk, and white — for the ultimate chocolate indulgence.",
    price: 199,
    rating: 5.0,
    badge: "Chef Special",
    inStock: true,
    image: "/Triple-Chocolate.jpg",
  },
  {
    id: 5,
    name: "Salted Caramel Brownie",
    description: "Rich chocolate brownie drizzled with homemade salted caramel. Sweet meets salty perfection.",
    price: 189,
    rating: 4.7,
    badge: "New",
    inStock: true,
    image: "/salted-caramel-brownie.jpg",
  },
  {
    id: 6,
    name: "Peanut Butter Brownie",
    description: "Creamy peanut butter swirled into our classic brownie. A heavenly combination.",
    price: 179,
    rating: 4.8,
    badge: null,
    inStock: true,
    image: "/Peanut-Butter-Brownie.jpg",
  },
  {
    id: 7,
    name: "Cookie Dough Brownie",
    description: "Edible cookie dough chunks baked into a rich chocolate brownie. Two desserts in one!",
    price: 209,
    rating: 4.9,
    badge: "Limited",
    inStock: true,
    image: "/Cookie-Dough-Brownie.jpg",
  },
  {
    id: 8,
    name: "Red Velvet Brownie",
    description: "A unique twist — red velvet brownie with cream cheese swirl. Elegant and delicious.",
    price: 189,
    rating: 4.6,
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
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("active", true)
          .limit(8) // show 8 products on the home page

        if (error) throw error

        if (data && data.length > 0) {
          setProducts(
            data.map((p) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: Number(p.price),
              rating: 4.8 + (Math.random() * 0.2), // organic placeholder rating
              badge: p.stock === 0 ? "Out of Stock" : null,
              inStock: p.stock > 0,
              image: p.image_url || "",
            }))
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

  const handleAdd = (name: string) => {
    toast.success(`${name} added!`, {
      description: "Go to the Products page to manage your order.",
    })
  }

  return (
    <section className="py-10 md:py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <p className="text-caramel font-medium mb-2 uppercase tracking-wide text-xs">
            Fresh &amp; Handcrafted
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-cocoa text-balance">
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {displayProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariant}
              whileHover={{ y: -4 }}
              className="flex"
            >
              {/* ── Card bounding box ── */}
              <div className="group w-full flex flex-col rounded-2xl overflow-hidden bg-white border border-[#E8DDD4] shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.13)] transition-shadow duration-300">

                {/* IMAGE AREA — 1:1 square, neutral bg, no dark overlay */}
                <Link
                  href="/products"
                  className="relative w-full flex-shrink-0 overflow-hidden block bg-[#FAF6F1] aspect-square"
                >
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    /* product name fallback */
                    <div className="absolute inset-0 flex items-center justify-center px-5 bg-gradient-to-br from-[#F5EDE6] to-[#EFE4CC]">
                      <span className="font-serif text-[#4E342E]/60 text-lg font-bold text-center leading-snug select-none">
                        {product.name}
                      </span>
                    </div>
                  )}
                  {/* badge */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-[#D4A373] text-[#2D1B14] text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  {/* out of stock */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="bg-white text-[#2D1B14] text-sm font-semibold px-4 py-1.5 rounded-full shadow border border-[#E8DDD4]">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {/* hover overlay */}
                  {product.inStock && (
                    <div className="absolute inset-0 bg-[#2D1B14]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <span className="bg-white text-[#2D1B14] hover:bg-[#D4A373] text-sm font-semibold px-5 py-2 rounded-full shadow transition-colors duration-150">
                        View &amp; Order
                      </span>
                    </div>
                  )}
                </Link>

                {/* CONTENT AREA */}
                <div className="flex flex-col flex-1 px-4 pt-3 pb-4 bg-white">
                  {/* name + rating */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-semibold text-[#2D1B14] text-sm leading-snug line-clamp-1 flex-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
                      <span className="text-xs font-semibold text-[#2D1B14]">{product.rating}</span>
                    </div>
                  </div>
                  {/* description */}
                  <p className="text-[#6D5D55] text-xs leading-relaxed line-clamp-2 flex-1 mb-3">
                    {product.description}
                  </p>
                  {/* divider */}
                  <div className="h-px bg-[#E8DDD4] mb-3" />
                  {/* price + add */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif text-base font-bold text-[#4E342E]">
                      Rs. {product.price}
                    </span>
                    <button
                      onClick={() => handleAdd(product.name)}
                      disabled={!product.inStock}
                      className="flex items-center gap-1.5 bg-[#4E342E] hover:bg-[#2D1B14] disabled:opacity-40 disabled:cursor-not-allowed text-[#FFF8F0] text-xs font-semibold px-3.5 py-2 rounded-full transition-colors duration-150 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
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
