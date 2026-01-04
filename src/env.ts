import { z } from "zod";

/**
 * Environment variable schema with Zod validation.
 * Validates at module load (fail-fast at startup).
 */
const envSchema = z.object({
  // MailerLite (optional - allows graceful fallback in development)
  MAILERLITE_API_KEY: z
    .string()
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
  // Optional: empty string treated as undefined
  MAILERLITE_GROUP_ID: z
    .string()
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),

  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Sanity CMS (server-only, no NEXT_PUBLIC_ prefix needed)
  SANITY_PROJECT_ID: z.string().min(1, "SANITY_PROJECT_ID is required"),
  SANITY_DATASET: z.string().min(1, "SANITY_DATASET is required"),
  SANITY_API_VERSION: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "SANITY_API_VERSION must be in YYYY-MM-DD format"
    ),
});

// Validate at startup (fail fast)
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(z.prettifyError(parsed.error));
  throw new Error("Environment validation failed. See above for details.");
}

export const env = parsed.data;

// Export type for external use
export type Env = z.infer<typeof envSchema>;
