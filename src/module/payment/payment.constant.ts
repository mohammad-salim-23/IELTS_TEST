export const PAYMENT_METHOD = {
  STRIPE: 'stripe',
  // BKASH: 'bkash',        // future — not implemented now
  // SSLCOMMERZ: 'sslcommerz', // future — not implemented now
} as const;

export const PLAN = {
  ONE_DAY: 'one_day',
  ONE_MONTH: 'one_month',
  THREE_MONTH: 'three_month',
} as const;

export const PLAN_PRICE_BDT = {
  one_day: 99,
  one_month: 399,
  three_month: 999,
} as const;

export const PLAN_DURATION_DAYS = {
  one_day: 1,
  one_month: 30,
  three_month: 90,
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;