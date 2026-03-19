import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

function extractCookiesFromHeaders(request: NextRequest): { fbp?: string; fbc?: string } {
  const cookies = request.headers.get("cookie");
  if (!cookies) return {};
  
  const fbp = cookies.match(/_fbp=([^;]+)/)?.[1];
  const fbc = cookies.match(/_fbc=([^;]+)/)?.[1];
  
  return { fbp, fbc };
}

function getClientIp(request: NextRequest): string | undefined {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
         request.headers.get("x-real-ip") ||
         undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      email,
      website,
      adSpend,
      challenge,
      qualified,
      source,
      timestamp,
      eventId: providedEventId,
    } = body;

    // Basic validation
    if (!firstName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate event ID for deduplication between pixel and CAPI
    const eventId = providedEventId || randomUUID();

    const leadData = {
      firstName,
      email,
      website,
      adSpend,
      challenge,
      qualified: Boolean(qualified),
      timestamp: timestamp || new Date().toISOString(),
      source: source || "meta-ads",
      calendlyBooked: false,
      eventId,
    };

    const key = `landing:leads:${Date.now()}`;

    // Store in Vercel KV (if configured)
    try {
      const kvUrl = process.env.KV_REST_API_URL;
      const kvToken = process.env.KV_REST_API_TOKEN;

      if (kvUrl && kvToken) {
        await fetch(`${kvUrl}/set/${key}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${kvToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(leadData),
        });
      }
    } catch (kvError) {
      console.error("KV storage error:", kvError);
      // Don't fail the request if KV is unavailable
    }

    // Send Meta CAPI event if qualified lead
    if (qualified) {
      try {
        const { fbp, fbc } = extractCookiesFromHeaders(request);
        const clientIp = getClientIp(request);
        const userAgent = request.headers.get("user-agent") || undefined;

        await fetch(`${request.nextUrl.origin}/api/meta-capi`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: "Lead",
            eventTime: Math.floor(new Date().getTime() / 1000),
            eventId,
            userData: {
              email,
              firstName,
              clientIp,
              userAgent,
              fbp,
              fbc,
            },
            customData: {
              content_name: "Audit Form Submission",
              content_category: "Lead Generation",
              value: 100, // Estimated lead value
              currency: "GBP",
            },
          }),
        });
      } catch (capiError) {
        console.error("CAPI error (non-blocking):", capiError);
        // Don't fail the request if CAPI fails
      }
    }

    // Send to webhook if configured
    try {
      const webhookUrl = process.env.LANDING_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...leadData,
            kvKey: key,
          }),
        });
      }
    } catch (webhookError) {
      console.error("Webhook error:", webhookError);
      // Don't fail the request if webhook is unavailable
    }

    // Send Slack notification via proactive API
    try {
      await fetch("https://root-social-os.vercel.app/api/proactive", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-mc-secret": "mc-proactive-2026"
        },
        body: JSON.stringify({
          type: "landing_lead",
          data: {
            firstName,
            email,
            website,
            adSpend,
            challenge,
            qualified,
            source,
            timestamp: leadData.timestamp,
          },
        }),
      });
    } catch (slackError) {
      console.error("Slack notification error:", slackError);
      // Don't fail the request if Slack notification fails
    }

    return NextResponse.json({ success: true, key, eventId });
  } catch (error) {
    console.error("Submit lead error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
