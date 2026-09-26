import Stripe from 'stripe';
import config from '../../../../app/config';

if (!config.stripe?.secret_key) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

// Single shared Stripe instance — avoids creating a new client per request
const stripeClient = new Stripe(config.stripe.secret_key, {
  apiVersion: '2026-08-26.dahlia',
});

export default stripeClient;