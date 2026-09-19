import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { PlusIcon } from '../components/icons.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import StatsCards from '../components/StatsCards.jsx';
import StatusFilter, { ALL_STATUSES } from '../components/StatusFilter.jsx';
import TableSkeleton from '../components/TableSkeleton.jsx';
import TicketTable from '../components/TicketTable.jsx';
import useDebounce from '../hooks/useDebounce.js';
import useFetch from '../hooks/useFetch.js';
import { getTicketStats, getTickets } from '../services/api.js';
import { buttonClasses } from '../utils/buttonStyles.js';

export default function TicketsPage() {
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState(ALL_STATUSES);

  // The API is only called once the user pauses typing.
  const search = useDebounce(searchText.trim());
  const isFiltering = search !== '' || status !== ALL_STATUSES;

  const tickets = useFetch(
    (signal) => getTickets({ status: status === ALL_STATUSES ? '' : status, search }, signal),
    [status, search]
  );
  const stats = useFetch(getTicketStats, []);

  const showSkeleton = tickets.loading && !tickets.data;
  const isRefreshing = tickets.loading && Boolean(tickets.data);

  function renderResults() {
    if (tickets.error) {
      return <ErrorState message="Unable to load tickets. Please try again." onRetry={tickets.reload} />;
    }
    if (showSkeleton) return <TableSkeleton />;

    if (tickets.data.length === 0) {
      return isFiltering ? (
        <EmptyState
          title="No tickets match your search."
          description="Try a different keyword or change the status filter."
        />
      ) : (
        <EmptyState
          title="No support tickets found"
          description="New tickets will appear here as soon as they are created."
          action={
            <Link to="/tickets/new" className={buttonClasses()}>
              Create Ticket
            </Link>
          }
        />
      );
    }

    return (
      <div className={isRefreshing ? 'opacity-60 transition-opacity' : 'transition-opacity'} aria-busy={isRefreshing}>
        <p className="border-b border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-500">
          {tickets.data.length} {tickets.data.length === 1 ? 'ticket' : 'tickets'}
        </p>
        <TicketTable tickets={tickets.data} />
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Tickets" description="Review, search and update customer support requests.">
        <Link to="/tickets/new" className={buttonClasses()}>
          <PlusIcon />
          New Ticket
        </Link>
      </PageHeader>

      <StatsCards stats={stats.data} loading={stats.loading} />

      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col gap-3 bg-slate-50 p-4 md:flex-row md:items-center">
          <SearchBar value={searchText} onChange={setSearchText} />
          <StatusFilter value={status} onChange={setStatus} />
        </div>
        <div className="border-t border-slate-200">{renderResults()}</div>
      </section>
    </>
  );
}
