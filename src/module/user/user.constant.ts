export const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const SUBSCRIPTION_TYPE = {
  FREE: 'free',
  PREMIUM: 'premium',
} as const;

export const USER_ROLE_ARRAY = Object.values(USER_ROLE);
export const SUBSCRIPTION_TYPE_ARRAY = Object.values(SUBSCRIPTION_TYPE);