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

async function sendDiscordNotification(leadData: Record<string, unknown>) {
  const DISCORD_CHANNEL_ID = "1485604130734080084";
  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

  if (!DISCORD_BOT_TOKEN) {
    console.warn("DISCORD_BOT_TOKEN not set  -  skipping Discord notification");
    return;
  }

  const {
    firstName,
    email,
    website,
    adSpend,
    challenge,
    qualified,
    accessGranted,
    additionalNotes,
    calendlyBooked,
  } = leadData as {
    firstName?: string;
    email?: string;
    website?: string;
    adSpend?: string;
    challenge?: string;
    qualified?: boolean;
    accessGranted?: boolean;
    additionalNotes?: string;
    calendlyBooked?: boolean;
  };

  const qualTag = qualified ? "✅ QUALIFIED" : "⚠️ Disqualified";
  const bookedTag = calendlyBooked ? "\n📅 **Calendly booking confirmed**" : "";
  const accessTag = accessGranted ? "✅ Yes" : "❌ Not yet";

  const content = [
    `🚨 **NEW LEAD  -  Landing Page**`,
    `${qualTag}${bookedTag}`,
    ``,
    `👤 **Name:** ${firstName || "N/A"}`,
    `📧 **Email:** ${email || "N/A"}`,
    `🌐 **Website:** ${website || "N/A"}`,
    `💰 **Ad Spend:** ${adSpend || "N/A"}`,
    `🎯 **Challenge:** ${challenge || "N/A"}`,
    `🔑 **Ad Account Access Granted:** ${accessTag}`,
    additionalNotes ? `📝 **Additional Notes:** ${additionalNotes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  await fetch(`https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
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
      accessGranted,
      additionalNotes,
      calendlyBooked,
    } = body;

    // Basic validation
    if (!firstName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const eventId = providedEventId || randomUUID();

    const leadData = {
      firstName,
      email,
      website,
      adSpend,
      challenge,
      qualified: Boolean(qualified),
      accessGranted: Boolean(accessGranted),
      additionalNotes: additionalNotes || "",
      calendlyBooked: Boolean(calendlyBooked),
      timestamp: timestamp || new Date().toISOString(),
      source: source || "meta-ads",
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
    }

    // Store in Notion database
    try {
      const notionKey = process.env.NOTION_API_KEY;
      const notionDbId = process.env.NOTION_LEADS_DB_ID;

      if (notionKey && notionDbId) {
        const adSpendMap: Record<string, string> = {
          "less-than-1k": "Less than 1k",
          "1k-3k": "1k-3k",
          "3k-10k": "3k-10k",
          "10k-plus": "10k+",
          "not-running": "Not running ads",
        };

        await fetch("https://api.notion.com/v1/pages", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${notionKey}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parent: { database_id: notionDbId },
            properties: {
              Name: { title: [{ text: { content: firstName || "" } }] },
              Email: { email: email || null },
              Website: { url: website && website.startsWith("http") ? website : website ? `https://${website}` : null },
              "Ad Spend": adSpend ? { select: { name: adSpendMap[adSpend] || adSpend } } : undefined,
              Challenge: { rich_text: [{ text: { content: challenge || "" } }] },
              Qualified: { checkbox: Boolean(qualified) },
              "Account Access Granted": { checkbox: Boolean(accessGranted) },
              "Additional Notes": { rich_text: [{ text: { content: additionalNotes || "" } }] },
              "Calendly Booked": { checkbox: Boolean(calendlyBooked) },
              Source: { select: { name: "Landing Page" } },
              Status: { select: { name: Boolean(qualified) ? (Boolean(calendlyBooked) ? "Audit Booked" : "New Lead") : "Disqualified" } },
              "Submitted At": { date: { start: timestamp || new Date().toISOString() } },
            },
          }),
        });
      }
    } catch (notionError) {
      console.error("Notion storage error:", notionError);
    }

    // Send Meta CAPI event if qualified lead
    if (qualified && !calendlyBooked) {
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
              value: 100,
              currency: "GBP",
            },
          }),
        });
      } catch (capiError) {
        console.error("CAPI error (non-blocking):", capiError);
      }
    }

    // Send Discord notification to #landing-leads
    try {
      await sendDiscordNotification(leadData);
    } catch (discordError) {
      console.error("Discord notification error:", discordError);
    }

    // Send confirmation email if Calendly booking confirmed
    if (calendlyBooked) {
      try {
        const webhookUrl = process.env.LANDING_WEBHOOK_URL;
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "confirmation_email",
              to: email,
              subject: "Your FREE Root Social audit is confirmed",
              body: [
                `Hi ${firstName},`,
                ``,
                `Thank you for booking your FREE audit call with Root Social!`,
                ``,
                `We're looking forward to speaking with you. Before we meet, a quick reminder:`,
                ``,
                `🔑 Please make sure you've granted view-only access to your Meta ad account for rootsocialgeneral@gmail.com  -  this allows us to review your account before the call so we come prepared with specific recommendations.`,
                ``,
                `What to expect:`,
                `• We'll review your ad account thoroughly before we speak`,
                `• We'll come prepared with specific, actionable recommendations`,
                `• You'll walk away knowing exactly what to change`,
                ``,
                `If you have any questions before the call, reply to this email.`,
                ``,
                `Looking forward to it,`,
                `Max & the Root Social team`,
              ].join("\n"),
              ...leadData,
              kvKey: key,
            }),
          });
        }
      } catch (emailError) {
        console.error("Confirmation email error:", emailError);
      }
    }

    // Send to webhook if configured (standard lead)
    if (!calendlyBooked) {
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
      }
    }

    // Send notification via proactive API (MC)
    try {
      const qualTag = qualified ? "QUALIFIED" : "Disqualified";
      const bookedNote = calendlyBooked ? " | Calendly BOOKED" : "";
      const msg = `NEW LEAD from landing page! ${qualTag}${bookedNote} - ${firstName} (${email}) - Spend: ${adSpend || "N/A"} - Challenge: ${challenge || "N/A"}`;
      await fetch("https://root-social-os.vercel.app/api/proactive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mc-secret": "mc-proactive-2026",
        },
        body: JSON.stringify({
          message: msg,
          agentId: "main",
          priority: "high",
        }),
      });
    } catch (notifyError) {
      console.error("Notification error:", notifyError);
    }

    return NextResponse.json({ success: true, key, eventId });
  } catch (error) {
    console.error("Submit lead error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
