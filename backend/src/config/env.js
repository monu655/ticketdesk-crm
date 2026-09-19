import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const isProduction = process.env.NODE_ENV === 'production';

// FRONTEND_URL can hold several comma-separated origins (e.g. production + a Vercel preview).
const frontendUrls = (process.env.FRONTEND_URL || (isProduction ? '' : 'http://localhost:5173'))
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

if (isProduction && frontendUrls.length === 0) {
  throw new Error('FRONTEND_URL must be set in production so CORS knows which site may call the API.');
}

export default {
  port: Number(process.env.PORT) || 4000,
  databasePath: path.resolve(process.env.DATABASE_PATH || './data/ticketdesk.db'),
  frontendUrls,
  seedOnEmpty: process.env.SEED_ON_EMPTY === 'true',
};
