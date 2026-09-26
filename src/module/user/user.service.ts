import ApiError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';

const getMyProfileFromDB = async (userId: string): Promise<IUser | null> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

const getAllUsersFromDB = async (): Promise<IUser[]> => {
  const result = await User.find({ isDeleted: false });
  return result;
};

const updateMyProfileIntoDB = async (
  userId: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  // নিরাপত্তার জন্য: প্রোফাইল আপডেট দিয়ে কেউ নিজেকে admin/premium বানাতে পারবে না
  delete (payload as Partial<IUser>).role;
  delete (payload as Partial<IUser>).subscriptionType;
  delete (payload as Partial<IUser>).subscriptionExpiresAt;

  const result = await User.findByIdAndUpdate(userId, payload, {
    new: true,
  });

  if (!result) {
    throw new ApiError(404, 'User not found');
  }
  return result;
};

const isSubscriptionActive = (user: IUser): boolean => {
  if (user.subscriptionType !== 'premium') return false;
  if (!user.subscriptionExpiresAt) return false;
  return new Date(user.subscriptionExpiresAt).getTime() > Date.now();
};

export const UserService = {
  getMyProfileFromDB,
  getAllUsersFromDB,
  updateMyProfileIntoDB,
  isSubscriptionActive,
};