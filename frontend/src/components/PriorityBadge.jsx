const DOT_STYLES = {
  High: 'bg-red-500',
  Medium: 'bg-slate-400',
  Low: 'bg-slate-300',
};

// Plain text with a dot, so it stays visually separate from the filled status badge.
export default function PriorityBadge({ priority }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-slate-700">
      <span className={`h-2 w-2 rounded-full ${DOT_STYLES[priority] ?? DOT_STYLES.Medium}`} />
      {priority}
    </span>
  );
}
