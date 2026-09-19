import * as ticketService from '../services/ticketService.js';
import AppError from '../utils/AppError.js';
import {
  validateCreateTicket,
  validateListQuery,
  validateTicketId,
  validateUpdateTicket,
} from '../utils/validators.js';

export function getTickets(req, res) {
  const filters = validateListQuery(req.query);
  res.json(ticketService.listTickets(filters));
}

export function getStats(req, res) {
  res.json(ticketService.getTicketStats());
}

export function getTicket(req, res) {
  const ticketId = validateTicketId(req.params.ticket_id);
  const ticket = ticketService.getTicketById(ticketId);

  if (!ticket) throw new AppError(404, 'Ticket not found');
  res.json(ticket);
}

export function createTicket(req, res) {
  const data = validateCreateTicket(req.body);
  res.status(201).json(ticketService.createTicket(data));
}

export function updateTicket(req, res) {
  const ticketId = validateTicketId(req.params.ticket_id);
  const changes = validateUpdateTicket(req.body);
  const updatedAt = ticketService.updateTicket(ticketId, changes);

  if (!updatedAt) throw new AppError(404, 'Ticket not found');
  res.json({ success: true, updated_at: updatedAt });
}
