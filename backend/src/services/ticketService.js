import db from '../db/connection.js';
import { formatTicketId } from '../utils/ticketId.js';

const LIST_COLUMNS = `
  ticket_id, customer_name, customer_email, subject, status, priority, created_at, updated_at
`;

// LIKE treats % and _ as wildcards. Escape them so a search for "50%" means the literal text.
function escapeLike(text) {
  return text.replace(/[\\%_]/g, '\\$&');
}

export function listTickets({ status, search }) {
  const conditions = [];
  const params = {};

  if (status) {
    conditions.push('status = @status');
    params.status = status;
  }

  if (search) {
    conditions.push(`(
      customer_name  LIKE @search ESCAPE '\\' OR
      customer_email LIKE @search ESCAPE '\\' OR
      ticket_id      LIKE @search ESCAPE '\\' OR
      subject        LIKE @search ESCAPE '\\' OR
      description    LIKE @search ESCAPE '\\'
    )`);
    params.search = `%${escapeLike(search)}%`;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Only fixed SQL text is built above; every user-supplied value goes through a parameter.
  return db
    .prepare(`SELECT ${LIST_COLUMNS} FROM tickets ${where} ORDER BY created_at DESC, id DESC`)
    .all(params);
}

export function getTicketStats() {
  return db
    .prepare(
      `SELECT
         COUNT(*) AS total,
         COALESCE(SUM(status = 'Open'), 0) AS open,
         COALESCE(SUM(status = 'In Progress'), 0) AS in_progress,
         COALESCE(SUM(status = 'Closed'), 0) AS closed
       FROM tickets`
    )
    .get();
}

export function getTicketById(ticketId) {
  const ticket = db
    .prepare(
      `SELECT ticket_id, customer_name, customer_email, subject, description,
              status, priority, created_at, updated_at
       FROM tickets WHERE ticket_id = ?`
    )
    .get(ticketId);

  if (!ticket) return null;

  const notes = db
    .prepare(
      `SELECT id, note_text, created_at FROM notes
       WHERE ticket_id = ? ORDER BY created_at DESC, id DESC`
    )
    .all(ticketId);

  return { ...ticket, notes };
}

// The next ticket number is read and used inside one immediate transaction, so two
// requests can never receive the same number.
const insertTicket = db.transaction(({ customerName, customerEmail, subject, description, priority }) => {
  const { next } = db.prepare('SELECT COALESCE(MAX(id), 0) + 1 AS next FROM tickets').get();
  const ticketId = formatTicketId(next);
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO tickets
       (id, ticket_id, customer_name, customer_email, subject, description, status, priority, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'Open', ?, ?, ?)`
  ).run(next, ticketId, customerName, customerEmail, subject, description, priority, now, now);

  return { ticket_id: ticketId, created_at: now };
});

export function createTicket(data) {
  return insertTicket.immediate(data);
}

const applyUpdate = db.transaction((ticketId, { status, priority, note }) => {
  const exists = db.prepare('SELECT 1 FROM tickets WHERE ticket_id = ?').get(ticketId);
  if (!exists) return null;

  const now = new Date().toISOString();

  if (status) {
    db.prepare('UPDATE tickets SET status = ? WHERE ticket_id = ?').run(status, ticketId);
  }
  if (priority) {
    db.prepare('UPDATE tickets SET priority = ? WHERE ticket_id = ?').run(priority, ticketId);
  }
  if (note) {
    db.prepare('INSERT INTO notes (ticket_id, note_text, created_at) VALUES (?, ?, ?)').run(ticketId, note, now);
  }

  db.prepare('UPDATE tickets SET updated_at = ? WHERE ticket_id = ?').run(now, ticketId);
  return now;
});

// Returns the new updated_at timestamp, or null when the ticket does not exist.
export function updateTicket(ticketId, changes) {
  return applyUpdate.immediate(ticketId, changes);
}
