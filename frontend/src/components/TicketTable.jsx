import { Link } from 'react-router-dom';
import { formatDate } from '../utils/format.js';
import Avatar from './Avatar.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import StatusBadge from './StatusBadge.jsx';

const COLUMNS = ['Ticket ID', 'Customer', 'Subject', 'Status', 'Priority', 'Created', 'Action'];

export default function TicketTable({ tickets }) {
  return (
    <>
      {/* Tablet and desktop: table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800 text-xs font-medium text-slate-200">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column} scope="col" className={`whitespace-nowrap px-4 py-3 ${column === 'Action' ? 'text-right' : ''}`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tickets.map((ticket) => (
              <tr key={ticket.ticket_id} className="transition-colors hover:bg-indigo-50/60">
                <td className="whitespace-nowrap px-4 py-3.5">
                  <Link
                    to={`/tickets/${ticket.ticket_id}`}
                    className="font-semibold tabular-nums text-indigo-600 hover:underline"
                  >
                    {ticket.ticket_id}
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={ticket.customer_name} />
                    <div>
                      <div className="font-medium text-slate-900">{ticket.customer_name}</div>
                      <div className="text-xs text-slate-500">{ticket.customer_email}</div>
                    </div>
                  </div>
                </td>
                <td className="min-w-56 px-4 py-3.5 text-slate-700">
                  <div className="line-clamp-2">{ticket.subject}</div>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-3.5">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">{formatDate(ticket.created_at)}</td>
                <td className="px-4 py-3.5 text-right">
                  <Link
                    to={`/tickets/${ticket.ticket_id}`}
                    className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: one card per ticket */}
      <ul className="divide-y divide-slate-200 md:hidden">
        {tickets.map((ticket) => (
          <li key={ticket.ticket_id}>
            <Link to={`/tickets/${ticket.ticket_id}`} className="block px-4 py-3.5 hover:bg-indigo-50/60">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold tabular-nums text-indigo-600">{ticket.ticket_id}</span>
                <StatusBadge status={ticket.status} />
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-900">{ticket.subject}</p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={ticket.customer_name} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-slate-900">{ticket.customer_name}</div>
                  <div className="text-xs text-slate-500">{formatDate(ticket.created_at)}</div>
                </div>
                <PriorityBadge priority={ticket.priority} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
