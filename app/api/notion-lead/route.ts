import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      website,
      adSpend,
      challenge,
      source,
      platform,
      status,
      notes,
      replyDate,
      callDate,
      bobReply,
    } = body;

    const notionKey = process.env.NOTION_API_KEY;
    const notionDbId = process.env.NOTION_LEADS_DB_ID;

    if (!notionKey || !notionDbId) {
      return NextResponse.json({ error: "Notion not configured" }, { status: 500 });
    }

    // Auth check - simple shared secret
    const authHeader = request.headers.get("x-api-secret");
    if (authHeader !== process.env.LANDING_WEBHOOK_URL && authHeader !== "mc-proactive-2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const properties: Record<string, unknown> = {
      Name: { title: [{ text: { content: name || "" } }] },
    };

    if (email) properties.Email = { email };
    if (website) properties.Website = { url: website.startsWith("http") ? website : `https://${website}` };
    if (adSpend) properties["Ad Spend"] = { select: { name: adSpend } };
    if (challenge) properties.Challenge = { rich_text: [{ text: { content: challenge } }] };
    if (source) properties.Source = { select: { name: source } };
    if (platform) properties.Platform = { select: { name: platform } };
    if (status) properties.Status = { select: { name: status } };
    if (notes) properties.Notes = { rich_text: [{ text: { content: notes } }] };
    if (bobReply !== undefined) properties["Bob Reply"] = { checkbox: Boolean(bobReply) };
    if (replyDate) properties["Reply Date"] = { date: { start: replyDate } };
    if (callDate) properties["Call Date"] = { date: { start: callDate } };
    properties["Submitted At"] = { date: { start: new Date().toISOString() } };

    const resp = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: notionDbId },
        properties,
      }),
    });

    const result = await resp.json();

    if (!resp.ok) {
      console.error("Notion API error:", result);
      return NextResponse.json({ error: "Notion API error", details: result }, { status: resp.status });
    }

    return NextResponse.json({ success: true, pageId: result.id });
  } catch (error) {
    console.error("Notion lead error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
