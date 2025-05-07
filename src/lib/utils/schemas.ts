import zod from "zod";
export const LoginSchema = zod.object({
  email: zod.string().email("Invalid email address, wrong format"),
  password: zod.string().min(8, "Password must be at least 8 characters long"),
});

export const SignupSchema = zod.object({
  email: zod.string().email("Invalid email address, wrong format"),
  password: zod.string().min(8, "Password must be at least 8 characters long"),
  firstName: zod.string().min(1, "First name is required"),
  lastName: zod.string().min(1, "Last name is required"),
});
