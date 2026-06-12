import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hgaxfgewxymcjwnkcwom.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnYXhmZ2V3eHltY2p3bmtjd29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MjU1NjQsImV4cCI6MjA5NjUwMTU2NH0.hbmsgDrf4hJrf1DM-LLt-3OvHxYNiX7NdhO1ipu2c2M'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

async function seed() {
  console.log("Seeding products into Supabase...")
  
  // Test if slug column exists by selecting it
  const { error: selectErr } = await supabase.from('products').select('slug').limit(1)
  if (selectErr) {
    console.error("⚠️ Database check failed. The 'slug' column or 'products' table might not exist in the database yet.")
    console.error("Error message:", selectErr.message)
    console.error("\nPlease execute the updated SQL script in 'supabase-schema.sql' inside the Supabase SQL Editor first, then rerun this seed script.")
    process.exit(1)
  }

  // Upsert products
  const { data, error } = await supabase
    .from("products")
    .upsert(SEED_PRODUCTS, { onConflict: "slug" })

  if (error) {
    console.error("❌ Failed to seed products:", error.message)
    process.exit(1)
  }

  console.log("✅ Seeded products successfully!")
}

seed()
