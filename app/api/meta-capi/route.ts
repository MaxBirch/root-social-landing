import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

interface UserData {
  email?: string;
  firstName?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
}

interface CapiEventData {
  eventName: string;
  eventTime: number;
  userData: UserData;
  eventId?: string;
  actionSource?: string;
  customData?: Record<string, unknown>;
}

function hashData(value: string): string {
  return createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

function formatUserData(userData: UserData) {
  const formatted: Record<string, string> = {};
  
  if (userData.email) {
    formatted.em = hashData(userData.email);
  }
  if (userData.firstName) {
    formatted.fn = hashData(userData.firstName);
  }
  if (userData.clientIp) {
    formatted.client_ip_address = userData.clientIp;
  }
  if (userData.userAgent) {
    formatted.client_user_agent = userData.userAgent;
  }
  if (userData.fbp) {
    formatted.fbp = userData.fbp;
  }
  if (userData.fbc) {
    formatted.fbc = userData.fbc;
  }

  return formatted;
}

export async function POST(request: NextRequest) {
  try {
    const body: CapiEventData = await request.json();
    
    // Validate required fields
    if (!body.eventName || !body.eventTime) {
      return NextResponse.json({ error: "Missing eventName or eventTime" }, { status: 400 });
    }

    // If no access token configured, skip CAPI silently (graceful fallback)
    if (!ACCESS_TOKEN || !PIXEL_ID || PIXEL_ID === "PLACEHOLDER") {
      console.log("Meta CAPI: No access token or pixel ID configured, skipping CAPI event");
      return NextResponse.json({ 
        success: true, 
        message: "CAPI not configured, event skipped",
        pixelOnly: true 
      });
    }

    // Format user data with proper hashing
    const formattedUserData = formatUserData(body.userData);

    // Prepare the event payload
    const eventData: Record<string, any> = {
      event_name: body.eventName,
      event_time: body.eventTime,
      user_data: formattedUserData,
      action_source: body.actionSource || "website",
    };

    // Add event_id for deduplication if provided
    if (body.eventId) {
      eventData.event_id = body.eventId;
    }

    // Add custom data if provided
    if (body.customData) {
      eventData.custom_data = body.customData;
    }

    const payload = {
      data: [eventData],
      test_event_code: process.env.NODE_ENV === "development" ? "TEST12345" : undefined,
    };

    // Send to Meta Conversions API
    const response = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Meta CAPI error:", result);
      return NextResponse.json({ 
        success: false, 
        error: "CAPI request failed", 
        details: result 
      }, { status: response.status });
    }

    console.log("Meta CAPI event sent successfully:", body.eventName, body.eventId);
    
    return NextResponse.json({ 
      success: true, 
      message: "CAPI event sent successfully",
      metaResponse: result 
    });

  } catch (error) {
    console.error("Meta CAPI endpoint error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}