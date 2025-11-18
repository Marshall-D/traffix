// src/validation.ts
import * as Yup from "yup";

export const signUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(1, "Enter your first name")
    .max(30, "First name is too long")
    .required("Please enter your first name"),
  lastName: Yup.string()
    .trim()
    .min(1, "Enter your last name")
    .max(30, "Last name is too long")
    .required("Please enter your last name"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Please enter your password"),
});
