import Skeleton from './Skeleton.jsx';

export default function TableSkeleton({ rows = 6 }) {
  return (
    <div role="status" aria-label="Loading tickets" className="divide-y divide-slate-200">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-4 py-4">
          <Skeleton className="h-4 w-16" />
          <div className="hidden w-40 space-y-2 md:block">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="hidden h-4 w-20 md:block" />
        </div>
      ))}
    </div>
  );
}
