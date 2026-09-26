import { Schema, model } from 'mongoose';
import { IPayment } from './payment.interface';
import { PAYMENT_METHOD, PAYMENT_STATUS, PLAN } from './payment.constant';

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: Object.values(PLAN), required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: Object.values(PAYMENT_METHOD), required: true },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    providerSessionId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>('Payment', paymentSchema);