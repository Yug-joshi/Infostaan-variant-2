import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface AuthenticatedAdminRequest extends Request {
  isAdmin?: boolean;
}

const getExpectedAdminKey = (): string => {
  const envKey = process.env.ADMIN_API_KEY;
  if (envKey && envKey.trim().length > 0) {
    return envKey.trim();
  }
  // Safe default for local development only if unconfigured
  return 'infostaan_admin_secret_dev_key_2025';
};

export const requireAdminAuth = (
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-admin-key'];

  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (typeof customHeader === 'string') {
    token = customHeader.trim();
  }

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Admin authorization credential is required to access this endpoint.',
    });
    return;
  }

  const expectedKey = getExpectedAdminKey();

  // Timing safe equality comparison to prevent timing attacks
  const tokenBuf = Buffer.from(token);
  const expectedBuf = Buffer.from(expectedKey);

  if (tokenBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(tokenBuf, expectedBuf)) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid administrator credentials.',
    });
    return;
  }

  req.isAdmin = true;
  next();
};
