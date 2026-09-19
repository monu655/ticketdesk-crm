import { STATUSES } from '../utils/constants.js';

export const ALL_STATUSES = 'All';
const OPTIONS = [ALL_STATUSES, ...STATUSES];

export default function StatusFilter({ value, onChange }) {
  return (
    <div role="group" aria-label="Filter by status" className="flex rounded-md border border-slate-300 bg-slate-100 p-0.5 md:inline-flex">
      {OPTIONS.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={`flex-auto whitespace-nowrap rounded px-2 py-1.5 text-sm font-medium md:px-3 transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600 ${
              selected ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
