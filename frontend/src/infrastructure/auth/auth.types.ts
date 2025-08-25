import { AsyncStatus } from '../common/types/status.types';
import { AdminData } from './types/user.types';

export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: AdminData | null;
  status: AsyncStatus;
  error: null | string;
}

export interface LoginResults {
  access_token: string;
  user: AdminData;
}
