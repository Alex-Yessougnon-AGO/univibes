import { UserRole } from '../../common/decorators/roles.decorator';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: UserRole;
    fullname: string;
    avatarUrl: string | null;
  };
  tokens: AuthTokens;
}
