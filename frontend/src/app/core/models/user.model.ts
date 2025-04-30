import { Role } from './role.model';

export interface User {
  id: number;
  fullName: string;
  email: string;
  password?: string;
  roles: Role[];
  enabled: boolean;
  profilePicture?: string;
} 