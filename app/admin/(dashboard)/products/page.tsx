"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Search, 
  Plus,
  Pencil,
  Trash2,
  Package,
  Upload,
  X,
  ImageIcon,
  DatabaseZap,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

// ── Existing Products (same as our-products-section.tsx) ──────────────────────
const SEED_PRODUCTS = [
  {
    name: "Classic Brownie",
    slug: "classic-brownie",
    description: "Our signature rich, fudgy chocolate brownie with a perfect crackly top. Made with premium cocoa and Belgian chocolate.",
    price: 149,
    stock: 50,
    active: true,
    category: "classic",
    badge: "Best Seller",
    image_url: "/Classic-Brownie.webp",
  },
  {
    name: "Nutella Brownie",
    slug: "nutella-brownie",
    description: "Decadent brownie swirled with creamy Nutella hazelnut spread. A chocolate lover's dream come true.",
    price: 179,
    stock: 40,
    active: true,
    category: "premium",
    badge: "Popular",
    image_url: "/Nutela-Brownie.webp",
  },
  {
    name: "Walnut Brownie",
    slug: "walnut-brownie",
    description: "Chunky California walnuts in our signature chocolate base. Perfect balance of crunch and fudge.",
    price: 169,
    stock: 35,
    active: true,
    category: "classic",
    badge: "Premium",
    image_url: "/Wallnut-Brownie.jpg",
  },
  {
    name: "Triple Chocolate Brownie",
    slug: "triple-chocolate-brownie",
    description: "Three types of chocolate — dark, milk, and white — for the ultimate chocolate indulgence.",
    price: 199,
    stock: 30,
    active: true,
    category: "premium",
    badge: "Chef Special",
    image_url: "/Triple-Chocolate.jpg",
  },
  {
    name: "Salted Caramel Brownie",
    slug: "salted-caramel-brownie",
    description: "Rich chocolate brownie drizzled with homemade salted caramel. Sweet meets salty perfection.",
    price: 189,
    stock: 25,
    active: true,
    category: "classic",
    badge: "New",
    image_url: "/salted-caramel-brownie.jpg",
  },
  {
    name: "Peanut Butter Brownie",
    slug: "peanut-butter-brownie",
    description: "Creamy peanut butter swirled into our classic brownie. A heavenly combination.",
    price: 179,
    stock: 30,
    active: true,
    category: "classic",
    badge: null,
    image_url: "/Peanut-Butter-Brownie.jpg",
  },
  {
    name: "Cookie Dough Brownie",
    slug: "cookie-dough-brownie",
    description: "Edible cookie dough chunks baked into a rich chocolate brownie. Two desserts in one!",
    price: 209,
    stock: 0,
    active: true,
    category: "premium",
    badge: "Limited",
    image_url: "/Cookie-Dough-Brownie.jpg",
  },
  {
    name: "Red Velvet Brownie",
    slug: "red-velvet-brownie",
    description: "A unique twist — red velvet brownie with cream cheese swirl. Elegant and delicious.",
    price: 189,
    stock: 20,
    active: true,
    category: "classic",
    badge: "Seasonal",
    image_url: "/Red-Velvet-Brownie.jpg",
  },
]

interface Product {
  id: string | number
  name: string
  slug: string
  description: string
  price: number
  stock: number
  active: boolean
  image: string
  badge?: string | null
  category?: string
}

// ── Image Upload Component ──────────────────────────────────────────────────
function ImageUpload({
  value,
  onChange,
  label = "Upload Photo",
}: {
  value: string
  onChange: (dataUrl: string) => void
  label?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (JPG, PNG, or WEBP)")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5 MB")
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onChange(result)
      }
      reader.readAsDataURL(file)
    },
    [onChange]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-1">
      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden h-28 flex flex-col items-center justify-center
          ${isDragging
            ? "border-chocolate bg-chocolate/5 scale-[1.01]"
            : "border-border hover:border-chocolate/50 hover:bg-chocolate/3"
          }
        `}
      >
        {value ? (
          <>
            {/* Preview */}
            <Image
              src={value}
              alt="Product preview"
              fill
              className="object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <Upload className="w-4 h-4 text-white" />
              <span className="text-white text-[10px] font-medium text-center px-1">Change</span>
            </div>
            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-10"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-1 text-muted-foreground p-2 text-center">
            <ImageIcon className="w-4 h-4 text-muted-foreground/60" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 leading-none">{label}</span>
            <span className="text-[9px] text-muted-foreground/50 leading-tight">Drag or click</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function ProductsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    badge: "",
    category: "classic",
    image: "",
    image2: "",
    image3: "",
  })

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      if (data) {
        setProducts(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug || p.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
            description: p.description,
            price: Number(p.price),
            stock: Number(p.stock),
            active: p.active,
            image: p.image_url || "",
            badge: p.badge || null,
            category: p.category || "classic",
          }))
        )
      }
    } catch (err: any) {
      toast.error("Failed to load products: " + err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // ── Seed all 8 existing products into Supabase ──────────────────────────
  const handleSeedProducts = async () => {
    setSeeding(true)
    try {
      const { error } = await supabase
        .from("products")
        .upsert(
          SEED_PRODUCTS.map((p) => ({
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price,
            stock: p.stock,
            active: p.active,
            category: p.category,
            badge: p.badge,
            image_url: p.image_url,
          })),
          { onConflict: "slug" }
        )

      if (error) throw error
      toast.success("All 8 brownie products seeded successfully! 🍫")
      fetchProducts()
    } catch (err: any) {
      toast.error("Failed to seed products: " + err.message)
    } finally {
      setSeeding(false)
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ── Determine what to display ────────────────────────────────────────────
  // If no products in DB yet, show static fallback so the page isn't empty
  const displayProducts: (Product & { isStatic?: boolean })[] =
    !loading && products.length === 0
      ? SEED_PRODUCTS.map((p, i) => ({
          id: `static-${i}`,
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: p.price,
          stock: p.stock,
          active: p.active,
          image: p.image_url,
          badge: p.badge,
          category: p.category,
          isStatic: true,
        }))
      : filteredProducts.map((p) => ({ ...p, isStatic: false }))

  const openAddDialog = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      badge: "",
      category: "classic",
      image: "",
      image2: "",
      image3: "",
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    const imgs = product.image ? product.image.split(',').map(s => s.trim()).filter(Boolean) : []
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      badge: product.badge || "",
      category: product.category || "classic",
      image: imgs[0] || "",
      image2: imgs[1] || "",
      image3: imgs[2] || "",
    })
    setIsDialogOpen(true)
  }

  const uploadPhoto = async (base64Str: string): Promise<string> => {
    if (!base64Str || !base64Str.startsWith("data:image/")) {
      return base64Str
    }
    const res = await fetch(base64Str)
    const blob = await res.blob()
    const fileExt = blob.type.split("/")[1] || "png"
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("product-photos")
      .upload(filePath, blob, {
        contentType: blob.type,
        upsert: true,
      })

    if (uploadError) {
      throw new Error("Failed to upload image: " + uploadError.message)
    }

    const { data } = supabase.storage
      .from("product-photos")
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const uploadedUrls = await Promise.all([
        formData.image ? uploadPhoto(formData.image) : Promise.resolve(""),
        formData.image2 ? uploadPhoto(formData.image2) : Promise.resolve(""),
        formData.image3 ? uploadPhoto(formData.image3) : Promise.resolve(""),
      ])
      const imageUrl = uploadedUrls.filter(Boolean).join(",")

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update({
            name: formData.name,
            slug: formData.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
            description: formData.description,
            price: Number(formData.price),
            stock: Number(formData.stock),
            badge: formData.badge || null,
            category: formData.category,
            image_url: imageUrl,
          })
          .eq("id", editingProduct.id)

        if (error) throw error
        toast.success("Product updated successfully")
      } else {
        const { error } = await supabase
          .from("products")
          .insert({
            name: formData.name,
            slug: formData.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
            description: formData.description,
            price: Number(formData.price),
            stock: Number(formData.stock),
            active: true,
            badge: formData.badge || null,
            category: formData.category,
            image_url: imageUrl,
          })

        if (error) throw error
        toast.success("Product added successfully")
      }
      setIsDialogOpen(false)
      fetchProducts()
    } catch (err: any) {
      toast.error(err.message || "An error occurred while saving product")
    } finally {
      setSubmitting(false)
    }
  }

  const toggleActive = async (id: string | number, currentActive: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ active: !currentActive })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update status: " + error.message)
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
      )
      toast.success("Product status updated")
    }
  }

  const deleteProduct = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error("Failed to delete product: " + error.message)
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success("Product deleted")
    }
  }

  const isShowingStaticFallback = !loading && products.length === 0

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your brownie products
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Seed button — only visible when DB is empty */}
          {isShowingStaticFallback && (
            <Button
              variant="outline"
              className="gap-2 border-chocolate/40 text-chocolate hover:bg-chocolate/5"
              onClick={handleSeedProducts}
              disabled={seeding}
            >
              {seeding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <DatabaseZap className="w-4 h-4" />
              )}
              {seeding ? "Seeding…" : "Seed All Products"}
            </Button>
          )}
          <Button onClick={openAddDialog} className="bg-chocolate hover:bg-cocoa text-cream gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Static fallback banner */}
      {isShowingStaticFallback && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
          <DatabaseZap className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Database is empty</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Showing the 8 default brownie products as a preview. Click{" "}
              <strong>Seed All Products</strong> to save them into your database,
              or use <strong>Add Product</strong> to create individual products.
            </p>
          </div>
        </div>
      )}

      {/* Search — only when there are real DB products */}
      {!isShowingStaticFallback && (
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-muted/40 animate-pulse h-72" />
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`border-0 shadow-md overflow-hidden ${!product.active ? "opacity-60" : ""}`}>
                {/* Product Image */}
                <div className="relative w-full h-44 bg-[#FAF6F1]">
                  {product.image ? (
                    <Image
                      src={product.image.split(',')[0].trim()}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
                      <Package className="w-10 h-10" />
                      <span className="text-xs">No photo</span>
                    </div>
                  )}
                  {/* Badge chip */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-[#D4A373] text-[#2D1B14] text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  {/* Static preview overlay */}
                  {product.isStatic && (
                    <span className="absolute top-3 right-3 bg-white/80 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                      Preview
                    </span>
                  )}
                  {/* Out of stock */}
                  {product.stock === 0 && !product.isStatic && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                      <span className="bg-white text-[#2D1B14] text-xs font-semibold px-3 py-1 rounded-full shadow border border-[#E8DDD4]">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{product.name}</CardTitle>
                      <Badge
                        variant={product.active ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {product.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {/* Toggle only for real DB products */}
                    {!product.isStatic && (
                      <Switch
                        checked={product.active}
                        onCheckedChange={() => toggleActive(product.id, product.active)}
                      />
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-serif text-xl font-bold text-chocolate">
                        Rs. {product.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Stock</p>
                      <p className={`font-semibold ${product.stock === 0 ? "text-destructive" : "text-foreground"}`}>
                        {product.stock} units
                      </p>
                    </div>
                  </div>

                  {/* Action buttons — disabled for static preview cards */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => !product.isStatic && openEditDialog(product)}
                      disabled={product.isStatic}
                      title={product.isStatic ? "Seed products first to edit" : "Edit product"}
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="text-destructive hover:text-destructive gap-2"
                      onClick={() => !product.isStatic && deleteProduct(product.id)}
                      disabled={product.isStatic}
                      title={product.isStatic ? "Seed products first to delete" : "Delete product"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty state — only when DB has products but search returns nothing */}
      {!loading && products.length > 0 && filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products found matching &quot;{searchQuery}&quot;</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Uploads */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-foreground">Product Photos (Max 3)</Label>
              <div className="grid grid-cols-3 gap-3">
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  label="Photo 1 (Main)"
                />
                <ImageUpload
                  value={formData.image2}
                  onChange={(url) => setFormData({ ...formData, image2: url })}
                  label="Photo 2"
                />
                <ImageUpload
                  value={formData.image3}
                  onChange={(url) => setFormData({ ...formData, image3: url })}
                  label="Photo 3"
                />
              </div>
              
              {/* Requirements */}
              <div className="rounded-lg bg-muted/60 px-3 py-2 space-y-0.5 mt-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                  Photo Requirements
                </p>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  JPG, PNG, or WEBP. Square (1:1) aspect ratio recommended. Max 5MB per file. Only uploaded photos will be displayed.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Classic Brownie"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your brownie..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (Rs.)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="149"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="50"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="badge">Badge <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g., Best Seller, New"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="classic">Classic</option>
                  <option value="premium">Premium</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="limited">Limited</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-chocolate hover:bg-cocoa text-cream"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving…
                  </>
                ) : editingProduct ? "Save Changes" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
