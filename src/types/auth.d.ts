// src/types/auth.ts

export type SignUpValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginValues = {
  email: string;
  password: string;
};

export type User = {
  userId?: string; // JWT payload used userId earlier — backend may return _id; map accordingly
  _id?: string; // keep both in case backend returns _id
  firstName: string;
  lastName: string;
  email: string;
  // additional optional fields that may be returned by the backend
  isVerified?: boolean;
  lastLogin?: string | null;
};
