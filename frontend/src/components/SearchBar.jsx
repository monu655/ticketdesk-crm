import { SearchIcon } from './icons.jsx';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex-1">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
        <SearchIcon />
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search tickets by customer name, email, ticket ID or issue..."
        aria-label="Search tickets"
        className="block w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      />
    </div>
  );
}
