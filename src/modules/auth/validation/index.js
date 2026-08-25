import { z } from "zod";
import { EMAIL_PATTERN, PHONE_PATTERN } from "../constants";

// Error copy matches the design source's inline validation exactly.
export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Enter your email address or phone number.")
    .refine((value) => EMAIL_PATTERN.test(value) || PHONE_PATTERN.test(value), {
      message: "That doesn’t look like a valid email or phone number.",
    }),
  password: z.string().min(1, "Enter your password."),
  remember: z.boolean(),
});
