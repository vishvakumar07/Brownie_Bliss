"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag, Home, Package, Info, MessageSquare, Star } from "lucide-react"
import { CartButton } from "@/components/cart/cart-button"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { MobileCartBar } from "@/components/cart/mobile-cart-bar"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Products", icon: Package },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: MessageSquare },
  { href: "/reviews", label: "Reviews", icon: Star },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // close drawer on route change
  useEffect(() => { setIsOpen(false) }, [pathname])

  return (
    <>
      {/* ── Sticky Header ─────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(255,248,240,0.97)"
            : "rgba(255,248,240,0.90)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: scrolled ? "1px solid #E8DDD4" : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 20px rgba(78,52,46,0.08)" : "none",
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <span
                className="font-serif font-bold text-[#2D1B14] tracking-tight"
                style={{ fontSize: "clamp(1.1rem, 4vw, 1.6rem)" }}
              >
                Brownie Bliss
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium transition-colors duration-200"
                  style={{
                    color: pathname === link.href ? "#4E342E" : "#6D5D55",
                  }}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: "#C68642" }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/admin/login">
                <button className="text-sm font-medium text-[#6D5D55] hover:text-[#4E342E] transition-colors px-3 py-1.5 cursor-pointer">
                  Admin
                </button>
              </Link>
              <CartButton />
              <Link href="/products">
                <button
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #4E342E, #2D1B14)",
                    color: "#FFF8F0",
                    boxShadow: "0 4px 14px rgba(78,52,46,0.28)",
                  }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Order Now
                </button>
              </Link>
            </div>

            {/* Mobile Actions: Cart + Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <CartButton />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer"
                style={{
                  background: isOpen ? "rgba(78,52,46,0.10)" : "transparent",
                }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <X className="w-5 h-5 text-[#2D1B14]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Menu className="w-5 h-5 text-[#2D1B14]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

          </div>
        </nav>
      </header>

      {/* ── Mobile Drawer Overlay ──────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(45,27,20,0.45)", backdropFilter: "blur(2px)" }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden flex flex-col"
              style={{ background: "#FFF8F0" }}
            >
              {/* Drawer Header */}
              <div
                className="flex items-center justify-between px-5 h-14 flex-shrink-0"
                style={{ borderBottom: "1px solid #E8DDD4" }}
              >
                <span className="font-serif font-bold text-[#2D1B14] text-lg">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
                  style={{ background: "rgba(78,52,46,0.08)" }}
                >
                  <X className="w-4 h-4 text-[#4E342E]" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                {navLinks.map((link, i) => {
                  const Icon = link.icon
                  const active = pathname === link.href
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.28 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-1 transition-all duration-150 active:scale-[0.98]"
                        style={{
                          background: active ? "rgba(78,52,46,0.08)" : "transparent",
                          color: active ? "#4E342E" : "#6D5D55",
                        }}
                      >
                        <div
                          className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                          style={{
                            background: active ? "rgba(78,52,46,0.12)" : "rgba(78,52,46,0.05)",
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-sm">{link.label}</span>
                        {active && (
                          <div
                            className="ml-auto w-1.5 h-1.5 rounded-full"
                            style={{ background: "#C68642" }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Drawer Footer */}
              <div className="p-4 flex flex-col gap-2" style={{ borderTop: "1px solid #E8DDD4" }}>
                <Link href="/products" onClick={() => setIsOpen(false)}>
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #4E342E, #2D1B14)",
                      color: "#FFF8F0",
                      boxShadow: "0 4px 14px rgba(78,52,46,0.28)",
                    }}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Order Now
                  </button>
                </Link>
                <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                  <button
                    className="w-full py-3 rounded-xl font-medium text-sm text-[#6D5D55] transition-all cursor-pointer"
                    style={{ background: "rgba(78,52,46,0.05)" }}
                  >
                    Admin Login
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Cart Elements */}
      <CartDrawer />
      <MobileCartBar />
    </>
  )
}

