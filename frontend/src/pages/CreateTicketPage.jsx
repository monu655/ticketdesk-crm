import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import TicketForm from '../components/TicketForm.jsx';
import useToast from '../hooks/useToast.js';
import { createTicket } from '../services/api.js';

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(values) {
    setSubmitting(true);
    try {
      const { ticket_id: ticketId } = await createTicket({
        ...values,
        customer_name: values.customer_name.trim(),
        customer_email: values.customer_email.trim(),
        subject: values.subject.trim(),
        description: values.description.trim(),
      });
      showToast(`Ticket ${ticketId} created successfully.`);
      navigate(`/tickets/${ticketId}`);
    } catch (error) {
      setSubmitting(false);
      if (error.fieldErrors) return error.fieldErrors;
      showToast(error.message, 'error');
    }
    return undefined;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Create Ticket"
        description="Log a new customer issue. The ticket starts as Open and can be updated at any time."
      />
      <TicketForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
