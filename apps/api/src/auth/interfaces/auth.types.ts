import { Request } from 'express';
import { UserRole } from '../../common/decorators/roles.decorator';

export interface JwtPayload {
  sub: string;    // userId
  email: string;
  role: UserRole;
  jti?: string;   // JWT ID (pour garantir l'unicité du refresh token)
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
