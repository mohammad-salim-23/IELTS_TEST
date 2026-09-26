import Stripe from 'stripe';

import config from '../../../../app/config';
import {
  ICheckoutPayload,
  ICheckoutResult,
  IPaymentGateway,
  IWebhookParsedEvent,

} from '../../payment.interface';
import ApiError from '../../../../errors/AppError';
import stripeClient from './stripe.config';

export class StripeGateway implements IPaymentGateway {
  /**
   * Creates a Stripe Checkout Session and returns the hosted payment URL.
   * userId and plan are encoded in metadata so the webhook can identify them.
   */
  async createCheckoutSession(payload: ICheckoutPayload): Promise<ICheckoutResult> {
    const { userId, plan, amount } = payload;

    // Convert BDT amount to paisa (Stripe uses smallest currency unit)
    // Stripe does not natively support BDT, so we use USD as a stand-in for test mode.
    // Amount is kept in cents (1 USD = 100 cents); amount value is passed as-is (treat BDT value as cents).
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `IELTS Premium — ${plan.replace(/_/g, ' ')} plan`,
            },
            unit_amount: amount, // amount in smallest unit (cents/paisa)
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        plan,
      },
      success_url: `${config.stripe.success_url || 'http://localhost:3000/payment/success'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.stripe.cancel_url || 'http://localhost:3000/payment/cancel'}`,
    });

    if (!session.url) {
      throw new ApiError(500, 'Stripe did not return a checkout URL');
    }

    return {
      paymentUrl: session.url,
      sessionId: session.id,
    };
  }

  /**
   * Verifies the Stripe webhook signature and parses the event.
   * Only processes checkout.session.completed events.
   */
  async verifyAndParseWebhookEvent(
    rawBody: Buffer,
    signature: string
  ): Promise<IWebhookParsedEvent> {
    if (!config.stripe.webhook_secret) {
      throw new ApiError(500, 'Stripe webhook secret is not configured');
    }

    let event: Stripe.Event;

    try {
      event = stripeClient.webhooks.constructEvent(
        rawBody,
        signature,
        config.stripe.webhook_secret as string
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Webhook signature verification failed';
      throw new ApiError(400, `Stripe webhook error: ${message}`);
    }

    if (event.type !== 'checkout.session.completed') {
      // Return a neutral result for unhandled event types — service layer will skip processing
      throw new ApiError(400, `Unhandled Stripe event type: ${event.type}`);
    }

    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (!userId || !plan) {
      throw new ApiError(400, 'Stripe webhook metadata is missing userId or plan');
    }

    const paymentStatus = session.payment_status === 'paid' ? 'success' : 'failed';

    return {
      sessionId: session.id,
      status: paymentStatus,
      userId,
      plan,
    };
  }
}
