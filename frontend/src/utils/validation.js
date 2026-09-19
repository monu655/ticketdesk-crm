const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors the rules in the backend, so users get instant feedback.
// The backend still validates everything again.
export function validateTicketForm(values) {
  const errors = {};

  if (!values.customer_name.trim()) errors.customer_name = 'Customer name is required';

  if (!values.customer_email.trim()) {
    errors.customer_email = 'Customer email is required';
  } else if (!EMAIL_PATTERN.test(values.customer_email.trim())) {
    errors.customer_email = 'Enter a valid email address';
  }

  if (!values.subject.trim()) errors.subject = 'Issue title is required';
  if (!values.description.trim()) errors.description = 'Issue description is required';

  return errors;
}
