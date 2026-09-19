import Skeleton from './Skeleton.jsx';

export default function TicketDetailsSkeleton() {
  return (
    <div role="status" aria-label="Loading ticket" className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-7 w-2/3 max-w-lg" />
      </div>
      <div className="grid grid-cols-2 gap-6 rounded-lg border border-slate-200 bg-white p-5 lg:grid-cols-4">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <Skeleton className="h-56 lg:col-span-3" />
        <Skeleton className="h-56 lg:col-span-2" />
      </div>
    </div>
  );
}
