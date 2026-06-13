import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  wishlist: string[]
  toggleWishlist: (id: string) => void
  hasItem: (id: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      toggleWishlist: (id) =>
        set((state) => {
          const exists = state.wishlist.includes(id)
          const newWishlist = exists
            ? state.wishlist.filter((item) => item !== id)
            : [...state.wishlist, id]
          return { wishlist: newWishlist }
        }),
      hasItem: (id) => get().wishlist.includes(id),
    }),
    {
      name: 'brownie_wishlist',
    }
  )
)

export function useWishlist() {
  return useWishlistStore()
}
