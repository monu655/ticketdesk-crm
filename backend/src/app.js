import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import config from './config/env.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import ticketRoutes from './routes/ticketRoutes.js';

const app = express();

// The API is called from a different origin (Vercel), so allow cross-origin reads.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: config.frontendUrls }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/tickets', ticketRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
