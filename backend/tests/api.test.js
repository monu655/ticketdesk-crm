import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';

// The test database lives in a temp folder and never touches the real data file.
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ticketdesk-test-'));
process.env.DATABASE_PATH = path.join(tempDir, 'test.db');
process.env.FRONTEND_URL = 'http://localhost:5173';

const { default: app } = await import('../src/app.js');
const { seedIfEmpty } = await import('../src/db/seed.js');

let server;
let baseUrl;

async function api(pathname, { method = 'GET', body, headers } = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers: { ...(body && { 'Content-Type': 'application/json' }), ...headers },
    body: body && JSON.stringify(body),
  });
  return { status: response.status, body: await response.json(), headers: response.headers };
}

const validTicket = {
  customer_name: 'Meera Kapoor',
  customer_email: 'meera.kapoor@example.com',
  subject: 'Cannot download invoice',
  description: 'The download invoice button does nothing on my order page.',
};

before(async () => {
  seedIfEmpty();
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => {
  server.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('POST /api/tickets', () => {
  it('creates a ticket with an auto-generated ID and defaults to Open', async () => {
    const created = await api('/api/tickets', { method: 'POST', body: validTicket });
    assert.equal(created.status, 201);
    assert.equal(created.body.ticket_id, 'TKT-013'); // 12 seeded tickets
    assert.ok(created.body.created_at);

    const fetched = await api(`/api/tickets/${created.body.ticket_id}`);
    assert.equal(fetched.body.status, 'Open');
    assert.equal(fetched.body.priority, 'Medium');
    assert.deepEqual(fetched.body.notes, []);
  });

  it('rejects missing fields and an invalid email with field errors', async () => {
    const result = await api('/api/tickets', {
      method: 'POST',
      body: { customer_name: ' ', customer_email: 'not-an-email', subject: '' },
    });
    assert.equal(result.status, 400);
    assert.equal(result.body.success, false);
    assert.ok(result.body.errors.customer_name);
    assert.ok(result.body.errors.customer_email);
    assert.ok(result.body.errors.subject);
    assert.ok(result.body.errors.description);
  });

  it('rejects malformed JSON with a 400', async () => {
    const response = await fetch(`${baseUrl}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ broken',
    });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).success, false);
  });
});

describe('GET /api/tickets', () => {
  it('lists tickets with the fields the table needs', async () => {
    const { status, body } = await api('/api/tickets');
    assert.equal(status, 200);
    assert.ok(body.length >= 12);
    for (const field of ['ticket_id', 'customer_name', 'subject', 'status', 'created_at']) {
      assert.ok(field in body[0], `missing ${field}`);
    }
  });

  it('filters by status', async () => {
    const { body } = await api('/api/tickets?status=In%20Progress');
    assert.ok(body.length > 0);
    assert.ok(body.every((ticket) => ticket.status === 'In Progress'));
  });

  it('searches name, email, ticket ID, subject and description', async () => {
    const byName = await api('/api/tickets?search=rahul');
    assert.deepEqual(byName.body.map((t) => t.ticket_id), ['TKT-006']);

    const byEmail = await api('/api/tickets?search=priya.mehta@');
    assert.deepEqual(byEmail.body.map((t) => t.ticket_id), ['TKT-007']);

    const byId = await api('/api/tickets?search=tkt-008');
    assert.deepEqual(byId.body.map((t) => t.ticket_id), ['TKT-008']);

    const bySubject = await api('/api/tickets?search=coupon');
    assert.deepEqual(bySubject.body.map((t) => t.ticket_id), ['TKT-003']);

    const byDescription = await api('/api/tickets?search=crushed'); // only appears in a description
    assert.deepEqual(byDescription.body.map((t) => t.ticket_id), ['TKT-011']);
  });

  it('combines status and search', async () => {
    const match = await api('/api/tickets?status=Open&search=payment');
    assert.deepEqual(match.body.map((t) => t.ticket_id), ['TKT-006']);

    const noMatch = await api('/api/tickets?status=Closed&search=payment');
    assert.deepEqual(noMatch.body, []);
  });

  it('treats % and _ in search literally', async () => {
    const { body } = await api('/api/tickets?search=%25');
    assert.deepEqual(body, []);
  });

  it('rejects an unknown status', async () => {
    const { status, body } = await api('/api/tickets?status=Pending');
    assert.equal(status, 400);
    assert.equal(body.success, false);
  });
});

describe('GET /api/tickets/stats', () => {
  it('returns counts that match the data', async () => {
    const stats = await api('/api/tickets/stats');
    const all = await api('/api/tickets');
    const countOf = (status) => all.body.filter((t) => t.status === status).length;

    assert.equal(stats.body.total, all.body.length);
    assert.equal(stats.body.open, countOf('Open'));
    assert.equal(stats.body.in_progress, countOf('In Progress'));
    assert.equal(stats.body.closed, countOf('Closed'));
  });
});

describe('GET /api/tickets/:ticket_id', () => {
  it('returns the ticket with its notes, newest first', async () => {
    const { status, body } = await api('/api/tickets/TKT-001');
    assert.equal(status, 200);
    assert.equal(body.customer_name, 'Sneha Iyer');
    assert.equal(body.notes.length, 2);
    assert.ok(body.notes[0].created_at > body.notes[1].created_at);
  });

  it('returns 404 for a ticket that does not exist', async () => {
    const { status, body } = await api('/api/tickets/TKT-999');
    assert.equal(status, 404);
    assert.deepEqual(body, { success: false, message: 'Ticket not found' });
  });

  it('returns 400 for a malformed ticket ID', async () => {
    const { status } = await api('/api/tickets/abc');
    assert.equal(status, 400);
  });
});

describe('PUT /api/tickets/:ticket_id', () => {
  it('updates the status and stores a note', async () => {
    const before = (await api('/api/tickets/TKT-007')).body;

    const result = await api('/api/tickets/TKT-007', {
      method: 'PUT',
      body: { status: 'In Progress', notes: 'Order found in the payment gateway logs.' },
    });
    assert.equal(result.status, 200);
    assert.equal(result.body.success, true);
    assert.ok(result.body.updated_at > before.updated_at);

    const after = (await api('/api/tickets/TKT-007')).body;
    assert.equal(after.status, 'In Progress');
    assert.equal(after.updated_at, result.body.updated_at);
    assert.equal(after.notes[0].note_text, 'Order found in the payment gateway logs.');
  });

  it('rejects an invalid status, an empty note and an empty body', async () => {
    const badStatus = await api('/api/tickets/TKT-007', { method: 'PUT', body: { status: 'Done' } });
    assert.equal(badStatus.status, 400);

    const emptyNote = await api('/api/tickets/TKT-007', { method: 'PUT', body: { notes: '   ' } });
    assert.equal(emptyNote.status, 400);

    const nothing = await api('/api/tickets/TKT-007', { method: 'PUT', body: {} });
    assert.equal(nothing.status, 400);
  });

  it('returns 404 when updating a ticket that does not exist', async () => {
    const { status } = await api('/api/tickets/TKT-999', { method: 'PUT', body: { status: 'Closed' } });
    assert.equal(status, 404);
  });
});

describe('platform behaviour', () => {
  it('returns JSON 404 for unknown routes', async () => {
    const { status, body } = await api('/api/unknown');
    assert.equal(status, 404);
    assert.equal(body.success, false);
  });

  it('only allows the configured frontend origin through CORS', async () => {
    const allowed = await api('/api/health', { headers: { Origin: 'http://localhost:5173' } });
    assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5173');

    const blocked = await api('/api/health', { headers: { Origin: 'https://evil.example.com' } });
    assert.equal(blocked.headers.get('access-control-allow-origin'), null);
  });
});
