import MailerLite from "@mailerlite/mailerlite-nodejs";

// Singleton instance - created once and reused
let mailerliteClient: MailerLite | null = null;

/**
 * Get or create the MailerLite client instance.
 * Returns null if API key is not configured.
 */
export function getMailerLiteClient(): MailerLite | null {
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!mailerliteClient) {
    mailerliteClient = new MailerLite({
      api_key: apiKey,
    });
  }

  return mailerliteClient;
}

/**
 * Get the configured group ID, or fetch the first available group as fallback.
 * Caches the fetched group ID for subsequent calls.
 */
let cachedGroupId: string | null = null;

export async function getGroupId(): Promise<string | null> {
  // Return configured group ID if available
  const configuredGroupId = process.env.MAILERLITE_GROUP_ID;
  if (configuredGroupId) {
    return configuredGroupId;
  }

  // Return cached group ID if we've already fetched it
  if (cachedGroupId) {
    return cachedGroupId;
  }

  // Fetch the first available group as fallback
  const client = getMailerLiteClient();
  if (!client) {
    return null;
  }

  try {
    const response = await client.groups.get({ limit: 1, sort: "name" });
    const groups = response.data?.data;

    if (groups && groups.length > 0) {
      cachedGroupId = groups[0].id;
      if (process.env.NODE_ENV === "development") {
        console.log(`Using fallback MailerLite group: ${groups[0].name} (${cachedGroupId})`);
      }
      return cachedGroupId;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch MailerLite groups:", error);
    return null;
  }
}
