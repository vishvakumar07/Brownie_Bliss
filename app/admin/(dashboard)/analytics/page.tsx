"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, TrendingUp, ShoppingBag, IndianRupee, DatabaseZap } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { supabase } from "@/lib/supabase"

const CHART_COLORS = ["#4E342E", "#C68642", "#D4A373", "#2D1B14", "#8B5A2B", "#A0522D"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface MonthlyData { month: string; revenue: number; orders: number }
interface DailyData { day: string; orders: number }
interface ProductSale { name: string; sales: number; fill: string }
interface Summary { totalRevenue: number; totalOrders: number; avgOrderValue: number; deliveredCount: number }

// ── Pre-computed demo analytics (matches the 10 dummy orders) ─────────────────
const DEMO_SUMMARY: Summary = {
  totalRevenue: 4599,   // sum of all non-cancelled order totals
  totalOrders: 10,
  avgOrderValue: 460,
  deliveredCount: 5,
}

const DEMO_MONTHLY: MonthlyData[] = (() => {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const label = MONTHS[d.getMonth()]
    // Ramp up over 6 months (realistic growth curve)
    const base = [1180, 1450, 1920, 2380, 3200, 4599]
    const ordBase = [3, 4, 5, 6, 8, 10]
    return { month: label, revenue: base[i], orders: ordBase[i] }
  })
})()

const DEMO_DAILY: DailyData[] = (() => {
  const today = new Date().getDay()
  const values = [0, 1, 2, 1, 3, 2, 1]
  return DAYS.map((day, i) => ({
    day,
    orders: i <= today ? values[i] : 0,
  }))
})()

const DEMO_PRODUCTS: ProductSale[] = [
  { name: "Classic Brownie", sales: 3, fill: CHART_COLORS[0] },
  { name: "Triple Choc…", sales: 2, fill: CHART_COLORS[1] },
  { name: "Cookie Dough", sales: 1, fill: CHART_COLORS[2] },
  { name: "Walnut Brownie", sales: 1, fill: CHART_COLORS[3] },
  { name: "Nutella Brownie", sales: 1, fill: CHART_COLORS[4] },
  { name: "Red Velvet", sales: 1, fill: CHART_COLORS[5] },
]

export default function AnalyticsPage() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [dailyData, setDailyData] = useState<DailyData[]>([])
  const [productSales, setProductSales] = useState<ProductSale[]>([])
  const [summary, setSummary] = useState<Summary>({ totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, deliveredCount: 0 })
  const [loading, setLoading] = useState(true)
  const [usingDemo, setUsingDemo] = useState(false)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")

      if (error) throw error
      const all = orders || []

      if (all.length === 0) {
        // No real data — use demo analytics
        setMonthlyData(DEMO_MONTHLY)
        setDailyData(DEMO_DAILY)
        setProductSales(DEMO_PRODUCTS)
        setSummary(DEMO_SUMMARY)
        setUsingDemo(true)
        return
      }

      setUsingDemo(false)
      const valid = all.filter((o) => o && o.status !== "Cancelled")

      // ── Monthly revenue & orders (last 6 months) ──
      const now = new Date()
      const monthly: MonthlyData[] = []
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const label = MONTHS[d.getMonth()]
        const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1)
        const slice = valid.filter((o) => {
          if (!o.created_at) return false
          const t = new Date(o.created_at)
          return t >= d && t < nextMonth
        })
        monthly.push({
          month: label,
          revenue: slice.reduce((s, o) => s + (Number(o.total) || 0), 0),
          orders: slice.length,
        })
      }
      setMonthlyData(monthly)

      // ── Daily orders (this week) ──
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      weekStart.setHours(0, 0, 0, 0)
      const daily: DailyData[] = DAYS.map((day, idx) => {
        const dayStart = new Date(weekStart)
        dayStart.setDate(weekStart.getDate() + idx)
        const dayEnd = new Date(dayStart)
        dayEnd.setDate(dayStart.getDate() + 1)
        const count = all.filter((o) => {
          if (!o.created_at) return false
          const t = new Date(o.created_at)
          return t >= dayStart && t < dayEnd
        }).length
        return { day, orders: count }
      })
      setDailyData(daily)

      // ── Product sales breakdown ──
      const productMap: Record<string, number> = {}
      all.forEach((o) => {
        if (o && o.product_name) productMap[o.product_name] = (productMap[o.product_name] || 0) + 1
      })
      setProductSales(
        Object.entries(productMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, sales], idx) => ({
            name: name.length > 12 ? name.slice(0, 12) + "…" : name,
            sales,
            fill: CHART_COLORS[idx % CHART_COLORS.length],
          }))
      )

      // ── Summary ──
      const totalRevenue = valid.reduce((s, o) => s + (Number(o.total) || 0), 0)
      setSummary({
        totalRevenue,
        totalOrders: all.length,
        avgOrderValue: all.length > 0 ? Math.round(totalRevenue / all.length) : 0,
        deliveredCount: all.filter((o) => o.status === "Delivered").length,
      })
    } catch (err: any) {
      // Connection failed — use demo data
      setMonthlyData(DEMO_MONTHLY)
      setDailyData(DEMO_DAILY)
      setProductSales(DEMO_PRODUCTS)
      setSummary(DEMO_SUMMARY)
      setUsingDemo(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
    const channel = supabase
      .channel("analytics-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchAnalytics)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchAnalytics])

  const tooltipStyle = {
    backgroundColor: "#FFF8F0",
    border: "1px solid #E8DDD4",
    borderRadius: "8px",
  }

  const statCards = [
    {
      label: "Total Revenue",
      sub: "excluding cancelled",
      value: `Rs. ${summary.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "from-[#4E342E] to-[#2D1B14]",
    },
    {
      label: "Total Orders",
      sub: "all time",
      value: summary.totalOrders.toString(),
      icon: ShoppingBag,
      color: "from-[#C68642] to-[#8B5A2B]",
    },
    {
      label: "Avg. Order Value",
      sub: "per transaction",
      value: `Rs. ${summary.avgOrderValue}`,
      icon: TrendingUp,
      color: "from-[#D4A373] to-[#C68642]",
    },
    {
      label: "Delivered",
      sub: "successfully fulfilled",
      value: summary.deliveredCount.toString(),
      icon: ShoppingBag,
      color: "from-green-700 to-green-900",
    },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2D1B14]">Analytics</h1>
          <p className="text-sm text-[#6D5D55] mt-1">Track your business performance and customer insights</p>
        </div>
        {loading && <RefreshCw className="w-5 h-5 animate-spin text-[#6D5D55]" />}
      </div>

      {/* Demo banner */}
      {usingDemo && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
          <DatabaseZap className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Demo Mode — Sample Analytics</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Charts show a realistic 6-month growth preview based on the 10 demo orders.
              Connect Supabase to see live data from real customer orders.
            </p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`rounded-2xl bg-gradient-to-br ${s.color} p-5 text-white shadow-md`}
          >
            <div className="flex items-center justify-between mb-3">
              <s.icon className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-2xl font-extrabold tracking-tight">{s.value}</p>
            <p className="text-xs font-semibold opacity-90 mt-1">{s.label}</p>
            <p className="text-[10px] opacity-60 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Revenue Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border border-[#E8DDD4] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-[#FFF8F0]/30 border-b border-[#E8DDD4] px-6 py-4">
              <CardTitle className="font-serif text-base font-bold text-[#2D1B14]">Revenue Trend (6 months)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3EBE3" />
                    <XAxis dataKey="month" stroke="#8A756A" tick={{ fontSize: 11, fontWeight: 500 }} />
                    <YAxis stroke="#8A756A" tick={{ fontSize: 11, fontWeight: 500 }} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: number) => [`Rs. ${v.toLocaleString("en-IN")}`, "Revenue"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4E342E"
                      strokeWidth={3}
                      dot={{ fill: "#4E342E", r: 4, strokeWidth: 1 }}
                      activeDot={{ r: 6, fill: "#D4A373", strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border border-[#E8DDD4] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-[#FFF8F0]/30 border-b border-[#E8DDD4] px-6 py-4">
              <CardTitle className="font-serif text-base font-bold text-[#2D1B14]">Orders Trend (6 months)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3EBE3" />
                    <XAxis dataKey="month" stroke="#8A756A" tick={{ fontSize: 11, fontWeight: 500 }} />
                    <YAxis stroke="#8A756A" tick={{ fontSize: 11, fontWeight: 500 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="orders" fill="#D4A373" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Best Selling Products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border border-[#E8DDD4] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-[#FFF8F0]/30 border-b border-[#E8DDD4] px-6 py-4">
              <CardTitle className="font-serif text-base font-bold text-[#2D1B14]">Best Selling Products</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productSales}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="sales"
                      label={({ name, percent }) => percent > 0.08 ? `${(percent * 100).toFixed(0)}%` : ""}
                      labelLine={false}
                    >
                      {productSales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: number, _: string, props: any) => [`${v} orders`, props.payload?.name]}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#6D5D55" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Orders This Week */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border border-[#E8DDD4] shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-[#FFF8F0]/30 border-b border-[#E8DDD4] px-6 py-4">
              <CardTitle className="font-serif text-base font-bold text-[#2D1B14]">Daily Orders (This Week)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3EBE3" />
                    <XAxis dataKey="day" stroke="#8A756A" tick={{ fontSize: 11, fontWeight: 500 }} />
                    <YAxis stroke="#8A756A" tick={{ fontSize: 11, fontWeight: 500 }} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="orders" fill="#4E342E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
