import { z } from "zod";

/**
 * Email validation schema for waitlist subscription.
 * Includes transformations (trim, lowercase) and user-friendly error messages.
 */
export const emailSchema = z
  .string({ message: "Please enter your email address." })
  .min(1, "Please enter your email address.")
  .email("Please enter a valid email address.")
  .max(254, "Email address is too long.")
  .transform((email) => email.trim().toLowerCase());

/**
 * Full subscription form schema.
 * Wrap in object for future extensibility (e.g., adding name, company).
 */
export const subscribeSchema = z.object({
  email: emailSchema,
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type ValidatedEmail = z.infer<typeof emailSchema>;
