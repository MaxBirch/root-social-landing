import { NextRequest, NextResponse } from "next/server";

const ADMIN_SECRET = process.env.LEADS_ADMIN_SECRET || "rs-leads-2026";

export async function GET(request: NextRequest) {
  // Simple auth check
  const auth = request.headers.get("x-admin-secret") || request.nextUrl.searchParams.get("secret");
  if (auth !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) {
    return NextResponse.json({ error: "KV not configured" }, { status: 500 });
  }

  try {
    // Get all lead keys
    const formLeadsRes = await fetch(`${kvUrl}/keys/landing:leads:*`, {
      headers: { Authorization: `Bearer ${kvToken}` },
    });
    const formLeadsKeys = await formLeadsRes.json();

    const exitLeadsRes = await fetch(`${kvUrl}/keys/landing:exit-leads:*`, {
      headers: { Authorization: `Bearer ${kvToken}` },
    });
    const exitLeadsKeys = await exitLeadsRes.json();

    // Fetch all leads data
    const allKeys = [
      ...(formLeadsKeys.result || []).map((k: string) => ({ key: k, type: "form" })),
      ...(exitLeadsKeys.result || []).map((k: string) => ({ key: k, type: "exit-intent" })),
    ];

    const leads = [];
    for (const { key, type } of allKeys) {
      try {
        const res = await fetch(`${kvUrl}/get/${key}`, {
          headers: { Authorization: `Bearer ${kvToken}` },
        });
        const data = await res.json();
        if (data.result) {
          const parsed = typeof data.result === "string" ? JSON.parse(data.result) : data.result;
          leads.push({ ...parsed, kvKey: key, leadType: type });
        }
      } catch {
        // Skip individual fetch errors
      }
    }

    // Sort by timestamp descending (newest first)
    leads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      total: leads.length,
      formLeads: leads.filter(l => l.leadType === "form").length,
      exitIntentLeads: leads.filter(l => l.leadType === "exit-intent").length,
      qualifiedLeads: leads.filter(l => l.qualified === true).length,
      leads,
    });
  } catch (error) {
    console.error("Leads API error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
