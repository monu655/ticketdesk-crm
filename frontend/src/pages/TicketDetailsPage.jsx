import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { ArrowLeftIcon } from '../components/icons.jsx';
import NotesPanel from '../components/NotesPanel.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import TicketDetailsSkeleton from '../components/TicketDetailsSkeleton.jsx';
import TicketSummary from '../components/TicketSummary.jsx';
import useFetch from '../hooks/useFetch.js';
import useToast from '../hooks/useToast.js';
import { getTicket, updateTicket } from '../services/api.js';
import { buttonClasses } from '../utils/buttonStyles.js';

function BackLink() {
  return (
    <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
      <ArrowLeftIcon />
      All tickets
    </Link>
  );
}

export default function TicketDetailsPage() {
  const { ticketId } = useParams();
  const { showToast } = useToast();
  const { data: ticket, error, reload, setData: setTicket } = useFetch(
    (signal) => getTicket(ticketId, signal),
    [ticketId]
  );

  // Which kind of change is being saved right now: 'status', 'priority', 'note' or null.
  const [pending, setPending] = useState(null);

  // Saves the change, then reloads the ticket so the page always shows what is in the database.
  async function saveChanges(kind, changes, successMessage) {
    setPending(kind);
    try {
      await updateTicket(ticketId, changes);
      setTicket(await getTicket(ticketId));
      showToast(successMessage);
      return true;
    } catch (saveError) {
      showToast(saveError.message, 'error');
      return false;
    } finally {
      setPending(null);
    }
  }

  if (error?.status === 404 || error?.status === 400) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white">
        <EmptyState
          title="Ticket not found"
          description="Check the ticket ID, or go back to the list to find the ticket you need."
          action={
            <Link to="/" className={buttonClasses('secondary')}>
              Back to tickets
            </Link>
          }
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white">
        <ErrorState message="Unable to load this ticket. Please try again." onRetry={reload} />
      </div>
    );
  }

  if (!ticket) return <TicketDetailsSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <BackLink />
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">{ticket.subject}</h1>
          <div className="flex items-center gap-3">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
      </div>

      <TicketSummary
        ticket={ticket}
        busy={pending !== null}
        onStatusChange={(status) => saveChanges('status', { status }, `Status updated to ${status}.`)}
        onPriorityChange={(priority) => saveChanges('priority', { priority }, `Priority changed to ${priority}.`)}
      />

      <div className="grid items-start gap-6 lg:grid-cols-5">
        <section className="rounded-lg border border-slate-200 bg-white lg:col-span-3">
          <h2 className="border-b border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900">Issue</h2>
          <div className="space-y-4 p-5">
            <div>
              <h3 className="text-sm font-medium text-slate-700">Subject</h3>
              <p className="mt-1 text-sm text-slate-900">{ticket.subject}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-700">Description</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-800">{ticket.description}</p>
            </div>
          </div>
        </section>

        <div className="lg:col-span-2">
          <NotesPanel
            notes={ticket.notes}
            saving={pending === 'note'}
            onAddNote={(text) => saveChanges('note', { notes: text }, 'Note added.')}
          />
        </div>
      </div>
    </div>
  );
}
