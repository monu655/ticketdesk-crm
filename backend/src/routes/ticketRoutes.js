import { Router } from 'express';
import * as ticketController from '../controllers/ticketController.js';

const router = Router();

// "/stats" must be declared before "/:ticket_id", otherwise "stats" would be read as a ticket ID.
router.get('/stats', ticketController.getStats);

router.route('/').get(ticketController.getTickets).post(ticketController.createTicket);

router
  .route('/:ticket_id')
  .get(ticketController.getTicket)
  .put(ticketController.updateTicket);

export default router;
