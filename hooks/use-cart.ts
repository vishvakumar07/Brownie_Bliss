import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggleCart: () => void
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, delta: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          let newItems
          if (existing) {
            newItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
            )
          } else {
            newItems = [...state.items, { ...item, quantity }]
          }
          return { items: newItems }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, delta) =>
        set((state) => {
          const newItems = state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
            .filter((i) => i.quantity > 0)
          return { items: newItems }
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'brownie_cart',
    }
  )
)

export function useCart() {
  const store = useCartStore()
  
  const cartCount = store.items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = store.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 0 && subtotal < 500 ? 50 : 0
  const tax = Math.round(subtotal * 0.05 * 100) / 100 // 5% GST included in price
  const grandTotal = subtotal + deliveryFee

  return {
    ...store,
    cartCount,
    subtotal,
    deliveryFee,
    tax,
    grandTotal,
  }
}
