import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../app/config'
import { IUser, UserModel } from './user.interface';
import { USER_ROLE, SUBSCRIPTION_TYPE } from './user.constant';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // default query তে আসবে না
    role: { type: String, enum: Object.values(USER_ROLE), default: USER_ROLE.USER },
    subscriptionType: {
      type: String,
      enum: Object.values(SUBSCRIPTION_TYPE),
      default: SUBSCRIPTION_TYPE.FREE,
    },
    subscriptionExpiresAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Signup-এর সময় password auto hash হবে
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, config.bcrypt_salt_rounds);
  
});

// Response-এ password/‌__v কখনো যাবে না, res.json() করলেই এটা কাজ করবে
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as any).password;
    delete (ret as any).__v;
    return ret;
  },
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);