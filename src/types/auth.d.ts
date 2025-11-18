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
