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
    const { email, timestamp } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Generate event ID for deduplication
    const eventId = randomUUID();

    const leadData = {
      email,
      timestamp: timestamp || new Date().toISOString(),
      source: "exit-intent",
      eventId,
    };

    const key = `landing:exit-leads:${Date.now()}`;

    // Store in Vercel KV
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
    }

    // Send Meta CAPI event (lower quality exit-intent lead)
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
            clientIp,
            userAgent,
            fbp,
            fbc,
          },
          customData: {
            content_name: "Exit Intent Email",
            content_category: "Exit Intent",
            value: 25, // Lower estimated value than full form
            currency: "GBP",
          },
        }),
      });
    } catch (capiError) {
      console.error("CAPI error (non-blocking):", capiError);
      // Don't fail the request if CAPI fails
    }

    // Webhook
    try {
      const webhookUrl = process.env.LANDING_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...leadData, kvKey: key, type: "exit-intent" }),
        });
      }
    } catch (webhookError) {
      console.error("Webhook error:", webhookError);
    }

    // Send notification via proactive API
    try {
      await fetch("https://root-social-os.vercel.app/api/proactive", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-mc-secret": "mc-proactive-2026"
        },
        body: JSON.stringify({
          message: `📩 Exit-intent email captured!\n📧 ${email}\nLower intent but worth a follow-up video audit.`,
          agentId: "main",
          priority: "normal",
        }),
      });
    } catch (notifyError) {
      console.error("Notification error:", notifyError);
    }

    return NextResponse.json({ success: true, eventId });
  } catch (error) {
    console.error("Exit lead error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
