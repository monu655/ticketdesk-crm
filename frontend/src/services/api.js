// The only place in the app that talks to the backend.
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const GENERIC_ERROR = 'Something went wrong. Please try again.';
const NETWORK_ERROR = 'Unable to reach the server. Please check your connection and try again.';

export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors } = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError(NETWORK_ERROR);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Validation and not-found messages are written for users. Server faults are not shown as-is.
    const isClientError = response.status >= 400 && response.status < 500;
    throw new ApiError(isClientError && data?.message ? data.message : GENERIC_ERROR, {
      status: response.status,
      fieldErrors: data?.errors,
    });
  }

  return data;
}

export function getTickets({ status, search } = {}, signal) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  const query = params.toString();
  return request(`/api/tickets${query ? `?${query}` : ''}`, { signal });
}

export function getTicketStats(signal) {
  return request('/api/tickets/stats', { signal });
}

export function getTicket(ticketId, signal) {
  return request(`/api/tickets/${encodeURIComponent(ticketId)}`, { signal });
}

export function createTicket(ticket) {
  return request('/api/tickets', { method: 'POST', body: ticket });
}

// changes can contain: status, priority, notes (a new note to add)
export function updateTicket(ticketId, changes) {
  return request(`/api/tickets/${encodeURIComponent(ticketId)}`, { method: 'PUT', body: changes });
}
