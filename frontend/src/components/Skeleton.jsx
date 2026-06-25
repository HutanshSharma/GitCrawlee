export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export function RepoCardSkeleton({ index = 0 }) {
  return (
    <div
      style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
      className="glass-morphism reveal rounded-[10px] p-5"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="h-3.5 w-full mb-2" />
      <Skeleton className="h-3.5 w-4/5 mb-6" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export default Skeleton
