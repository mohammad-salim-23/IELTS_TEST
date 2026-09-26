import jwt, { JwtPayload, Secret , SignOptions} from 'jsonwebtoken';
import config from '../../app/config';
if (!config.jwt.secret) {
  throw new Error('JWT secret is not configured');
}
const createToken = (payload: object, secret: Secret, expiresIn: string): string => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const AuthUtils = { createToken, verifyToken };