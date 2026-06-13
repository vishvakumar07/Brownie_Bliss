import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-white border border-[#EDE5DC] p-0 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-square bg-[#FAF6F1]">
        <Skeleton className="w-full h-full bg-[#FAF6F1] rounded-none" />
      </div>
      
      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3">
        {/* Title */}
        <Skeleton className="h-4 bg-[#F5EDE6] rounded-full w-4/5 mb-2.5" />
        
        {/* Price & Button Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <Skeleton className="h-5 bg-[#F5EDE6] rounded-full w-1/3" />
          <Skeleton className="h-7 w-16 bg-[#F5EDE6] rounded-full" />
        </div>
        
        {/* Rating */}
        <Skeleton className="h-3 bg-[#F5EDE6] rounded-full w-1/2" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#EDE5DC] animate-pulse">
      {/* Image */}
      <Skeleton className="w-12 h-12 bg-[#FAF6F1] rounded-xl shrink-0" />
      
      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-3.5 bg-[#FAF6F1] rounded-full w-3/4" />
        <Skeleton className="h-3 bg-[#FAF6F1] rounded-full w-1/3" />
      </div>
      
      {/* Controls */}
      <Skeleton className="w-20 h-7 bg-[#FAF6F1] rounded-full shrink-0" />
      
      {/* Price */}
      <Skeleton className="w-12 h-4 bg-[#FAF6F1] rounded-full shrink-0 text-right" />
    </div>
  )
}
