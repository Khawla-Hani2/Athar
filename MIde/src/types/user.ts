export type UserRole =
  | 'Admin'
  | 'Media Leader'
  | 'Content Writer'
  | 'Designer'
  | 'Photographer'
  | 'Video Editor'
  | 'Member';

export type UserStatus = 'active' | 'away' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  title: string;
  department: string;
  status: UserStatus;
  joinedAt: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  productivity: number;
}

export interface Permission {
  key: string;
  label: string;
  roles: UserRole[];
}
