import mongoose from 'mongoose';
import ApiError from '../../errors/AppError';
import { User } from '../user/user.model';
import { Payment } from './payment.model';
import PaymentGatewayFactory from './payment.gateway.factory';
import {
  PLAN_PRICE_BDT,
  PLAN_DURATION_DAYS,
  PAYMENT_STATUS,
} from './payment.constant';
import { ICheckoutResult, IPayment } from './payment.interface';

const initiateCheckout = async (
  userId: string,
  plan: string,
  method: string
): Promise<ICheckoutResult> => {
  const amount = PLAN_PRICE_BDT[plan as keyof typeof PLAN_PRICE_BDT];
  if (!amount) {
    throw new ApiError(400, 'Invalid plan selected');
  }

  const gateway = PaymentGatewayFactory.get(method);
  const checkoutResult = await gateway.createCheckoutSession({ userId, plan, amount });

  await Payment.create({
    userId,
    plan,
    amount,
    method,
    status: PAYMENT_STATUS.PENDING,
    providerSessionId: checkoutResult.sessionId,
  });

  return checkoutResult;
};

const handleWebhookEvent = async (
  method: string,
  rawBody: Buffer,
  signature: string
): Promise<void> => {
  const gateway = PaymentGatewayFactory.get(method);
  const parsed = await gateway.verifyAndParseWebhookEvent(rawBody, signature);

  // Idempotency guard — Stripe can send the same webhook more than once
  const existingPayment = await Payment.findOne({ providerSessionId: parsed.sessionId });
  if (!existingPayment) {
    throw new ApiError(404, 'Payment record not found for this session');
  }
  if (existingPayment.status === PAYMENT_STATUS.SUCCESS) {
    return; // already processed, safely skip
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    existingPayment.status = PAYMENT_STATUS.SUCCESS;
    await existingPayment.save({ session });

    const user = await User.findById(parsed.userId).session(session);
    if (!user) {
      throw new ApiError(404, 'User not found for this payment');
    }

    const durationDays = PLAN_DURATION_DAYS[parsed.plan as keyof typeof PLAN_DURATION_DAYS] ;
    const now = new Date();
    const baseDate =
      user.subscriptionExpiresAt && user.subscriptionExpiresAt > now
        ? user.subscriptionExpiresAt
        : now;

    const newExpiry = new Date(baseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    user.subscriptionType = 'premium';
    user.subscriptionExpiresAt = newExpiry;
    await user.save({ session });

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const getMyPaymentHistory = async (userId: string): Promise<IPayment[]> => {
  return Payment.find({ userId }).sort({ createdAt: -1 });
};

export const PaymentService = {
  initiateCheckout,
  handleWebhookEvent,
  getMyPaymentHistory,
};