import { Response } from 'express';

type TMeta = {
  page: number;
  limit: number;
  total: number;
};

type TApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: TMeta;
  data?: T | null;
};

const sendResponse = <T>(res: Response, payload: TApiResponse<T>): void => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message || null,
    meta: payload.meta || undefined,
    data: payload.data ?? null,
  });
};

export default sendResponse;