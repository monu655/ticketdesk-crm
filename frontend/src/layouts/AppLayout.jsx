import { Link, Outlet, useLocation } from 'react-router-dom';
import { LifebuoyIcon } from '../components/icons.jsx';

// On mobile the links are full-width tabs under the logo; from "sm" up they are pills on the right.
function NavItem({ to, active, children }) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`flex-1 whitespace-nowrap border-b-2 py-3 text-center text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:flex-none sm:rounded-md sm:border-b-0 sm:px-3 sm:py-1.5 ${
        active
          ? 'border-indigo-400 text-white sm:bg-white/10'
          : 'border-transparent text-slate-300 hover:text-white sm:hover:bg-white/5'
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
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between px-4 sm:min-h-16 sm:gap-x-6 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-white">
              <LifebuoyIcon className="h-5 w-5" />
            </span>
            <span className="text-base font-semibold tracking-tight text-white">TicketDesk CRM</span>
          </Link>
          <nav
            aria-label="Main"
            className="-mx-4 flex w-[calc(100%+2rem)] border-t border-white/10 sm:mx-0 sm:w-auto sm:items-center sm:gap-1 sm:border-t-0"
          >
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