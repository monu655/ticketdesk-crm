import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_PRIORITY, PRIORITIES } from '../utils/constants.js';
import { buttonClasses } from '../utils/buttonStyles.js';
import { validateTicketForm } from '../utils/validation.js';
import Button from './Button.jsx';
import FormField from './FormField.jsx';

const EMPTY_FORM = {
  customer_name: '',
  customer_email: '',
  subject: '',
  priority: DEFAULT_PRIORITY,
  description: '',
};

// `onSubmit(values)` may return a { field: message } object with errors reported by the server.
export default function TicketForm({ onSubmit, submitting }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const clientErrors = validateTicketForm(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    const serverErrors = await onSubmit(values);
    if (serverErrors) setErrors(serverErrors);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-lg border border-slate-200 bg-white">
      <div className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Customer Name"
            name="customer_name"
            value={values.customer_name}
            onChange={handleChange}
            error={errors.customer_name}
            placeholder="e.g. Meera Kapoor"
            autoComplete="off"
            maxLength={100}
          />
          <FormField
            label="Customer Email"
            name="customer_email"
            type="email"
            value={values.customer_email}
            onChange={handleChange}
            error={errors.customer_email}
            placeholder="name@company.com"
            autoComplete="off"
            maxLength={254}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <FormField
            label="Issue Title"
            name="subject"
            value={values.subject}
            onChange={handleChange}
            error={errors.subject}
            placeholder="Short summary of the problem"
            maxLength={150}
            className="sm:col-span-2"
          />
          <FormField
            label="Priority"
            name="priority"
            as="select"
            value={values.priority}
            onChange={handleChange}
            error={errors.priority}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </FormField>
        </div>

        <FormField
          label="Issue Description"
          name="description"
          as="textarea"
          rows={6}
          value={values.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="What is the customer experiencing? Include order numbers, error messages and steps already tried."
          maxLength={5000}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <Link to="/" className={buttonClasses('secondary')}>
          Cancel
        </Link>
        <Button type="submit" loading={submitting} loadingLabel="Creating...">
          Create Ticket
        </Button>
      </div>
    </form>
  );
}
