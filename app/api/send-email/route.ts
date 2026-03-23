import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "maxrootsocial@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, firstName, subject, bodyLines } = body as {
      to: string;
      firstName?: string;
      subject: string;
      bodyLines: string[];
    };

    if (!to || !subject || !bodyLines) {
      return NextResponse.json({ error: "Missing required fields: to, subject, bodyLines" }, { status: 400 });
    }

    const htmlBody = bodyLines
      .map((line: string) => {
        if (line === "") return "<br />";
        if (line.startsWith("•")) return `<p style="margin:4px 0;padding-left:16px;">${line}</p>`;
        return `<p style="margin:8px 0;">${line}</p>`;
      })
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#0A0A0A;padding:28px 40px;text-align:center;">
              <img src="https://get.root-social.com/logo.png" alt="Root Social" width="48" height="48" style="display:inline-block;" />
              <p style="color:#ffffff;font-size:18px;font-weight:700;margin:12px 0 0;letter-spacing:-0.3px;">Root Social</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;color:#1a1a1a;font-size:15px;line-height:1.7;">
              ${htmlBody}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #ebebeb;text-align:center;">
              <p style="font-size:12px;color:#888;margin:0;">Root Social LTD &bull; Kidderminster, Worcestershire, UK</p>
              <p style="font-size:12px;color:#888;margin:6px 0 0;">
                <a href="https://get.root-social.com/privacy" style="color:#888;text-decoration:underline;">Privacy Policy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    await transporter.sendMail({
      from: `"Root Social" <${process.env.GMAIL_USER || "maxrootsocial@gmail.com"}>`,
      to,
      subject,
      html,
      text: bodyLines.join("\n"),
    });

    console.log(`[send-email] Sent to ${to}: ${subject}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[send-email] Error:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
