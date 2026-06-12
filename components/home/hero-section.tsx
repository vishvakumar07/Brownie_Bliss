"use client"

import { useState, useEffect, useRef } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"

// ─── Animation Phase type ────────────────────────────────────────────────────
type Phase = "stacking" | "rolling" | "floating"

// ─── Chocolate chip orbit positions (offset from brownie centre, px) ─────────
const CHIPS = [
  { id: 1, ox:  178, oy:  -58, size: 13, dur: 5.8, delay: 0.0 },
  { id: 2, ox: -158, oy:  -88, size:  9, dur: 6.4, delay: 0.9 },
  { id: 3, ox:  188, oy:   74, size: 15, dur: 5.0, delay: 1.6 },
  { id: 4, ox: -168, oy:   64, size: 11, dur: 6.0, delay: 0.4 },
  { id: 5, ox:   52, oy: -170, size:  8, dur: 7.2, delay: 2.1 },
  { id: 6, ox:  -64, oy:  174, size: 10, dur: 5.4, delay: 1.3 },
  { id: 7, ox:  118, oy:  150, size:  7, dur: 6.6, delay: 0.7 },
  { id: 8, ox: -132, oy: -130, size: 12, dur: 4.8, delay: 1.9 },
]

// ─── Gold sparkles ─────────────────────────────────────────────────────────
const SPARKLES = [
  { id: 1, ox:  148, oy:  -84, size: 5, delay: 0.4 },
  { id: 2, ox: -120, oy:   74, size: 4, delay: 1.2 },
  { id: 3, ox:   88, oy:  154, size: 6, delay: 0.8 },
  { id: 4, ox:  -94, oy: -120, size: 4, delay: 1.6 },
  { id: 5, ox:   60, oy: -150, size: 5, delay: 1.0 },
  { id: 6, ox: -150, oy:   30, size: 3, delay: 0.3 },
]

// ─── Cocoa-dust trail (right → left, appears during roll) ────────────────────
const DUST = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  xRight: 60 + i * 44,
  yOff: Math.sin(i * 0.95) * 20,
  size: 2 + (i % 3),
  delay: i * 0.065,
}))

// ─── Stack-brownie layers (bottom = idx 0, top = idx 2) ───────────────────
const STACK = [
  { idx: 0, yFinal:  60, scale: 0.84, delay: 0.20, alpha: 0.70 },
  { idx: 1, yFinal:  30, scale: 0.92, delay: 0.72, alpha: 0.86 },
  { idx: 2, yFinal:   0, scale: 1.00, delay: 1.24, alpha: 1.00 },
]

// ─────────────────────────────────────────────────────────────────────────────

export function HeroSection() {
  const [phase, setPhase]     = useState<Phase>("stacking")
  const [mounted, setMounted] = useState(false)
  const sectionRef            = useRef<HTMLElement>(null)

  // 3-D mouse-tilt (active only in floating phase)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX = useSpring(useTransform(mouseY, [-420, 420], [7, -7]),  { stiffness: 80, damping: 26 })
  const rotY = useSpring(useTransform(mouseX, [-420, 420], [-7,  7]), { stiffness: 80, damping: 26 })

  useEffect(() => {
    setMounted(true)
    //  Stacking → Rolling at 2 600 ms
    //  Rolling  → Floating at 4 200 ms  (= 2 600 + 1 600 ms roll duration)
    const t1 = setTimeout(() => setPhase("rolling"),  2600)
    const t2 = setTimeout(() => setPhase("floating"), 4200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (phase !== "floating" || !sectionRef.current) return
    const r = sectionRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - r.left - r.width  / 2)
    mouseY.set(e.clientY - r.top  - r.height / 2)
  }

  // ─── Shared styles ──────────────────────────────────────────────────────
  const BROWNIE_SIZE = "clamp(220px, 36vw, 420px)"
  const STACK_SIZE   = "clamp(200px, 30vw, 350px)"

  const BADGE_STYLE: React.CSSProperties = {
    background: "rgba(255,248,240,0.93)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(198,134,66,0.22)",
    borderRadius: 14,
    padding: "10px 16px",
    boxShadow: "0 8px 28px rgba(45,27,20,0.09)",
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
      className="relative overflow-hidden"
      style={{
        minHeight: "clamp(580px, 75svh, 100svh)",
        paddingTop: "3.5rem",
        background: "linear-gradient(150deg, #FDF8F2 0%, #FAF3E8 45%, #F5ECD8 75%, #EFE4CC 100%)",
      }}
    >

      {/* ── Ambient glow blobs ──────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{
          position: "absolute",
          width: "min(660px,90vw)", height: "min(660px,90vw)",
          top: "-15%", left: "-10%",
          background: "radial-gradient(circle, rgba(198,134,66,0.14) 0%, transparent 70%)",
          filter: "blur(70px)",
        }} />
        <div style={{
          position: "absolute",
          width: "min(760px,96vw)", height: "min(760px,96vw)",
          bottom: "-20%", right: "-14%",
          background: "radial-gradient(circle, rgba(78,52,46,0.09) 0%, rgba(198,134,66,0.07) 50%, transparent 70%)",
          filter: "blur(90px)",
        }} />
        {/* Film-grain texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.018,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }} />
      </div>

      {/* ── Main layout ─────────────────────────────────────────────────── */}
      <div
        className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 flex items-center"
        style={{ minHeight: "calc(clamp(580px,75svh,100svh) - 3.5rem)" }}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-center gap-4 lg:gap-12 w-full py-6 lg:py-0">

          {/* ════════════ LEFT — Text ════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-1 mt-2 lg:mt-0"
          >
            {/* Overline badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-3"
              style={{
                background: "linear-gradient(135deg, rgba(198,134,66,0.13), rgba(212,163,115,0.08))",
                border: "1px solid rgba(198,134,66,0.26)",
              }}
            >
              <Star className="w-3.5 h-3.5 fill-[#C68642] text-[#C68642]" />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8B5E3C" }}>
                Chocolate Brownies
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.66, duration: 0.82 }}
              className="font-serif text-balance w-full"
              style={{
                fontSize: "clamp(2.8rem, 6.5vw, 5.4rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.025em",
                color: "#2D1B14",
              }}
            >
              Pure Chocolate{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #C68642 0%, #8B5E3C 55%, #4E342E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Bliss.
              </span>
            </motion.h1>

            {/* Animated divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.80, duration: 0.72 }}
              style={{
                width: 56, height: 1,
                background: "linear-gradient(90deg, #C68642, transparent)",
                transformOrigin: "left center",
                marginTop: 10, marginBottom: 10,
              }}
            />

            {/* Body copy */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.84, duration: 0.66 }}
              style={{
                fontSize: "clamp(0.95rem, 1.8vw, 1.12rem)",
                lineHeight: 1.78,
                color: "#6D5D55",
                maxWidth: 460,
              }}
            >
              Handcrafted from the world's finest cacao. Rich, fudgy,
              irresistible — made fresh and delivered to your door.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.96, duration: 0.6 }}
              className="mt-5 flex flex-row items-center justify-center lg:justify-start gap-3 w-full"
            >
              <Link href="/products" className="flex-1 sm:flex-none">
                <button
                  className="group w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, #4E342E 0%, #2D1B14 100%)",
                    color: "#FFF8F0",
                    letterSpacing: "0.04em",
                    boxShadow: "0 4px 20px rgba(78,52,46,0.28)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.transform = "translateY(-2px)"
                    el.style.boxShadow = "0 8px 32px rgba(78,52,46,0.42)"
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.transform = "translateY(0)"
                    el.style.boxShadow = "0 4px 20px rgba(78,52,46,0.28)"
                  }}
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>

              <Link href="/about" className="flex-1 sm:flex-none">
                <button
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.97]"
                  style={{
                    background: "transparent",
                    color: "#4E342E",
                    border: "1.5px solid rgba(78,52,46,0.28)",
                    letterSpacing: "0.04em",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.borderColor = "rgba(78,52,46,0.55)"
                    el.style.background   = "rgba(78,52,46,0.05)"
                    el.style.transform    = "translateY(-2px)"
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.borderColor = "rgba(78,52,46,0.28)"
                    el.style.background   = "transparent"
                    el.style.transform    = "translateY(0)"
                  }}
                >
                  Our Story
                </button>
              </Link>
            </motion.div>

            {/* Stats row — 3 equal columns */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.7 }}
              className="mt-5 grid grid-cols-3 gap-0 w-full rounded-2xl overflow-hidden border border-[rgba(78,52,46,0.12)]"
              style={{ background: "rgba(255,248,240,0.70)", backdropFilter: "blur(12px)" }}
            >
              {[
                { value: "500+", label: "Customers" },
                { value: "4.9★", label: "Rating" },
                { value: "100%", label: "Homemade" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center py-3"
                  style={{
                    borderRight: i < 2 ? "1px solid rgba(78,52,46,0.12)" : "none",
                  }}
                >
                  <span
                    className="font-serif font-bold"
                    style={{ fontSize: "clamp(1.1rem, 4vw, 1.5rem)", color: "#2D1B14", letterSpacing: "-0.02em" }}
                  >
                    {s.value}
                  </span>
                  <span style={{ fontSize: "0.62rem", color: "#6D5D55", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ════════════ RIGHT — Brownie Scene ════════════ */}
          <div
            className="relative order-1 lg:order-2"
            style={{ height: "clamp(220px, 45vw, 560px)" }}
          >
            {/* Warm radial glow behind brownie */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 68% 58% at 52% 54%, rgba(198,134,66,0.20) 0%, rgba(212,163,115,0.09) 45%, transparent 70%)",
                filter: "blur(26px)",
              }}
            />

            {/* ─── PHASE: STACKING — three brownies fall and stack ─────────── */}
            <AnimatePresence>
              {phase === "stacking" && mounted && STACK.map(b => (
                <motion.div
                  key={`stack-${b.idx}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    margin: "auto",
                    width:  STACK_SIZE,
                    height: STACK_SIZE,
                    zIndex: b.idx + 2,
                  }}
                  initial={{ y: -780, rotate: (b.idx - 1) * 8, opacity: 0, scale: b.scale }}
                  animate={{ y: b.yFinal, rotate: (b.idx - 1) * 3, opacity: b.alpha, scale: b.scale }}
                  exit={{
                    opacity: 0,
                    y: 30,
                    scale: 0.88,
                    transition: { duration: 0.38, ease: "easeOut", delay: (2 - b.idx) * 0.03 },
                  }}
                  transition={{
                    y:       { type: "spring", stiffness: 420, damping: 24, delay: b.delay },
                    rotate:  { duration: 0.72, delay: b.delay },
                    opacity: { duration: 0.26, delay: b.delay },
                    scale:   { duration: 0.10 },
                  }}
                >
                  {/* Per-layer drop shadow — deepest on bottom brownie */}
                  <div style={{
                    position: "relative",
                    width: "100%", height: "100%",
                    filter: `drop-shadow(0 ${20 - b.idx * 5}px ${36 - b.idx * 9}px rgba(45,27,20,${(0.40 - b.idx * 0.06).toFixed(2)}))`,
                  }}>
                    <Image
                      src="/brownie-hero.png"
                      alt="Stacking brownie"
                      fill
                      priority={b.idx === 2}
                      style={{ objectFit: "contain", mixBlendMode: "multiply" }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* ─── PHASE: ROLLING → FLOATING — main brownie ──────────────── */}
            <AnimatePresence>
              {(phase === "rolling" || phase === "floating") && mounted && (
                <motion.div
                  key="brownie-main"
                  style={{
                    position: "absolute",
                    inset: 0,
                    margin: "auto",
                    width:  BROWNIE_SIZE,
                    height: BROWNIE_SIZE,
                    zIndex: 10,
                  }}
                  // Starts far right, rotates like a wheel rolling in
                  initial={{ x: 820, rotate: 400, opacity: 0 }}
                  animate={{ x: 0,   rotate:  -7, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                  transition={{
                    x:       { duration: 1.60, ease: [0.12, 1, 0.3, 1] },
                    rotate:  { duration: 1.60, ease: [0.12, 1, 0.3, 1] },
                    opacity: { duration: 0.32 },
                  }}
                >
                  {/* ── Settle bounce (fires once when phase → floating) */}
                  <motion.div
                    style={{ transformOrigin: "bottom center", height: "100%" }}
                    initial={{ scaleY: 1 }}
                    animate={
                      phase === "floating"
                        ? { scaleY: [1, 1.06, 0.96, 1.02, 1.00] }
                        : { scaleY: 1 }
                    }
                    transition={{ duration: 0.62, ease: "easeOut" }}
                  >
                    {/* ── 3D mouse-tilt (floating phase only) */}
                    <motion.div
                      style={
                        phase === "floating"
                          ? { rotateX: rotX, rotateY: rotY, transformPerspective: 1100, height: "100%" }
                          : { height: "100%" }
                      }
                    >
                      {/* ── Perpetual float loop */}
                      <motion.div
                        style={{ position: "relative", height: "100%" }}
                        animate={phase === "floating" ? { y: [0, -15, 0] } : { y: 0 }}
                        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {/* Ground shadow — breathes with float */}
                        <motion.div
                          animate={
                            phase === "floating"
                              ? { scaleX: [1, 0.80, 1], opacity: [0.28, 0.11, 0.28] }
                              : {}
                          }
                          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                          style={{
                            position: "absolute",
                            bottom: -28, left: "50%", transform: "translateX(-50%)",
                            width: "58%", height: 28,
                            borderRadius: "50%",
                            background: "radial-gradient(ellipse, rgba(45,27,20,0.30) 0%, transparent 70%)",
                            filter: "blur(14px)",
                          }}
                        />

                        {/* The brownie image */}
                        <div style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          filter:
                            "drop-shadow(0 24px 48px rgba(45,27,20,0.38))" +
                            " drop-shadow(0 8px 18px rgba(78,52,46,0.22))",
                        }}>
                          <Image
                            src="/brownie-hero.png"
                            alt="Premium handcrafted brownie by Brownie Bliss"
                            fill
                            priority
                            style={{ objectFit: "contain", mixBlendMode: "multiply" }}
                            sizes="(max-width: 640px) 68vw, (max-width: 1024px) 42vw, 420px"
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── COCOA DUST TRAIL — visible during rolling ───────────────── */}
            <AnimatePresence>
              {phase === "rolling" && mounted && DUST.map(d => (
                <motion.div
                  key={`dust-${d.id}`}
                  className="pointer-events-none"
                  style={{
                    position: "absolute",
                    width: d.size, height: d.size,
                    right: d.xRight,
                    top: `calc(57% + ${d.yOff}px)`,
                    borderRadius: "50%",
                    background: "rgba(78,52,46,0.28)",
                    filter: "blur(1.5px)",
                  }}
                  initial={{ opacity: 0, scale: 0, y: 0 }}
                  animate={{ opacity: [0, 0.60, 0], scale: [0, 1, 0.5], y: [0, -20, -44] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.35, delay: d.delay, ease: "easeOut" }}
                />
              ))}
            </AnimatePresence>

            {/* ─── FLOATING PARTICLES — chips, sparkles + badges ───────────── */}
            <AnimatePresence>
              {phase === "floating" && mounted && (
                <motion.div
                  key="floating-content"
                  style={{ position: "absolute", inset: 0 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Chocolate chips */}
                  {CHIPS.map(c => (
                    <motion.div
                      key={`chip-${c.id}`}
                      className="pointer-events-none"
                      style={{
                        position: "absolute",
                        left: `calc(50% + ${c.ox}px)`,
                        top:  `calc(50% + ${c.oy}px)`,
                        width:  c.size,
                        height: Math.round(c.size * 0.70),
                        borderRadius: "2px",
                        background: "linear-gradient(135deg, #3D2A24, #2D1B14)",
                        boxShadow: "0 2px 6px rgba(45,27,20,0.26)",
                        rotate: `${(c.id * 43) % 72 - 36}deg`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.76, 0.76, 0.50, 0.76],
                        scale:   [0, 1.00, 1.00, 0.86, 1.00],
                        x:       [0,    6,    2,   -4,    0],
                        y:       [0,   -5,    3,    2,    0],
                      }}
                      transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}

                  {/* Gold sparkles */}
                  {SPARKLES.map(s => (
                    <motion.div
                      key={`spark-${s.id}`}
                      className="pointer-events-none"
                      style={{
                        position: "absolute",
                        left:   `calc(50% + ${s.ox}px)`,
                        top:    `calc(50% + ${s.oy}px)`,
                        width:  s.size,
                        height: s.size,
                        borderRadius: "50%",
                        background: "rgba(198,134,66,0.76)",
                        boxShadow:  "0 0 8px 3px rgba(198,134,66,0.38)",
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0, 1, 0],
                        scale:   [0, 1.4, 0.6, 1.2, 0],
                      }}
                      transition={{ duration: 3.8, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}

                  {/* Badge — 100% Natural */}
                  <motion.div
                    className="absolute hidden sm:block"
                    style={{ left: 0, top: "20%", zIndex: 20 }}
                    initial={{ opacity: 0, x: -22 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55 }}
                  >
                    <div style={BADGE_STYLE}>
                      <p style={{ fontWeight: 600, fontSize: "0.86rem", color: "#4E342E" }}>100% Natural</p>
                      <p style={{ fontSize: "0.72rem", color: "#8B5E3C", marginTop: 2 }}>No Preservatives</p>
                    </div>
                  </motion.div>

                  {/* Badge — Baked Fresh */}
                  <motion.div
                    className="absolute hidden sm:block"
                    style={{ right: 0, bottom: "20%", zIndex: 20 }}
                    initial={{ opacity: 0, x: 22 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, delay: 0.2 }}
                  >
                    <div style={BADGE_STYLE}>
                      <p style={{ fontWeight: 600, fontSize: "0.86rem", color: "#4E342E" }}>Baked Fresh</p>
                      <p style={{ fontSize: "0.72rem", color: "#8B5E3C", marginTop: 2 }}>Made to Order</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>{/* end brownie scene */}
        </div>
      </div>
    </section>
  )
}
