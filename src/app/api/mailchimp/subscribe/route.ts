import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting (resets on server restart)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
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

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    // Validate email - proper regex validation and sanitization
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(sanitizedEmail) || sanitizedEmail.length > 254) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Get Mailchimp credentials from environment variables
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

    // Check if credentials are configured
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
      console.error("Mailchimp credentials not configured");
      // In development, return success so form can be tested
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode: Simulating successful subscription for", email);
        return NextResponse.json(
          { success: true, message: "Subscribed successfully (dev mode)" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { message: "Email subscription is not configured. Please try again later." },
        { status: 500 }
      );
    }

    // Extract datacenter from API key (format: xxx-usX)
    const DATACENTER = MAILCHIMP_API_KEY.split("-")[1];

    if (!DATACENTER) {
      console.error("Invalid Mailchimp API key format");
      return NextResponse.json(
        { message: "Configuration error. Please try again later." },
        { status: 500 }
      );
    }

    // Make request to Mailchimp API
    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: sanitizedEmail,
        status: "subscribed",
        tags: ["marketlinter-waitlist"],
      }),
    });

    const data = await response.json();

    // Handle Mailchimp response
    if (!response.ok) {
      // Member already exists
      if (data.title === "Member Exists") {
        return NextResponse.json(
          { message: "You're already on the waitlist!" },
          { status: 400 }
        );
      }

      // Invalid email
      if (data.title === "Invalid Resource") {
        return NextResponse.json(
          { message: "Please enter a valid email address." },
          { status: 400 }
        );
      }

      // Log error for debugging
      console.error("Mailchimp API error:", data);

      return NextResponse.json(
        { message: "Unable to subscribe. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Thanks for joining the waitlist!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
