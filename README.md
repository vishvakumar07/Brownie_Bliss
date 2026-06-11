<div align="center">

# 🍫 Brownie Bliss

**A premium artisan brownie e-commerce storefront with a real-time admin dashboard.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## ✨ Overview

**Brownie Bliss** is a full-stack e-commerce web application for a homemade brownie business. It includes a beautiful customer-facing storefront and a fully-featured admin panel — all powered by Supabase for real-time data sync.

Built with modern web technologies, it supports live order management, analytics dashboards, cart functionality, PDF/Excel exports, and product image uploads.

---

## 📸 Pages & Features

### Customer-Facing

| Page | Route | Description |
|---|---|---|
| **Home** | `/` | Hero section, product showcase, reviews, call-to-action |
| **Products** | `/products` | Filterable brownie catalog with cart & quick-view modal |
| **Checkout** | `/checkout` | Order form with address, payment method, special instructions |
| **About** | `/about` | Brand story & values |
| **Reviews** | `/reviews` | Customer testimonials |
| **Contact** | `/contact` | Contact form (messages saved to Supabase) |

### Admin Dashboard (`/admin`)

| Page | Route | Description |
|---|---|---|
| **Login** | `/admin/login` | Password-protected admin access |
| **Dashboard** | `/admin/dashboard` | KPI overview — orders, revenue, stock alerts |
| **Products** | `/admin/products` | Add / edit / delete products, image upload, stock toggle |
| **Orders** | `/admin/orders` | Live order table, status management, search & filter |
| **Analytics** | `/admin/analytics` | Revenue trend, orders trend, product pie chart, daily bar chart |

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.7 |
| **UI Components** | shadcn/ui + Radix UI |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Database & Auth** | Supabase (PostgreSQL + Realtime) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Form Handling** | React Hook Form + Zod |
| **Toasts** | Sonner |
| **Export** | jsPDF + jspdf-autotable + XLSX |
| **Analytics** | Vercel Analytics |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- A **Supabase** account (free tier works perfectly)

### 1. Clone & Install

```bash
git clone https://github.com/vishvakumar07/Brownie_Bliss
cd brownie-bliss
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API**
3. Copy your **Project URL** and **anon/public key**

### 3. Configure Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ The anon key is a **long JWT** starting with `eyJ...` — not a short publishable key.

### 4. Run the Database Schema

1. In Supabase → **SQL Editor → New Query**
2. Paste the entire contents of [`supabase-schema.sql`](./supabase-schema.sql)
3. Click **Run**

This creates the `products`, `orders`, and `contact_messages` tables, sets up Row Level Security, enables real-time, and creates the `product-photos` storage bucket.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Seed Products (Admin)

1. Navigate to `/admin/products`
2. Click **"Seed All Products"** to populate the database with the 8 default brownies

---

## 📁 Project Structure

```
brownie-bliss/
├── app/
│   ├── page.tsx                    # Home page
│   ├── products/page.tsx           # Products catalog
│   ├── checkout/page.tsx           # Checkout flow
│   ├── about/page.tsx              # About page
│   ├── reviews/page.tsx            # Reviews page
│   ├── contact/page.tsx            # Contact page
│   └── admin/
│       ├── login/page.tsx          # Admin login
│       └── (dashboard)/
│           ├── dashboard/page.tsx  # KPI overview
│           ├── products/page.tsx   # Product management
│           ├── orders/page.tsx     # Order management
│           └── analytics/page.tsx  # Charts & insights
├── components/
│   ├── home/                       # Home page sections
│   ├── products/                   # Product grid & cart
│   ├── admin/                      # Admin sidebar
│   ├── layout/                     # Navbar & Footer
│   └── ui/                         # shadcn/ui components
├── lib/
│   └── supabase.ts                 # Supabase client
├── public/                         # Product images
├── supabase-schema.sql             # Full DB schema
└── .env.local                      # Environment variables (not committed)
```

---

## 🗄️ Database Schema

### `products`
| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key |
| `name` | text | Product name |
| `description` | text | Short description |
| `price` | numeric | Price in Rs. |
| `stock` | integer | Units available |
| `active` | boolean | Visible on storefront |
| `image_url` | text | Photo URL |
| `badge` | text | e.g. "Best Seller", "New" |
| `category` | text | classic / premium / seasonal |

### `orders`
| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key |
| `customer_name` | text | Full name |
| `phone` | text | Contact number |
| `address` | text | Delivery address |
| `product_name` | text | Ordered brownie |
| `quantity` | integer | Units ordered |
| `total` | numeric | Total in Rs. |
| `payment_method` | text | UPI / COD / Card |
| `status` | text | Pending / Processing / Delivered / Cancelled |

---

## ⚡ Real-Time Features

The admin dashboard uses Supabase's **Postgres Changes** websocket subscription:

- New orders appear **instantly** in the Orders table — no refresh needed
- Status changes sync **live** across all open browser tabs
- Analytics charts **auto-update** when new orders arrive

---

## 📦 Key Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🚀 Deployment

This project is optimized for **[Vercel](https://vercel.com)** deployment:

1. Push to GitHub
2. Import repository in Vercel
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in **Vercel → Project Settings → Environment Variables**
4. Deploy — Vercel handles the rest automatically

---

## 📦 Product Catalog

| # | Product | Price | Badge |
|---|---|---|---|
| 1 | Classic Brownie | Rs. 149 | Best Seller |
| 2 | Nutella Brownie | Rs. 179 | Popular |
| 3 | Walnut Brownie | Rs. 169 | Premium |
| 4 | Triple Chocolate Brownie | Rs. 199 | Chef Special |
| 5 | Salted Caramel Brownie | Rs. 189 | New |
| 6 | Peanut Butter Brownie | Rs. 179 | — |
| 7 | Cookie Dough Brownie | Rs. 209 | Limited |
| 8 | Red Velvet Brownie | Rs. 189 | Seasonal |

---

## 🔐 Admin Access

The admin panel is at `/admin/login`. By default, access is controlled by a simple password check. For production, replace this with Supabase Auth or a more secure authentication method.

---

## 📄 License

This project is private and intended for personal/business use.

---

<div align="center">

Made with ❤️ & chocolate by **Brownie Bliss**

</div>
