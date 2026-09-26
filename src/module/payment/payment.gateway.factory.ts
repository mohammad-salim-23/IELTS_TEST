
import ApiError from '../../errors/AppError';
import { PAYMENT_METHOD } from './payment.constant';
import { IPaymentGateway } from './payment.interface';
import { StripeGateway } from './providers/stripe/stripe.gateway';


class PaymentGatewayFactory {
  static get(method: string): IPaymentGateway {
    switch (method) {
      case PAYMENT_METHOD.STRIPE:
        return new StripeGateway();
      default:
        throw new ApiError(400, `Unsupported payment method: ${method}`);
    }
  }
}

export default PaymentGatewayFactory;