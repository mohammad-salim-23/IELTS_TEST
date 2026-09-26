import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import config from '../app/config';


const auth = (...allowedRoles: string[]) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
      throw new AppError(401, 'You are not authorized');
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt.secret as string) as JwtPayload;
    } catch {
      throw new AppError(401, 'Invalid or expired token');
    }

    const { id, email, role } = decoded;

    // allowedRoles খালি থাকলে (যেমন auth()) — শুধু লগইন থাকলেই চলবে, নির্দিষ্ট role লাগবে না
    if (allowedRoles.length && !allowedRoles.includes(role)) {
      throw new AppError(403, 'You do not have permission to access this resource');
    }

    req.user = { id, email, role };
    next();
  });
};

export default auth;