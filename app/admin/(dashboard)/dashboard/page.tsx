"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  IndianRupee,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface Order {
  id: string
  customer_name: string
  product_name: string
  quantity: number
  total: number
  status: string
  created_at: string
}

interface DashboardStats {
  totalOrders: number
  todayOrders: number
  monthlyRevenue: number
  activeProducts: number
  pending: number
  processing: number
  delivered: number
  cancelled: number
}

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return `Today, ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    activeProducts: 0,
    pending: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()

      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (ordersError) throw ordersError

      const allOrders: Order[] = orders || []

      // Fetch active products count
      const { count: productsCount } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("active", true)

      // Compute stats
      const todayOrders = allOrders.filter(
        (o) => o.created_at && new Date(o.created_at) >= today
      ).length

      const monthlyRevenue = allOrders
        .filter((o) => o.created_at && o.created_at >= thisMonthStart && o.status !== "Cancelled")
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0)

      const pending = allOrders.filter((o) => o.status === "Pending").length
      const processing = allOrders.filter((o) => o.status === "Processing").length
      const delivered = allOrders.filter((o) => o.status === "Delivered").length
      const cancelled = allOrders.filter((o) => o.status === "Cancelled").length

      setStats({
        totalOrders: allOrders.length,
        todayOrders,
        monthlyRevenue,
        activeProducts: productsCount || 0,
        pending,
        processing,
        delivered,
        cancelled,
      })

      setRecentOrders(allOrders.slice(0, 5))
    } catch (err: any) {
      console.error("Dashboard fetch error:", err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()

    // Real-time subscription
    const channel = supabase
      .channel("dashboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, fetchDashboard)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchDashboard])

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      sub: "All time",
      icon: ShoppingBag,
      color: "bg-[#4E342E]/10 text-[#4E342E]",
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders.toString(),
      sub: "Since midnight",
      icon: Clock,
      color: "bg-[#D4A373]/15 text-[#A0522D]",
    },
    {
      title: "Monthly Revenue",
      value: stats.monthlyRevenue.toLocaleString("en-IN"),
      sub: "This month",
      icon: IndianRupee,
      color: "bg-[#10B981]/10 text-[#10B981]",
      prefix: "Rs. ",
    },
    {
      title: "Active Products",
      value: stats.activeProducts.toString(),
      sub: "Available now",
      icon: Package,
      color: "bg-[#F59E0B]/10 text-[#F59E0B]",
    },
  ]

  const orderStatCards = [
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-[#D97706] bg-[#FEF3C7] border-[#FDE68A]" },
    { label: "Processing", value: stats.processing, icon: TrendingUp, color: "text-[#2563EB] bg-[#DBEAFE] border-[#BFDBFE]" },
    { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-[#059669] bg-[#D1FAE5] border-[#A7F3D0]" },
    { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]" },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2D1B14]">Dashboard</h1>
          <p className="text-sm text-[#6D5D55] mt-1">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        {loading && <RefreshCw className="w-5 h-5 animate-spin text-[#6D5D55]" />}
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div 
            key={index} 
            variants={item}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <Card className="border border-[#E8DDD4] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#D4A373]/30 transition-all duration-300 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-[#6D5D55] uppercase tracking-wider">{stat.title}</p>
                    <p className="font-sans text-3xl font-extrabold tracking-tight text-[#2D1B14]">
                      {stat.prefix}{stat.value}
                    </p>
                    <p className="text-xs text-[#6D5D55] font-medium">{stat.sub}</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.color} shrink-0`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Order Status Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {orderStatCards.map((stat, index) => (
          <motion.div 
            key={index} 
            variants={item}
            whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
          >
            <Card className="border border-[#E8DDD4] shadow-[0_2px_6px_rgba(0,0,0,0.02)] bg-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-xl border ${stat.color} shrink-0`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-sans text-2xl font-extrabold text-[#2D1B14] tracking-tight">{stat.value}</p>
                  <p className="text-xs font-semibold text-[#6D5D55]">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border border-[#E8DDD4] shadow-[0_2px_8px_rgba(0,0,0,0.03)] bg-white rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#E8DDD4] bg-[#FFF8F0]/40 px-6 py-4">
            <CardTitle className="font-serif text-lg font-bold text-[#2D1B14]">Recent Orders</CardTitle>
            <Badge variant="secondary" className="gap-1 bg-[#4E342E]/10 text-[#4E342E] hover:bg-[#4E342E]/15 border-0">
              <Truck className="w-3 h-3" />
              {stats.pending + stats.processing} Active
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length === 0 ? (
              <p className="text-center py-12 text-[#6D5D55] text-sm">
                No orders yet. New orders will appear here automatically.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8DDD4] bg-[#FFF8F0]/20">
                      <th className="text-left py-4 px-6 text-xs font-bold text-[#6D5D55] uppercase tracking-wider">Order ID</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-[#6D5D55] uppercase tracking-wider">Customer</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-[#6D5D55] uppercase tracking-wider">Product</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-[#6D5D55] uppercase tracking-wider text-center">Qty</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-[#6D5D55] uppercase tracking-wider">Total</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-[#6D5D55] uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-[#6D5D55] uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-[#E8DDD4] last:border-0 hover:bg-[#FFF8F0]/15 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs font-semibold text-[#4E342E]">#{order.id.slice(0, 8).toUpperCase()}</td>
                        <td className="py-4 px-6 text-sm font-medium text-[#2D1B14]">{order.customer_name}</td>
                        <td className="py-4 px-6 text-sm text-[#6D5D55]">{order.product_name}</td>
                        <td className="py-4 px-6 text-sm text-[#6D5D55] text-center font-semibold">{order.quantity}</td>
                        <td className="py-4 px-6 text-sm font-bold text-[#2D1B14]">Rs. {order.total}</td>
                        <td className="py-4 px-6 text-sm">
                          <Badge className={`${statusColors[order.status] || "bg-gray-100 text-gray-800"} border-0 shadow-none px-2.5 py-0.5 text-xs font-bold rounded-full`}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-[#6D5D55] text-xs font-medium">
                          {formatDate(order.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
