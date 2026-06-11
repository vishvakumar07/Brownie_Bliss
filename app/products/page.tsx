import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/products/product-grid"

export default function ProductsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ProductGrid />
      <Footer />
    </main>
  )
}
