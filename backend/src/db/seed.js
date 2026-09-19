import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from './connection.js';
import { formatTicketId } from '../utils/ticketId.js';

// Times are relative to "now" so the demo data always looks recent.
const HOUR = 60 * 60 * 1000;
const ago = (hours) => new Date(Date.now() - hours * HOUR).toISOString();
const after = (isoTime, hours) => new Date(new Date(isoTime).getTime() + hours * HOUR).toISOString();

// Ordered oldest to newest, so ticket numbers follow creation order.
const SAMPLE_TICKETS = [
  {
    customer_name: 'Sneha Iyer',
    customer_email: 'sneha.iyer@example.com',
    subject: 'Refund not credited after order cancellation',
    description:
      'I cancelled order #48213 on 4 September and was told the refund of ₹2,150 would reach my account within 5 to 7 working days. It has been 12 days and nothing has been credited. Please check the status of the refund.',
    status: 'In Progress',
    priority: 'High',
    hoursAgo: 300,
    notes: [
      { hoursAfter: 4, text: 'Confirmed the cancellation went through. Refund was initiated on our side on 5 Sep. Raised a trace request with the payment partner.' },
      { hoursAfter: 52, text: 'Payment partner replied that the refund reference is still pending at the issuing bank. Asked the customer to check with the bank using the reference number.' },
    ],
  },
  {
    customer_name: 'Vikram Singh',
    customer_email: 'vikram.singh@example.com',
    subject: 'Received wrong size in my order',
    description:
      'I ordered a pair of running shoes in size 9 but the box contains size 8. The size on the label of the box also says 8. I would like an exchange for the correct size.',
    status: 'Closed',
    priority: 'Medium',
    hoursAgo: 280,
    notes: [
      { hoursAfter: 3, text: 'Verified the photos shared by the customer. Warehouse packing error. Exchange approved and pickup scheduled.' },
      { hoursAfter: 70, text: 'Replacement delivered and customer confirmed the size fits. Closing the ticket.' },
    ],
  },
  {
    customer_name: 'Ananya Reddy',
    customer_email: 'ananya.reddy@example.com',
    subject: 'Coupon code not applying at checkout',
    description:
      'The coupon WELCOME10 shows as invalid at checkout even though I signed up only two days ago and have not placed any orders yet. I tried on both the app and the website.',
    status: 'Closed',
    priority: 'Low',
    hoursAgo: 240,
    notes: [
      { hoursAfter: 5, text: 'The coupon needs the account email to be verified. Customer had not verified it. Shared the verification steps and the coupon worked afterwards.' },
    ],
  },
  {
    customer_name: 'Neha Gupta',
    customer_email: 'neha.gupta@example.com',
    subject: 'GST details missing on invoice',
    description:
      'The invoice for order #47902 does not show our company GSTIN. We need a corrected invoice with GSTIN 27AAAAA0000A1Z5 for our accounts team before the month-end close.',
    status: 'In Progress',
    priority: 'Medium',
    hoursAgo: 200,
    notes: [
      { hoursAfter: 6, text: 'Forwarded to the billing team to regenerate the invoice with the GST details provided by the customer.' },
    ],
  },
  {
    customer_name: 'Divya Nair',
    customer_email: 'divya.nair@example.com',
    subject: 'Login OTP is not arriving on my mobile',
    description:
      'I am not receiving the OTP when I try to log in. I have tried five times over the last hour and my number is correct. Network is fine and other SMS messages are arriving.',
    status: 'Closed',
    priority: 'Medium',
    hoursAgo: 170,
    notes: [
      { hoursAfter: 2, text: 'Number was on the DND list of the SMS provider. Switched the customer to email OTP and login worked.' },
    ],
  },
  {
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul.sharma@example.com',
    subject: 'Payment failed during checkout',
    description:
      'I tried to pay ₹3,499 using my credit card three times and every attempt failed at the final step. The amount was debited from my account but no order was created. Please confirm whether the payment will be refunded or the order will be placed.',
    status: 'Open',
    priority: 'High',
    hoursAgo: 120,
    notes: [
      { hoursAfter: 1, text: 'Customer contacted support regarding payment failure. Asked customer to retry after clearing browser cache.' },
    ],
  },
  {
    customer_name: 'Priya Mehta',
    customer_email: 'priya.mehta@example.com',
    subject: 'Order confirmation not received',
    description:
      'I placed an order yesterday evening and the amount has been deducted, but I did not get any confirmation email or SMS. I also cannot see the order in my account. Can you confirm that the order was placed?',
    status: 'Open',
    priority: 'Medium',
    hoursAgo: 96,
    notes: [],
  },
  {
    customer_name: 'Arjun Patel',
    customer_email: 'arjun.patel@example.com',
    subject: 'Unable to update delivery address',
    description:
      'I entered the wrong flat number while placing my order and the app shows an error when I try to edit the address. The order has not shipped yet. Please update the address to Flat 402, Sunrise Heights, Andheri West.',
    status: 'In Progress',
    priority: 'Medium',
    hoursAgo: 72,
    notes: [
      { hoursAfter: 2, text: 'Order is still in packing stage, so the address can be changed manually. Asked the warehouse team to hold dispatch until the update is done.' },
    ],
  },
  {
    customer_name: 'Karan Malhotra',
    customer_email: 'karan.malhotra@example.com',
    subject: 'Password reset link shows "expired" immediately',
    description:
      'Every time I request a password reset, the link in the email says it has expired as soon as I open it. I have requested it four times and tried in two browsers.',
    status: 'Open',
    priority: 'Medium',
    hoursAgo: 48,
    notes: [],
  },
  {
    customer_name: 'Rohan Desai',
    customer_email: 'rohan.desai@example.com',
    subject: 'Package marked as delivered but not received',
    description:
      'Tracking shows my package was delivered yesterday at 3:40 pm, but I was at work and nobody at home received it. I have checked with my neighbours and the security desk as well.',
    status: 'Open',
    priority: 'High',
    hoursAgo: 26,
    notes: [
      { hoursAfter: 1, text: 'Opened an investigation with the courier partner and requested the proof of delivery and the delivery agent location log.' },
    ],
  },
  {
    customer_name: 'Kavita Joshi',
    customer_email: 'kavita.joshi@example.com',
    subject: 'Product arrived with damaged packaging',
    description:
      'The outer box of my order was crushed and the ceramic mug set inside has two cracked pieces. I have photos of the box and the broken items and can share them here.',
    status: 'Open',
    priority: 'Medium',
    hoursAgo: 8,
    notes: [],
  },
  {
    customer_name: 'Amit Verma',
    customer_email: 'amit.verma@example.com',
    subject: 'Request to change registered email address',
    description:
      'I no longer use my old email address and would like to change the email registered on my account to amit.verma.work@example.com. I can still log in with the old one.',
    status: 'Open',
    priority: 'Low',
    hoursAgo: 3,
    notes: [],
  },
];

export function seedIfEmpty() {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM tickets').get();
  if (count > 0) return false;

  const insertTicket = db.prepare(
    `INSERT INTO tickets
       (id, ticket_id, customer_name, customer_email, subject, description, status, priority, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertNote = db.prepare('INSERT INTO notes (ticket_id, note_text, created_at) VALUES (?, ?, ?)');

  db.transaction(() => {
    SAMPLE_TICKETS.forEach((ticket, index) => {
      const id = index + 1;
      const ticketId = formatTicketId(id);
      const createdAt = ago(ticket.hoursAgo);
      const lastNoteAt = ticket.notes.length > 0 ? after(createdAt, ticket.notes.at(-1).hoursAfter) : createdAt;

      insertTicket.run(
        id, ticketId, ticket.customer_name, ticket.customer_email, ticket.subject,
        ticket.description, ticket.status, ticket.priority, createdAt, lastNoteAt
      );
      ticket.notes.forEach((note) => insertNote.run(ticketId, note.text, after(createdAt, note.hoursAfter)));
    });
  })();

  return true;
}

// Allows `npm run seed` while keeping seedIfEmpty importable by the server.
const isRunDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isRunDirectly) {
  console.log(seedIfEmpty() ? `Loaded ${SAMPLE_TICKETS.length} sample tickets.` : 'Tickets already exist, nothing was changed.');
}
