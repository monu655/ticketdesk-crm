# TicketDesk CRM

A customer support ticket management tool for support agents. Agents can log tickets, search and filter them, update their status and keep internal notes, all backed by a real REST API and a SQLite database.

Built as the Datastraw Technologies hiring assignment.

- **Live app:** _add your Vercel URL here_
- **API:** _add your Render URL here_ (`/api/health` should return `{"status":"ok"}`)
- **Demo video:** _add your video link here_

## Problem statement

A support team needs one place to record customer issues, find them again quickly, see what is still open, and leave notes for teammates. Email threads and spreadsheets make this slow and easy to lose track of. TicketDesk CRM keeps every ticket, its status and its internal notes in one searchable workspace.

## Features

- Create tickets with customer name, email, title, description and priority. IDs (`TKT-001`, `TKT-002`, ...) and timestamps are generated automatically.
- Ticket list with ID, customer, subject, status, priority and created date.
- Search across customer name, email, ticket ID, subject and description. Search runs on the backend while you type (debounced).
- Filter by status (All, Open, In Progress, Closed). Search and filter work together.
- Ticket details page with customer info, created and last-updated times.
- Change status from a dropdown and add internal notes. Changes are saved to the database immediately, no page reload.
- Dashboard counts (total, open, in progress, closed) calculated from the database.
- Loading skeletons, empty states, friendly error messages, form validation and loading buttons.
- Responsive layout: the ticket table becomes a card list on mobile.

**Bonus feature:** ticket priority. See [Bonus feature](#bonus-feature-ticket-priority).

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, JavaScript, Tailwind CSS 4, React Router |
| Backend | Node.js 22, Express 5 |
| Database | SQLite (via `better-sqlite3`) |
| API | REST, JSON |
| Hosting | Vercel (frontend), Render (backend) |

## Architecture

```
Browser (React SPA on Vercel)
   |  fetch() through services/api.js
   v
Express API (Render)
   routes -> controllers -> services -> SQLite
              (validation)   (SQL)
```

- **Routes** map a URL and HTTP method to a controller function.
- **Controllers** read the request, validate the input, call a service, and send the response.
- **Services** contain all SQL. Every query uses parameters (`?` or `@name`), never string concatenation of user input.
- **Middleware** handles unknown routes (404) and turns every error into a clean JSON response.
- The frontend never calls `fetch` directly from components. Everything goes through `src/services/api.js`.

## Database schema

Two tables, as required by the assignment.

```sql
CREATE TABLE tickets (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id      TEXT NOT NULL UNIQUE,              -- TKT-001, TKT-002, ...
  customer_name  TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  subject        TEXT NOT NULL,
  description    TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'Open'   CHECK (status IN ('Open', 'In Progress', 'Closed')),
  priority       TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')), -- bonus
  created_at     TEXT NOT NULL,                     -- ISO 8601, UTC
  updated_at     TEXT NOT NULL
);

CREATE TABLE notes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id  TEXT NOT NULL REFERENCES tickets(ticket_id) ON DELETE CASCADE,
  note_text  TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

One ticket has many notes. `notes.ticket_id` is a foreign key to `tickets.ticket_id`, and foreign keys are enforced (`PRAGMA foreign_keys = ON` in `db/connection.js`). The schema is created automatically on startup.

## API endpoints

Base path: `/api`. All responses are JSON.

### `POST /api/tickets`

```json
{ "customer_name": "Meera Kapoor", "customer_email": "meera.kapoor@example.com",
  "subject": "Cannot download invoice", "description": "The button does nothing.",
  "priority": "High" }
```

`priority` is optional (defaults to `Medium`). Returns `201`:

```json
{ "ticket_id": "TKT-013", "created_at": "2026-09-19T08:30:12.114Z" }
```

### `GET /api/tickets`

Optional query parameters: `status` (`Open`, `In Progress`, `Closed`) and `search`. They can be combined:
`GET /api/tickets?status=Open&search=payment`

```json
[{ "ticket_id": "TKT-006", "customer_name": "Rahul Sharma", "customer_email": "rahul.sharma@example.com",
   "subject": "Payment failed during checkout", "status": "Open", "priority": "High",
   "created_at": "2026-09-14T06:13:00.000Z", "updated_at": "2026-09-14T07:13:00.000Z" }]
```

Newest tickets come first.

### `GET /api/tickets/:ticket_id`

```json
{ "ticket_id": "TKT-006", "customer_name": "Rahul Sharma", "customer_email": "rahul.sharma@example.com",
  "subject": "Payment failed during checkout", "description": "...", "status": "Open", "priority": "High",
  "created_at": "...", "updated_at": "...",
  "notes": [{ "id": 6, "note_text": "Customer contacted support...", "created_at": "..." }] }
```

Notes are returned newest first.

### `PUT /api/tickets/:ticket_id`

Send any of `status`, `priority` and `notes`. At least one is required. `notes` is a new note to add (it does not replace old notes).

```json
{ "status": "In Progress", "notes": "Checked the gateway logs." }
```

Returns `{ "success": true, "updated_at": "2026-09-19T08:35:40.002Z" }`. Adding a note or changing status also updates the ticket's `updated_at`.

### Extra endpoints (not in the assignment's four)

- `GET /api/tickets/stats` returns `{ total, open, in_progress, closed }` for the dashboard cards.
- `GET /api/health` returns `{ "status": "ok" }` and is used by Render's health check.

### Errors

Every error uses the same shape:

```json
{ "success": false, "message": "Ticket not found" }
```

| Status | When |
| --- | --- |
| 400 | Invalid or missing input, unknown status, malformed ticket ID, invalid JSON. Validation errors also include `"errors": { "customer_email": "Enter a valid email address" }` |
| 404 | Ticket does not exist, or the route does not exist |
| 413 | Request body larger than 100 KB |
| 500 | Unexpected server or database error (the message is generic, details go to the server log only) |

## Folder structure

```
ticketdesk-crm/
├── backend/
│   ├── src/
│   │   ├── config/env.js            # reads environment variables
│   │   ├── controllers/             # request in, response out
│   │   ├── db/                      # connection, schema, seed data
│   │   ├── middleware/              # notFound, errorHandler
│   │   ├── routes/                  # URL to controller mapping
│   │   ├── services/                # all SQL lives here
│   │   ├── utils/                   # AppError, validators, ticket ID helper
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # starts the server
│   ├── tests/api.test.js            # API tests (Node's built-in test runner)
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/              # reusable UI pieces
│   │   ├── hooks/                   # useFetch, useDebounce, useToast
│   │   ├── layouts/AppLayout.jsx    # header + navigation
│   │   ├── pages/                   # TicketsPage, CreateTicketPage, TicketDetailsPage
│   │   ├── services/api.js          # the only place that calls the backend
│   │   ├── utils/                   # formatting, validation, constants
│   │   ├── App.jsx                  # routes
│   │   └── main.jsx
│   ├── vercel.json                  # single-page-app rewrite
│   └── .env.example
├── render.yaml                      # optional Render blueprint for the backend
├── README.md
├── DEMO_GUIDE.md
└── INTERVIEW_NOTES.md
```

## Local setup

Requires **Node.js 22 or newer**.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev               # http://localhost:4000
```

The database file is created automatically on first start. `SEED_ON_EMPTY=true` (set in `.env.example`) loads 12 sample tickets when the database is empty. You can also run `npm run seed` manually. It only inserts data into an empty database.

To reset the database, stop the server, delete `backend/data/ticketdesk.db`, and start it again.

Run the API tests:

```bash
npm test
```

They use a temporary database and never touch your real data.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # leave VITE_API_URL empty for local development
npm run dev               # http://localhost:5173
```

In development, Vite forwards `/api` requests to `http://localhost:4000`, so no API URL is needed.

Production build check: `npm run build` then `npm run preview`.

## Environment variables

**Backend (`backend/.env`)**

| Variable | Purpose | Example |
| --- | --- | --- |
| `PORT` | Port the API listens on (Render sets it automatically) | `4000` |
| `DATABASE_PATH` | Location of the SQLite file | `./data/ticketdesk.db` |
| `FRONTEND_URL` | Origin(s) allowed by CORS, comma-separated, no trailing slash. **Required in production.** | `https://ticketdesk-crm.vercel.app` |
| `SEED_ON_EMPTY` | `true` loads sample tickets when the database is empty | `true` |
| `NODE_ENV` | Set to `production` on Render | `production` |

**Frontend (`frontend/.env`)**

| Variable | Purpose | Example |
| --- | --- | --- |
| `VITE_API_URL` | Backend base URL, no trailing slash. Empty in local development. | `https://ticketdesk-api.onrender.com` |

`.env` files are git-ignored. Only the `.env.example` files are committed. `VITE_` variables are baked into the frontend at build time, so redeploy the frontend after changing it.

## Deployment

Deploy the backend first, because the frontend needs its URL.

### Backend on Render

1. Push the repository to GitHub.
2. In Render choose **New > Web Service** and connect the repository (or use **New > Blueprint** to read `render.yaml`).
3. Settings: **Root Directory** `backend`, **Build Command** `npm install`, **Start Command** `npm start`, **Health Check Path** `/api/health`.
4. Environment variables: `NODE_ENV=production`, `NODE_VERSION=22`, `SEED_ON_EMPTY=true`, `DATABASE_PATH=./data/ticketdesk.db`, and `FRONTEND_URL` (you can fill this in after step 2 below and redeploy).
5. Open `https://<your-service>.onrender.com/api/health` and confirm it returns `{"status":"ok"}`.

### Frontend on Vercel

1. In Vercel choose **Add New > Project** and import the same repository.
2. Set **Root Directory** to `frontend`. Vercel detects Vite automatically (build `npm run build`, output `dist`).
3. Add the environment variable `VITE_API_URL` = your Render URL (no trailing slash), then deploy.
4. Copy the Vercel URL, set it as `FRONTEND_URL` on Render, and redeploy the backend so CORS allows it.

`frontend/vercel.json` makes page refreshes work on routes like `/tickets/TKT-001`.

### Important: SQLite storage on Render

Render's free web services use a **temporary disk**. Tickets created on the live site are lost when the service restarts, redeploys, or wakes up after sleeping. This project handles it in two ways:

- `SEED_ON_EMPTY=true` reloads the sample tickets after any reset, so the app is never empty for reviewers.
- For permanent storage, attach a **persistent disk** to the Render service (needs a paid instance type), mount it at `/var/data`, and set `DATABASE_PATH=/var/data/ticketdesk.db`. No code changes are needed.

Free services also sleep after a period of inactivity, so the first request can take up to a minute. Open the site once before a demo or before sending the link.

## Bonus feature: ticket priority

**What:** every ticket has a priority (Low, Medium, High). It is set when creating a ticket, shown in the ticket list and details page, and can be changed on the details page.

**Why:** when a team handles many tickets, status alone does not tell an agent what to pick up first. Priority is the smallest change that gives that answer.

**Tradeoff:** the assignment's `tickets` table lists specific columns, and priority needs one more: `priority TEXT NOT NULL DEFAULT 'Medium'` with a `CHECK` constraint. I did not add a third table. `PUT /api/tickets/:ticket_id` also accepts an optional `priority` field. Because there is no migration tool, an older database file created before this column existed must be deleted and recreated (see Local setup).

## Challenges solved

- **Unique ticket IDs.** The next number is read and inserted inside one immediate SQLite transaction, so two requests can never get the same ID.
- **Search that behaves.** `%` and `_` are escaped so they are searched literally instead of acting as SQL wildcards. Search is case-insensitive for English text.
- **Fast typing.** The search box is debounced (350 ms), and older requests are cancelled with `AbortController`, so a slow response can never overwrite a newer one.
- **CORS between Vercel and Render.** The backend only accepts the origin listed in `FRONTEND_URL` and refuses to start in production without it.
- **Page refresh on Vercel.** A rewrite rule serves `index.html` for every path, so `/tickets/TKT-001` works when reloaded.
- **Safe errors.** Users see friendly messages. Server errors are logged on the server and never sent to the browser.

## Future improvements

- Agent login and roles, plus assigning tickets to agents.
- Pagination or infinite scroll for large ticket volumes.
- A status-history table for a full activity timeline (needs a third table).
- Filter and sort by priority.
- Move from SQLite to PostgreSQL for multi-instance hosting and built-in persistence.
- Full-text search (SQLite FTS5) for faster, ranked search on large datasets.
- Frontend tests and CI checks on every pull request.

## Demo credentials

None. Authentication is intentionally skipped for this MVP, as allowed by the assignment.

## Screenshots

| Dashboard | Ticket details |
| --- | --- |
| _add screenshot_ | _add screenshot_ |

| Create ticket | Mobile view |
| --- | --- |
| _add screenshot_ | _add screenshot_ |
