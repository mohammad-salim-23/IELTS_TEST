import { Model, Types } from 'mongoose';
import { USER_ROLE, SUBSCRIPTION_TYPE } from './user.constant';

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type TSubscriptionType = (typeof SUBSCRIPTION_TYPE)[keyof typeof SUBSCRIPTION_TYPE];

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  subscriptionType: TSubscriptionType;
  subscriptionExpiresAt: Date | null;
  isDeleted: boolean;
}

// Static methods — Model-এর উপর সরাসরি কল হবে (User.isUserExistsByEmail(...))
export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
}