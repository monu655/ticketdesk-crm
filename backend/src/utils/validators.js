import AppError from './AppError.js';
import { DEFAULT_PRIORITY, PRIORITIES, STATUSES } from './constants.js';
import { isValidTicketId } from './ticketId.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  customer_name: 100,
  customer_email: 254,
  subject: 150,
  description: 5000,
  note: 2000,
  search: 100,
};

function requiredText(body, field, label, errors) {
  const value = body[field];
  if (typeof value !== 'string' || value.trim() === '') {
    errors[field] = `${label} is required`;
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.length > LIMITS[field]) {
    errors[field] = `${label} must be ${LIMITS[field]} characters or fewer`;
    return undefined;
  }
  return trimmed;
}

function throwIfInvalid(errors) {
  if (Object.keys(errors).length > 0) {
    throw new AppError(400, 'Please correct the highlighted fields', errors);
  }
}

export function validateTicketId(value) {
  const ticketId = String(value).toUpperCase();
  if (!isValidTicketId(ticketId)) {
    throw new AppError(400, 'Invalid ticket ID');
  }
  return ticketId;
}

export function validateCreateTicket(body = {}) {
  const errors = {};

  const customerName = requiredText(body, 'customer_name', 'Customer name', errors);
  const customerEmail = requiredText(body, 'customer_email', 'Customer email', errors);
  const subject = requiredText(body, 'subject', 'Subject', errors);
  const description = requiredText(body, 'description', 'Description', errors);

  if (customerEmail && !EMAIL_PATTERN.test(customerEmail)) {
    errors.customer_email = 'Enter a valid email address';
  }

  let priority = DEFAULT_PRIORITY;
  if (body.priority !== undefined) {
    if (!PRIORITIES.includes(body.priority)) {
      errors.priority = `Priority must be one of: ${PRIORITIES.join(', ')}`;
    } else {
      priority = body.priority;
    }
  }

  throwIfInvalid(errors);
  return { customerName, customerEmail, subject, description, priority };
}

export function validateListQuery(query = {}) {
  const { status, search } = query;

  if (status !== undefined && !STATUSES.includes(status)) {
    throw new AppError(400, `Status must be one of: ${STATUSES.join(', ')}`);
  }
  if (search !== undefined && (typeof search !== 'string' || search.length > LIMITS.search)) {
    throw new AppError(400, `Search must be text of ${LIMITS.search} characters or fewer`);
  }

  return { status, search: search ? search.trim() : '' };
}

export function validateUpdateTicket(body = {}) {
  const errors = {};
  const changes = {};

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) {
      errors.status = `Status must be one of: ${STATUSES.join(', ')}`;
    } else {
      changes.status = body.status;
    }
  }

  if (body.priority !== undefined) {
    if (!PRIORITIES.includes(body.priority)) {
      errors.priority = `Priority must be one of: ${PRIORITIES.join(', ')}`;
    } else {
      changes.priority = body.priority;
    }
  }

  if (body.notes !== undefined) {
    if (typeof body.notes !== 'string' || body.notes.trim() === '') {
      errors.notes = 'Note cannot be empty';
    } else if (body.notes.trim().length > LIMITS.note) {
      errors.notes = `Note must be ${LIMITS.note} characters or fewer`;
    } else {
      changes.note = body.notes.trim();
    }
  }

  throwIfInvalid(errors);

  if (Object.keys(changes).length === 0) {
    throw new AppError(400, 'Provide a status, priority or note to update');
  }
  return changes;
}
