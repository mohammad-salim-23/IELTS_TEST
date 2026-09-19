import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { USER_ROLE, SUBSCRIPTION_TYPE } from './user.constant';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // by default কোনো query তে password আসবে না
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
    },
    subscriptionType: {
      type: String,
      enum: Object.values(SUBSCRIPTION_TYPE),
      default: SUBSCRIPTION_TYPE.FREE,
    },
    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = model<IUser, UserModel>('User', userSchema);