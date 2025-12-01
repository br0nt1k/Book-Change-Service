export type UserRole = 'Admin' | 'User';

export interface IUser {
  uid: string;
  email: string | null;
  role?: UserRole;
}

export interface IBook {
  id: string;
  name: string;
  author: string;
  photoUrl: string;
  ownerId: string;
}