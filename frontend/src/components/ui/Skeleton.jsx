export function Skeleton({ className = '', width, height = 16 }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: width || '100%', height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-campus-line bg-white/50 p-5 shadow-card">
      <Skeleton width={60} height={18} className="mb-3" />
      <Skeleton height={24} className="mb-2" />
      <Skeleton width="70%" height={14} className="mb-1" />
      <Skeleton width="40%" height={14} className="mb-3" />
      <Skeleton width={80} height={30} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="overflow-hidden rounded-lg border border-campus-line bg-white/40">
      <div className="border-b border-campus-line px-4 py-3">
        <Skeleton height={14} width={200} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-campus-line/70 px-4 py-3">
          <Skeleton height={14} width="30%" />
          <Skeleton height={14} width="15%" />
          <Skeleton height={14} width="20%" />
          <Skeleton height={14} width="15%" className="ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-lg border border-campus-line bg-white/50 p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton width={60} height={32} />
          <Skeleton width={100} height={14} />
        </div>
        <Skeleton width={28} height={28} className="rounded-lg" />
      </div>
    </div>
  );
}

