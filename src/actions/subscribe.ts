"use server";

import { getMailerLiteClient, getGroupId } from "@/lib/mailerlite";
import { subscribeSchema } from "@/lib/schemas/subscribe";
import { env } from "@/env";

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
    // Validate email with Zod
    const result = subscribeSchema.safeParse({ email });

    if (!result.success) {
      return {
        success: false,
        message: result.error.issues[0]?.message ?? "Please enter a valid email address.",
      };
    }

    // Email is already sanitized (trimmed, lowercased) by Zod transform
    const sanitizedEmail = result.data.email;

    // Get MailerLite client
    const client = getMailerLiteClient();

    if (!client) {
      console.error("MailerLite API key not configured");
      // In development, return success so form can be tested
      if (env.NODE_ENV === "development") {
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
