import app from './app.js';
import config from './config/env.js';
import './db/connection.js';
import { seedIfEmpty } from './db/seed.js';

if (config.seedOnEmpty && seedIfEmpty()) {
  console.log('Database was empty, loaded sample support tickets.');
}

app.listen(config.port, () => {
  console.log(`TicketDesk API listening on port ${config.port}`);
});
