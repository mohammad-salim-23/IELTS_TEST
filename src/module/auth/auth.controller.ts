import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import config from '../../app/config';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Account created successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken, accessToken } = await AuthService.loginUserFromDB(req.body);

  // XSS-safe: refresh token httpOnly cookie-তে, JS দিয়ে অ্যাক্সেস করা যাবে না
  res.cookie('refreshToken', refreshToken, {
    secure: config.env === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged in successfully',
    data: { accessToken },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.refreshAccessToken(req.cookies.refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Access token refreshed successfully',
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
};