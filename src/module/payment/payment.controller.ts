import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.service';

const initiateCheckout = catchAsync(async (req: Request, res: Response) => {
  const { plan, method } = req.body;
  const result = await PaymentService.initiateCheckout(req.user.id, plan, method);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Checkout session created',
    data: result,
  });
});

const stripeWebhookHandler = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  try {
    await PaymentService.handleWebhookEvent('stripe', req.body, signature);
  } catch (err: any) {
    // "Ignored event type" থ্রো হলেও Stripe-কে 200 পাঠাতে হয়, নাহলে বারবার retry করবে
    if (err?.statusCode === 200) {
      res.status(200).json({ received: true });
      return;
    }
    throw err;
  }

  res.status(200).json({ received: true });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getMyPaymentHistory(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment history retrieved successfully',
    data: result,
  });
});

export const PaymentController = {
  initiateCheckout,
  stripeWebhookHandler,
  getMyPayments,
};