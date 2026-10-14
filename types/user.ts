export type UserRole = 'admin' | 'user';

export interface UserWithRole {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}
