import { InboxIcon } from './icons.jsx';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <InboxIcon />
      </div>
      <h2 className="mt-4 text-sm font-semibold text-slate-900">{title}</h2>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
