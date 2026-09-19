import { formatDateTime } from '../utils/format.js';
import { PRIORITIES, STATUSES } from '../utils/constants.js';
import FormField from './FormField.jsx';

function Detail({ label, className = '', children }) {
  return (
    <div className={className}>
      <dt className="mb-1.5 text-sm font-medium text-slate-700">{label}</dt>
      <dd className="py-2 text-sm text-slate-900">{children}</dd>
    </div>
  );
}

// `busy` disables the dropdowns while a change is being saved.
export default function TicketSummary({ ticket, onStatusChange, onPriorityChange, busy }) {
  return (
    <section
      aria-label="Ticket summary"
      className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg border border-slate-200 bg-white p-5 sm:gap-x-6 lg:grid-cols-4"
    >
      <dl className="contents">
        <Detail label="Ticket ID">
          <span className="font-medium tabular-nums">{ticket.ticket_id}</span>
        </Detail>
        <Detail label="Customer Name">{ticket.customer_name}</Detail>
        <Detail label="Customer Email" className="col-span-2 lg:col-span-1">
          <a href={`mailto:${ticket.customer_email}`} className="break-all text-indigo-600 hover:underline">
            {ticket.customer_email}
          </a>
        </Detail>
        <Detail label="Created">{formatDateTime(ticket.created_at)}</Detail>
        <Detail label="Last Updated">{formatDateTime(ticket.updated_at)}</Detail>
      </dl>

      <FormField
        label="Status"
        name="status"
        as="select"
        value={ticket.status}
        onChange={(event) => onStatusChange(event.target.value)}
        disabled={busy}
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </FormField>

      <FormField
        label="Priority"
        name="priority"
        as="select"
        value={ticket.priority}
        onChange={(event) => onPriorityChange(event.target.value)}
        disabled={busy}
      >
        {PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </FormField>
    </section>
  );
}
