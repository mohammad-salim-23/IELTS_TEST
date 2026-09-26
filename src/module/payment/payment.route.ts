import express from 'express';

import { PaymentController } from './payment.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/checkout', auth(), PaymentController.initiateCheckout);
router.post('/webhook/stripe', PaymentController.stripeWebhookHandler); // no auth() — Stripe calls this
router.get('/history', auth(), PaymentController.getMyPayments);

export const PaymentRoutes = router;