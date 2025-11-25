/**
 * Skeleton Loading Components
 * Provides beautiful loading states for better perceived performance
 */

export function Skeleton({ className = '', ...props }) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] ${className}`}
            style={{
                animation: 'shimmer 2s infinite linear',
            }}
            {...props}
        >
            <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2 pt-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-20" />
            </div>
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export function StorefrontCardSkeleton() {
    return (
        <div className="rounded-3xl border border-white/20 bg-white/5 overflow-hidden">
            {/* Header */}
            <Skeleton className="h-40 w-full" />

            {/* Content */}
            <div className="p-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />

                {/* Colors */}
                <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-16" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4">
                    <div className="flex gap-2">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-16" />
                        <Skeleton className="h-10 w-16" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-8 flex-1" />
                        <Skeleton className="h-8 flex-1" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TableRowSkeleton({ columns = 5 }) {
    return (
        <tr className="border-b border-white/5">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

export function DashboardStatSkeleton() {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-40" />
        </div>
    );
}

export function TemplateCardSkeleton() {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <Skeleton className="h-32 w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <div className="space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                </div>
            </div>
        </div>
    );
}

export function FormSkeleton() {
    return (
        <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
            ))}
            <div className="flex gap-3 pt-4">
                <Skeleton className="h-12 flex-1 rounded-xl" />
                <Skeleton className="h-12 flex-1 rounded-xl" />
            </div>
        </div>
    );
}

export function GridSkeleton({ count = 6, component: Component = CardSkeleton }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <Component key={i} />
            ))}
        </div>
    );
}

export function ListSkeleton({ count = 5 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                </div>
            ))}
        </div>
    );
}
