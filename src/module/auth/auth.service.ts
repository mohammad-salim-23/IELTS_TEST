
import { User } from '../user/user.model';
import { IUser } from '../user/user.interface';
import { TLoginUser, TRegisterUser, TAuthResult } from './auth.interface';
import { AuthUtils } from './auth.utils';
import config from '../../app/config';
import AppError from '../../errors/AppError';
const registerUserIntoDB = async (payload: TRegisterUser): Promise<IUser> => {
  const existingUser = await User.isUserExistsByEmail(payload.email);
  if (existingUser) {
    throw new AppError(409, 'An account with this email already exists');
  }

  // password.pre('save') hook User model-এই hash করে দেবে
  const result = await User.create(payload);
  return result;
};

const loginUserFromDB = async (payload: TLoginUser): Promise<TAuthResult> => {
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(404, 'No account found with this email');
  }

  const isPasswordMatched = await User.isPasswordMatched(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(401, 'Incorrect password');
  }

  const jwtPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = AuthUtils.createToken(
    jwtPayload,
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );

  const refreshToken = AuthUtils.createToken(
    jwtPayload,
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};

const refreshAccessToken = async (token: string): Promise<{ accessToken: string }> => {
  if (!token) {
    throw new AppError(401, 'Refresh token not found');
  }

  let decoded;
  try {
    decoded = AuthUtils.verifyToken(token, config.jwt.refresh_secret as string);
  } catch {
    throw new AppError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError(404, 'This user no longer exists');
  }

  const accessToken = AuthUtils.createToken(
    { id: user._id.toString(), email: user.email, role: user.role },
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );

  return { accessToken };
};

export const AuthService = {
  registerUserIntoDB,
  loginUserFromDB,
  refreshAccessToken,
};