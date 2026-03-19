import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, timestamp } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const leadData = {
      email,
      timestamp: timestamp || new Date().toISOString(),
      source: "exit-intent",
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Exit lead error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
