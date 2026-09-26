export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
};

export type TLoginUser = {
  email: string;
  password: string;
};

export type TAuthResult = {
  accessToken: string;
  refreshToken: string;
};

export type TJwtPayload = {
  id: string;
  email: string;
  role: string;
};