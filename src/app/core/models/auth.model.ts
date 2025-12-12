// auth.model.ts
import { UserRole } from './employee.model';

export interface AuthToken {
  token: string;
  role: UserRole;
  username: string;
  expiresAt: number; // epoch ms
}

export interface LoginCredentials {
  username: string;
  password: string;
}
