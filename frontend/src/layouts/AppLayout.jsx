import { Link, Outlet, useLocation } from 'react-router-dom';
import { LifebuoyIcon } from '../components/icons.jsx';

function NavItem({ to, active, children }) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
        active ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

export default function AppLayout() {
  const { pathname } = useLocation();
  const onCreatePage = pathname === '/tickets/new';
  const onTicketsSection = pathname === '/' || (pathname.startsWith('/tickets/') && !onCreatePage);

  return (
    <div className="min-h-screen">
      <header className="bg-slate-900">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-white">
              <LifebuoyIcon className="h-5 w-5" />
            </span>
            <span className="text-base font-semibold tracking-tight text-white">TicketDesk CRM</span>
          </Link>
          <nav aria-label="Main" className="flex items-center gap-1">
            <NavItem to="/" active={onTicketsSection}>
              Tickets
            </NavItem>
            <NavItem to="/tickets/new" active={onCreatePage}>
              Create Ticket
            </NavItem>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}
