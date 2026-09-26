import { Types } from "mongoose";

export interface ICheckoutPayload {
  userId: string;
  plan: string;   // one of PLAN values
  amount: number; // resolved from PLAN_PRICE_BDT, never trust client-sent amount
}

export interface ICheckoutResult {
  paymentUrl: string;
  sessionId: string;
}

export interface IWebhookParsedEvent {
  sessionId: string;
  status: 'success' | 'failed';
  userId: string;
  plan: string;
}

// Every provider (Stripe, bKash, ...) must implement this
export interface IPaymentGateway {
  createCheckoutSession(payload: ICheckoutPayload): Promise<ICheckoutResult>;
  verifyAndParseWebhookEvent(rawBody: Buffer, signature: string): Promise<IWebhookParsedEvent>;
}

export interface IPayment {
  userId:Types.ObjectId| string;
  plan: string;
  amount: number;
  method: string; // PAYMENT_METHOD value
  status: string; // PAYMENT_STATUS value
  providerSessionId: string;
}