import { Model } from 'mongoose';
import { USER_ROLE, SUBSCRIPTION_TYPE } from './user.constant';

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type TSubscriptionType = (typeof SUBSCRIPTION_TYPE)[keyof typeof SUBSCRIPTION_TYPE];

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  subscriptionType: TSubscriptionType;
  subscriptionExpiresAt: Date | null;
  isDeleted: boolean;
}

export type UserModel = Model<IUser, Record<string, unknown>>;