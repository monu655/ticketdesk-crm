const SCHEMA = `
  CREATE TABLE IF NOT EXISTS tickets (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id      TEXT NOT NULL UNIQUE,
    customer_name  TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    subject        TEXT NOT NULL,
    description    TEXT NOT NULL,
    status         TEXT NOT NULL DEFAULT 'Open'
                   CHECK (status IN ('Open', 'In Progress', 'Closed')),
    priority       TEXT NOT NULL DEFAULT 'Medium'
                   CHECK (priority IN ('Low', 'Medium', 'High')),
    created_at     TEXT NOT NULL,
    updated_at     TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id  TEXT NOT NULL REFERENCES tickets(ticket_id) ON DELETE CASCADE,
    note_text  TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
  CREATE INDEX IF NOT EXISTS idx_notes_ticket_id ON notes(ticket_id);
`;

export function initializeSchema(db) {
  db.exec(SCHEMA);
}
