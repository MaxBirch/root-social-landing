import { NextRequest, NextResponse } from "next/server";

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
    } = body;

    // Basic validation
    if (!firstName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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

    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error("Submit lead error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
