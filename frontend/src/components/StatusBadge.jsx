const STYLES = {
  Open: { badge: 'bg-blue-50 text-blue-700 ring-blue-600/20', dot: 'bg-blue-500' },
  'In Progress': { badge: 'bg-amber-50 text-amber-800 ring-amber-600/25', dot: 'bg-amber-500' },
  Closed: { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
};

export function statusDotClass(status) {
  return STYLES[status]?.dot;
}

export default function StatusBadge({ status }) {
  const style = STYLES[status] ?? STYLES.Open;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
