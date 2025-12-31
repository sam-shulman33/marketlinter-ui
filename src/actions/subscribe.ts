"use server";

import { getMailerLiteClient, getGroupId } from "@/lib/mailerlite";

// Simple in-memory rate limiting (resets on server restart)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP
const CLEANUP_INTERVAL = 5 * 60 * 1000; // Clean up every 5 minutes
let lastCleanup = Date.now();

function cleanupStaleEntries(): void {
  const now = Date.now();
  // Only run cleanup periodically to avoid overhead on every request
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, record] of rateLimitMap) {
    if (now - record.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(key);
    }
  }
}

function isRateLimited(identifier: string): boolean {
  const now = Date.now();

  // Periodically clean up stale entries to prevent memory leak
  cleanupStaleEntries();

  const record = rateLimitMap.get(identifier);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(identifier, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SubscribeResult {
  success: boolean;
  message: string;
}

/**
 * Server Action to subscribe an email to the MailerLite waitlist.
 * The welcome email is sent automatically via MailerLite automation.
 */
export async function subscribeToWaitlist(email: string): Promise<SubscribeResult> {
  try {
    // Rate limiting using email as identifier (since we don't have IP in server actions easily)
    if (isRateLimited(email)) {
      return {
        success: false,
        message: "Too many requests. Please try again in a minute.",
      };
    }

    // Validate email
    if (!email || typeof email !== "string") {
      return {
        success: false,
        message: "Please enter a valid email address.",
      };
    }

    const sanitizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(sanitizedEmail) || sanitizedEmail.length > 254) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      };
    }

    // Get MailerLite client
    const client = getMailerLiteClient();

    if (!client) {
      console.error("MailerLite API key not configured");
      // In development, return success so form can be tested
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode: Simulating successful subscription for", sanitizedEmail);
        return {
          success: true,
          message: "Subscribed successfully (dev mode)",
        };
      }
      return {
        success: false,
        message: "Email subscription is not configured. Please try again later.",
      };
    }

    // Get group ID (configured or fallback to first group)
    const groupId = await getGroupId();

    // Create or update subscriber with group assignment
    const params: {
      email: string;
      status: "active";
      groups?: string[];
    } = {
      email: sanitizedEmail,
      status: "active",
    };

    // Add to group if available (this triggers the automation for welcome email)
    if (groupId) {
      params.groups = [groupId];
    }

    await client.subscribers.createOrUpdate(params);

    return {
      success: true,
      message: "Thanks for joining the waitlist!",
    };
  } catch (error: unknown) {
    // Handle MailerLite API errors
    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message;

      // Check for duplicate subscriber (already exists)
      if (errorMessage?.toLowerCase().includes("already")) {
        return {
          success: false,
          message: "You're already on the waitlist!",
        };
      }

      console.error("MailerLite API error:", apiError.response?.data);
    } else {
      console.error("Subscription error:", error);
    }

    return {
      success: false,
      message: "Unable to subscribe. Please try again later.",
    };
  }
}
