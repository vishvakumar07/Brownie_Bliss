"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { 
  Search, 
  Filter,
  Eye,
  Trash2,
  ChevronDown,
  RefreshCw,
  Download,
  FileText,
  FileSpreadsheet,
  Table,
  DatabaseZap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

interface Order {
  id: string
  customer_name: string
  phone: string
  address: string
  product_name: string
  quantity: number
  total: number
  payment_method: string
  status: string
  created_at: string
  special_instructions?: string
}

// ── 10 realistic demo orders ──────────────────────────────────────────────────
function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(Math.floor(8 + Math.random() * 12), Math.floor(Math.random() * 60))
  return d.toISOString()
}

const DEMO_ORDERS: Order[] = [
  {
    id: "demo-001-aabb",
    customer_name: "Priya Sharma",
    phone: "9876543210",
    address: "12, Rose Garden, Koramangala, Bengaluru, Karnataka – 560034",
    product_name: "Classic Brownie",
    quantity: 3,
    total: 447,
    payment_method: "UPI",
    status: "Delivered",
    created_at: daysAgo(0),
    special_instructions: "Please pack it nicely — it's a birthday gift! 🎂",
  },
  {
    id: "demo-002-ccdd",
    customer_name: "Rahul Verma",
    phone: "9123456780",
    address: "45, MG Road, Pune, Maharashtra – 411001",
    product_name: "Nutella Brownie",
    quantity: 2,
    total: 358,
    payment_method: "COD",
    status: "Processing",
    created_at: daysAgo(0),
    special_instructions: "",
  },
  {
    id: "demo-003-eeff",
    customer_name: "Ananya Iyer",
    phone: "9988776655",
    address: "7, Gandhi Nagar, Coimbatore, Tamil Nadu – 641001",
    product_name: "Triple Chocolate Brownie",
    quantity: 4,
    total: 796,
    payment_method: "UPI",
    status: "Pending",
    created_at: daysAgo(1),
    special_instructions: "Ring the bell twice.",
  },
  {
    id: "demo-004-gghh",
    customer_name: "Arjun Patel",
    phone: "9090909090",
    address: "22, Satellite, Ahmedabad, Gujarat – 380015",
    product_name: "Salted Caramel Brownie",
    quantity: 1,
    total: 189,
    payment_method: "Card",
    status: "Delivered",
    created_at: daysAgo(1),
    special_instructions: "",
  },
  {
    id: "demo-005-iijj",
    customer_name: "Meera Nair",
    phone: "8800112233",
    address: "3, Indiranagar, Bengaluru, Karnataka – 560038",
    product_name: "Walnut Brownie",
    quantity: 5,
    total: 845,
    payment_method: "UPI",
    status: "Delivered",
    created_at: daysAgo(2),
    special_instructions: "Leave at door if no one answers.",
  },
  {
    id: "demo-006-kkll",
    customer_name: "Karan Mehta",
    phone: "9654321098",
    address: "8, Sector 18, Noida, Uttar Pradesh – 201301",
    product_name: "Peanut Butter Brownie",
    quantity: 2,
    total: 358,
    payment_method: "COD",
    status: "Cancelled",
    created_at: daysAgo(3),
    special_instructions: "",
  },
  {
    id: "demo-007-mmnn",
    customer_name: "Sneha Reddy",
    phone: "7700112244",
    address: "15, Banjara Hills, Hyderabad, Telangana – 500034",
    product_name: "Red Velvet Brownie",
    quantity: 2,
    total: 378,
    payment_method: "UPI",
    status: "Delivered",
    created_at: daysAgo(3),
    special_instructions: "Add a small note: 'Happy Anniversary!'",
  },
  {
    id: "demo-008-oopq",
    customer_name: "Vikram Singh",
    phone: "9812345678",
    address: "67, Civil Lines, Jaipur, Rajasthan – 302006",
    product_name: "Triple Chocolate Brownie",
    quantity: 6,
    total: 1194,
    payment_method: "Card",
    status: "Processing",
    created_at: daysAgo(4),
    special_instructions: "Corporate order — invoice required.",
  },
  {
    id: "demo-009-rrss",
    customer_name: "Divya Krishnan",
    phone: "9500123456",
    address: "2, Anna Nagar, Chennai, Tamil Nadu – 600040",
    product_name: "Classic Brownie",
    quantity: 4,
    total: 596,
    payment_method: "UPI",
    status: "Delivered",
    created_at: daysAgo(5),
    special_instructions: "",
  },
  {
    id: "demo-010-ttuu",
    customer_name: "Rohan Desai",
    phone: "9321654987",
    address: "19, FC Road, Pune, Maharashtra – 411005",
    product_name: "Cookie Dough Brownie",
    quantity: 3,
    total: 627,
    payment_method: "COD",
    status: "Pending",
    created_at: daysAgo(6),
    special_instructions: "Allergic to peanuts — please confirm no cross contamination.",
  },
]

const statusOptions = ["All", "Pending", "Processing", "Delivered", "Cancelled"]

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

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [usingDemo, setUsingDemo] = useState(false)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        setOrders(data)
        setUsingDemo(false)
      } else {
        // No real orders yet — show demo data
        setOrders(DEMO_ORDERS)
        setUsingDemo(true)
      }
    } catch (err: any) {
      // Connection failed — still show demo data
      setOrders(DEMO_ORDERS)
      setUsingDemo(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()

    // Real-time subscription
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchOrders])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "All" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateStatus = async (orderId: string, newStatus: string) => {
    if (usingDemo) {
      // Update demo data locally only
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null)
      }
      toast.success(`Status updated to ${newStatus} (demo mode)`)
      return
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId)

    if (error) {
      toast.error("Failed to update status: " + error.message)
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      toast.success(`Order status updated to ${newStatus}`)
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return

    if (usingDemo) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      toast.success("Order removed (demo mode)")
      return
    }

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId)

    if (error) {
      toast.error("Failed to delete order: " + error.message)
    } else {
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      toast.success("Order deleted")
    }
  }

  const exportToCSV = () => {
    if (filteredOrders.length === 0) { toast.error("No data available to export"); return }
    const headers = ["Order ID", "Customer Name", "Product Name", "Quantity", "Address", "Total Amount", "Payment Method", "Order Status", "Order Date"]
    const rows = filteredOrders.map(order => [
      order.id.slice(0, 8).toUpperCase(), order.customer_name, order.product_name,
      order.quantity, order.address || "—", order.total, order.payment_method,
      order.status, new Date(order.created_at).toLocaleString("en-IN")
    ])
    const csvContent = [headers.join(","), ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `orders_export_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("CSV exported successfully")
  }

  const exportToExcel = () => {
    if (filteredOrders.length === 0) { toast.error("No data available to export"); return }
    const data = filteredOrders.map(order => ({
      "Order ID": order.id.slice(0, 8).toUpperCase(),
      "Customer Name": order.customer_name, "Product Name": order.product_name,
      "Quantity": order.quantity, "Address": order.address || "—",
      "Total Amount": order.total, "Payment Method": order.payment_method,
      "Order Status": order.status, "Order Date": new Date(order.created_at).toLocaleString("en-IN")
    }))
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders")
    XLSX.writeFile(workbook, `orders_export_${new Date().toISOString().slice(0, 10)}.xlsx`)
    toast.success("Excel exported successfully")
  }

  const exportToPDF = () => {
    if (filteredOrders.length === 0) { toast.error("No data available to export"); return }
    const doc = new jsPDF("l", "mm", "a4")
    doc.setFontSize(18); doc.setTextColor(45, 27, 20)
    doc.text("Brownie Bliss — Orders Report", 14, 15)
    doc.setFontSize(10); doc.setTextColor(109, 93, 85)
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")} | Total Records: ${filteredOrders.length}`, 14, 21)
    const headers = ["Order ID", "Customer Name", "Product Name", "Qty", "Total (Rs)", "Payment", "Status", "Date"]
    const rows = filteredOrders.map(order => [
      order.id.slice(0, 8).toUpperCase(), order.customer_name, order.product_name,
      order.quantity, order.total, order.payment_method, order.status,
      new Date(order.created_at).toLocaleDateString("en-IN")
    ])
    autoTable(doc, {
      startY: 26, head: [headers], body: rows, theme: "striped",
      headStyles: { fillColor: [78, 52, 46], textColor: [255, 248, 240], fontSize: 10, fontStyle: "bold", halign: "left" },
      bodyStyles: { fontSize: 9, textColor: [45, 27, 20], lineColor: [232, 221, 212], lineWidth: 0.1 },
      alternateRowStyles: { fillColor: [255, 248, 240] },
      columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 35 }, 2: { cellWidth: 45 }, 3: { cellWidth: 15, halign: "center" }, 4: { cellWidth: 22, halign: "right" }, 5: { cellWidth: 22 }, 6: { cellWidth: 22 }, 7: { cellWidth: 30 } },
      didDrawPage: (data) => {
        doc.setFontSize(9); doc.setTextColor(109, 93, 85)
        doc.text(`Page ${data.pageNumber}`, 280, 200, { align: "right" })
      }
    })
    doc.save(`orders_report_${new Date().toISOString().slice(0, 10)}.pdf`)
    toast.success("PDF report generated successfully")
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2" disabled={loading}>
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer gap-2">
                <Table className="w-4 h-4 text-[#6D5D55]" /> Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer gap-2">
                <FileSpreadsheet className="w-4 h-4 text-green-600" /> Export Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer gap-2">
                <FileText className="w-4 h-4 text-red-500" /> Export PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="gap-2" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Demo mode banner */}
      {usingDemo && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
          <DatabaseZap className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Demo Mode — Sample Orders</p>
            <p className="text-xs text-amber-700 mt-0.5">
              No real orders in the database yet. Showing 10 sample orders so you can explore
              the interface. All status changes work locally. Connect Supabase to manage real orders.
            </p>
          </div>
        </div>
      )}

      {/* Stats strip */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {["Pending", "Processing", "Delivered", "Cancelled"].map((status) => {
            const count = orders.filter((o) => o.status === status).length
            const colors: Record<string, string> = {
              Pending: "border-yellow-200 bg-yellow-50 text-yellow-800",
              Processing: "border-blue-200 bg-blue-50 text-blue-800",
              Delivered: "border-green-200 bg-green-50 text-green-800",
              Cancelled: "border-red-200 bg-red-50 text-red-800",
            }
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status === statusFilter ? "All" : status)}
                className={`rounded-xl border px-4 py-3 text-left transition-all ${colors[status]} ${statusFilter === status ? "ring-2 ring-offset-1 ring-current" : "hover:brightness-95"}`}
              >
                <p className="text-xs font-semibold opacity-70">{status}</p>
                <p className="text-2xl font-extrabold">{count}</p>
              </button>
            )
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by customer, order ID, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="font-serif text-xl">
              All Orders ({filteredOrders.length})
              {usingDemo && <span className="ml-2 text-xs font-normal text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">demo</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Loading orders…</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Qty</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Payment</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs font-medium">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-sm">{order.customer_name}</p>
                            <p className="text-xs text-muted-foreground">{order.phone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">{order.product_name}</td>
                        <td className="py-3 px-4 text-sm">{order.quantity}</td>
                        <td className="py-3 px-4 font-semibold text-sm text-chocolate">Rs. {order.total}</td>
                        <td className="py-3 px-4 text-sm">{order.payment_method}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{formatDate(order.created_at)}</td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex items-center gap-1">
                                <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                                  {order.status}
                                </Badge>
                                <ChevronDown className="w-3 h-3" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {["Pending", "Processing", "Delivered", "Cancelled"].map((status) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() => updateStatus(order.id, status)}
                                >
                                  {status}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteOrder(order.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredOrders.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No orders match your search.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">
                  Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedOrder.phone || "—"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="font-medium">{selectedOrder.address || "—"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Product</p>
                    <p className="font-medium">{selectedOrder.product_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{selectedOrder.quantity}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-serif text-xl font-bold text-chocolate">Rs. {selectedOrder.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{selectedOrder.payment_method}</p>
                  </div>
                </div>

                {selectedOrder.special_instructions && (
                  <div>
                    <p className="text-sm text-muted-foreground">Special Instructions</p>
                    <p className="font-medium bg-muted p-3 rounded-lg mt-1">{selectedOrder.special_instructions}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {["Pending", "Processing", "Delivered", "Cancelled"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selectedOrder.id, s)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                          selectedOrder.status === s
                            ? statusColors[s] + " border-current ring-1 ring-current"
                            : "border-border hover:border-chocolate hover:text-chocolate"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Ordered</p>
                  <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString("en-IN")}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
