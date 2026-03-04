// src/components/Skeleton.tsx

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export const Skeleton = ({
  width = '100%',
  height = '1rem',
  borderRadius = '6px',
  className = '',
}: SkeletonProps) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius }}
    aria-hidden="true"
  />
);

export const ImovelCardSkeleton = () => (
  <div className="card skeleton-card" aria-hidden="true">
    <div className="skeleton-img skeleton" />
    <div className="card-body">
      <Skeleton height="1.5rem" width="70%" borderRadius="8px" />
      <Skeleton height="1.25rem" width="50%" borderRadius="8px" />
      <Skeleton height="1rem" width="85%" borderRadius="6px" />
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <Skeleton height="1rem" width="4rem" borderRadius="6px" />
        <Skeleton height="1rem" width="4rem" borderRadius="6px" />
        <Skeleton height="1rem" width="4rem" borderRadius="6px" />
      </div>
      <Skeleton height="2.5rem" borderRadius="8px" />
    </div>
  </div>
);
