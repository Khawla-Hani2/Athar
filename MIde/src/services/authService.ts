import type { User } from '@/types';
import { users } from '@/data';

// Mock auth layer — replace the bodies below with real API calls later;
// call sites (AuthContext) do not need to change shape.

export async function loginRequest(email: string, _password: string): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('No account found with that email.');
  }
  return user;
}

export async function logoutRequest(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 150));
}
