import Skeleton from './Skeleton.jsx';

const CARDS = [
  { key: 'total', label: 'Total Tickets', accent: 'border-l-slate-800' },
  { key: 'open', label: 'Open', accent: 'border-l-blue-500' },
  { key: 'in_progress', label: 'In Progress', accent: 'border-l-amber-500' },
  { key: 'closed', label: 'Closed', accent: 'border-l-emerald-500' },
];

export default function StatsCards({ stats, loading }) {
  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {CARDS.map(({ key, label, accent }) => (
        <div
          key={key}
          className={`rounded-lg border border-l-4 border-slate-200 bg-white px-4 py-4 shadow-xs ${accent}`}
        >
          <dt className="text-sm font-medium text-slate-500">{label}</dt>
          <dd className="mt-1.5 text-3xl font-semibold tabular-nums text-slate-900">
            {loading && !stats ? <Skeleton className="mt-2 h-7 w-12" /> : (stats?.[key] ?? '–')}
          </dd>
        </div>
      ))}
    </dl>
  );
}
