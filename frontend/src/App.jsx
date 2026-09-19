import { Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import CreateTicketPage from './pages/CreateTicketPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import TicketDetailsPage from './pages/TicketDetailsPage.jsx';
import TicketsPage from './pages/TicketsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<TicketsPage />} />
        <Route path="tickets/new" element={<CreateTicketPage />} />
        <Route path="tickets/:ticketId" element={<TicketDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
