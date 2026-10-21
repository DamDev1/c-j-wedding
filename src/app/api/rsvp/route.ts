import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { getDatabase } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceIdParam = searchParams.get("deviceId");

    const cookieStore = await cookies();
    const guestCookie = cookieStore.get("wedding_guest_access")?.value;

    if (!guestCookie && !deviceIdParam) {
      return NextResponse.json({ authenticated: false, hasRsvped: false });
    }

    const db = await getDatabase();
    const guests = db.collection("guests");

    let guest = null;

    if (guestCookie) {
      const [cookiePhone, cookieDeviceId] = guestCookie.split(":");
      if (cookiePhone && cookieDeviceId) {
        guest = await guests.findOne({
          phone: cookiePhone,
          deviceId: cookieDeviceId,
          isUsed: true,
        });
      }
    }

    if (!guest && deviceIdParam) {
      guest = await guests.findOne({
        deviceId: deviceIdParam.trim(),
        isUsed: true,
      });
    }

    if (!guest) {
      return NextResponse.json({ authenticated: false, hasRsvped: false });
    }

    return NextResponse.json({
      authenticated: true,
      phone: guest.phone,
      hasRsvped: Boolean(guest.hasRsvped),
      reply: guest.rsvpReply || null,
      name: guest.rsvpName || null,
    });
  } catch (error) {
    console.error("Error in GET /api/rsvp:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVP status." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, reply, plusOneName, message, deviceId } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Guest name is required." },
        { status: 400 }
      );
    }

    if (reply !== "accept" && reply !== "decline") {
      return NextResponse.json(
        { error: "Reply must be either 'accept' or 'decline'." },
        { status: 400 }
      );
    }

    // Identify authenticated guest
    const cookieStore = await cookies();
    const guestCookie = cookieStore.get("wedding_guest_access")?.value;

    const db = await getDatabase();
    const guests = db.collection("guests");

    let guest = null;

    if (guestCookie) {
      const [cookiePhone, cookieDeviceId] = guestCookie.split(":");
      if (cookiePhone && cookieDeviceId) {
        guest = await guests.findOne({
          phone: cookiePhone,
          deviceId: cookieDeviceId,
          isUsed: true,
        });
      }
    }

    if (!guest && deviceId && typeof deviceId === "string") {
      guest = await guests.findOne({
        deviceId: deviceId.trim(),
        isUsed: true,
      });
    }

    if (!guest) {
      return NextResponse.json(
        {
          error:
            "Please unlock the invitation with your phone number before submitting an RSVP.",
        },
        { status: 401 }
      );
    }

    // Check if this guest phone number has already submitted an RSVP
    if (guest.hasRsvped) {
      return NextResponse.json(
        {
          error: "You have already submitted your RSVP.",
          hasRsvped: true,
          reply: guest.rsvpReply,
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Missing RESEND_API_KEY in environment variables.");
      return NextResponse.json(
        {
          error:
            "Email service is not configured. Please set RESEND_API_KEY.",
        },
        { status: 500 }
      );
    }

    const recipientEmail =
      process.env.RSVP_RECIPIENT_EMAIL ||
      process.env.RESEND_TO_EMAIL;

    if (!recipientEmail) {
      console.error("Missing RSVP_RECIPIENT_EMAIL in environment variables.");
      return NextResponse.json(
        {
          error:
            "Recipient email is not configured. Please set RSVP_RECIPIENT_EMAIL.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "Wedding RSVP <onboarding@resend.dev>";

    const isAttending = reply === "accept";
    const guestName = name.trim();
    const cleanPlusOne = plusOneName?.trim();
    const cleanMessage = message?.trim();

    // ----------------------------------------------------
    // Record RSVP in MongoDB for this guest (prevents duplicate RSVP)
    // ----------------------------------------------------
    await guests.updateOne(
      { _id: guest._id },
      {
        $set: {
          hasRsvped: true,
          rsvpReply: reply,
          rsvpName: guestName,
          rsvpPlusOne: cleanPlusOne || null,
          rsvpMessage: cleanMessage || null,
          rsvpSubmittedAt: new Date(),
        },
      }
    );

    // ----------------------------------------------------
    // Notification Email for Couple / Organizers
    // ----------------------------------------------------
    const adminSubject = `Wedding RSVP: ${guestName} (${isAttending ? "Joyfully Accepts" : "Regretfully Declines"})`;

    const adminTextContent = [
      `New RSVP Submission for Chioma & John's Wedding:`,
      ``,
      `Guest Name: ${guestName}`,
      `Verified Phone: ${guest.phone}`,
      `Reply: ${isAttending ? "Joyfully Accepts" : "Regretfully Declines"}`,
      cleanPlusOne ? `Plus-One: ${cleanPlusOne} (Pending confirmation)` : null,
      cleanMessage ? `Personal Message: "${cleanMessage}"` : null,
      ``,
      `Submitted at: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} (ET)`,
    ]
      .filter(Boolean)
      .join("\n");

    const adminHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${adminSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1b1511;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f5f0; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 2px solid #c09b5e; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background-color: #2f6f0f; padding: 28px 32px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; color: #ffffff; font-weight: normal; letter-spacing: 1px;">
                Chioma &amp; John
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #e4eedb; text-transform: uppercase; letter-spacing: 2px;">
                Wedding RSVP Notification
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <div style="text-align: center; margin-bottom: 28px;">
                <span style="display: inline-block; padding: 8px 18px; border-radius: 20px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; ${
                  isAttending
                    ? "background-color: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;"
                    : "background-color: #fbe9e7; color: #c62828; border: 1px solid #ffcdd2;"
                }">
                  ${isAttending ? "✓ Joyfully Accepts" : "✕ Regretfully Declines"}
                </span>
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 15px; line-height: 1.6;">
                <tr>
                  <td style="padding: 8px 0; color: #6b6b6b; width: 140px; vertical-align: top; font-weight: 500;">Guest Name:</td>
                  <td style="padding: 8px 0; color: #1b1511; font-weight: 700; font-size: 17px;">${escapeHtml(
                    guestName
                  )}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b6b6b; vertical-align: top; font-weight: 500;">Phone Number:</td>
                  <td style="padding: 8px 0; color: #1b1511; font-weight: 600;">${escapeHtml(
                    guest.phone
                  )}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b6b6b; vertical-align: top; font-weight: 500;">RSVP Status:</td>
                  <td style="padding: 8px 0; color: ${
                    isAttending ? "#2f6f0f" : "#8c2d19"
                  }; font-weight: 600;">
                    ${
                      isAttending
                        ? "Attending the celebration"
                        : "Declined invitation"
                    }
                  </td>
                </tr>
                ${
                  cleanPlusOne
                    ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b6b6b; vertical-align: top; font-weight: 500;">Plus-One:</td>
                  <td style="padding: 8px 0; color: #1b1511; font-weight: 600;">
                    ${escapeHtml(cleanPlusOne)}
                    <div style="font-size: 12px; color: #705828; font-weight: normal; margin-top: 2px;">
                      (Subject to confirmation)
                    </div>
                  </td>
                </tr>
                `
                    : ""
                }
                ${
                  cleanMessage
                    ? `
                <tr>
                  <td style="padding: 16px 0 8px 0; color: #6b6b6b; vertical-align: top; font-weight: 500;" colspan="2">
                    Message for the couple:
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 0 0 8px 0;">
                    <div style="background-color: #fdfbf7; border-left: 3px solid #c09b5e; padding: 14px 18px; border-radius: 4px; font-style: italic; color: #3b332b;">
                      &ldquo;${escapeHtml(cleanMessage)}&rdquo;
                    </div>
                  </td>
                </tr>
                `
                    : ""
                }
              </table>

              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #ebe5d8; text-align: center; color: #9a9489; font-size: 13px;">
                Received on ${new Date().toLocaleString("en-US", {
                  dateStyle: "full",
                  timeStyle: "short",
                  timeZone: "America/New_York",
                })} ET
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // ----------------------------------------------------
    // Send email to organizers via Resend
    // ----------------------------------------------------
    const adminEmailResult = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: adminSubject,
      text: adminTextContent,
      html: adminHtmlContent,
    });

    if (adminEmailResult.error) {
      console.error("Resend admin notification error:", adminEmailResult.error);
    }

    return NextResponse.json({
      success: true,
      hasRsvped: true,
      reply,
      adminEmailId: adminEmailResult?.data?.id,
    });
  } catch (err) {
    console.error("Error in /api/rsvp:", err);
    return NextResponse.json(
      { error: "Internal server error occurred while processing RSVP." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
