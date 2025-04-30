export interface JwtResponse {
  token: string;
  type: 'Bearer';
  id: number;
  email: string;
  fullName: string;
  roles: string[];
  profilePicture?: string;
} 