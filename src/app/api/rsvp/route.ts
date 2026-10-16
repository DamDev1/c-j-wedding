import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, reply, plusOneName, message } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Guest name is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (reply !== "accept" && reply !== "decline") {
      return NextResponse.json(
        { error: "Reply must be either 'accept' or 'decline'." },
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
    const guestEmail = email.trim();
    const cleanPlusOne = plusOneName?.trim();
    const cleanMessage = message?.trim();

    // ----------------------------------------------------
    // 1. Notification Email for Couple / Organizers
    // ----------------------------------------------------
    const adminSubject = `Wedding RSVP: ${guestName} (${isAttending ? "Joyfully Accepts" : "Regretfully Declines"})`;

    const adminTextContent = [
      `New RSVP Submission for Chioma & John's Wedding:`,
      ``,
      `Guest Name: ${guestName}`,
      `Guest Email: ${guestEmail}`,
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
                  <td style="padding: 8px 0; color: #6b6b6b; width: 130px; vertical-align: top; font-weight: 500;">Guest Name:</td>
                  <td style="padding: 8px 0; color: #1b1511; font-weight: 700; font-size: 17px;">${escapeHtml(
                    guestName
                  )}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b6b6b; vertical-align: top; font-weight: 500;">Guest Email:</td>
                  <td style="padding: 8px 0; color: #1b1511; font-weight: 600;">
                    <a href="mailto:${escapeHtml(guestEmail)}" style="color: #2f6f0f; text-decoration: none;">
                      ${escapeHtml(guestEmail)}
                    </a>
                  </td>
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
    // 2. Confirmation Email for the Guest
    // ----------------------------------------------------
    const guestSubject = isAttending
      ? "RSVP Confirmation: See you at Chioma & John's Wedding!"
      : "RSVP Confirmation: Chioma & John's Wedding";

    const guestTextContent = [
      `Dear ${guestName},`,
      ``,
      isAttending
        ? `Thank you so much for RSVPing! We are delighted to confirm that we have received your RSVP and cannot wait to celebrate our wedding day with you.`
        : `Thank you for letting us know that you won't be able to join us for our wedding celebration. You will be dearly missed, and we appreciate your thoughtful wishes.`,
      ``,
      `Your RSVP Summary:`,
      `- Guest: ${guestName}`,
      `- Reply: ${isAttending ? "Joyfully Accepts" : "Regretfully Declines"}`,
      cleanPlusOne
        ? `- Plus-One: ${cleanPlusOne} (Pending confirmation — your plus-one is confirmed once you hear from us)`
        : null,
      cleanMessage ? `- Your Message: "${cleanMessage}"` : null,
      ``,
      `If you have any questions or need to update your RSVP, please feel free to reply directly to this email.`,
      ``,
      `With love,`,
      `Chioma & John`,
    ]
      .filter(Boolean)
      .join("\n");

    const guestHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${guestSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1b1511;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f5f0; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 2px solid #c09b5e; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background-color: #2f6f0f; padding: 32px 32px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #ffffff; font-weight: normal; letter-spacing: 1px;">
                Chioma &amp; John
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #e4eedb; text-transform: uppercase; letter-spacing: 2px;">
                Wedding RSVP Confirmation
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 22px; color: #2f6f0f; text-align: center; font-weight: normal;">
                ${
                  isAttending
                    ? "We Can&rsquo;t Wait to Celebrate with You!"
                    : "Thank You for Letting Us Know"
                }
              </h2>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #3b332b;">
                Dear <strong>${escapeHtml(guestName)}</strong>,
              </p>

              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: #3b332b;">
                ${
                  isAttending
                    ? "Thank you so much for RSVPing! We are delighted to confirm that we have received your response and are so excited to celebrate our special day together."
                    : "Thank you for letting us know that you won&rsquo;t be able to make it to our wedding celebration. While you will be dearly missed, we truly appreciate your love, support, and warm wishes."
                }
              </p>

              <!-- Status Badge -->
              <div style="text-align: center; margin: 24px 0;">
                <span style="display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; ${
                  isAttending
                    ? "background-color: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;"
                    : "background-color: #fbe9e7; color: #c62828; border: 1px solid #ffcdd2;"
                }">
                  ${isAttending ? "✓ Joyfully Accepts" : "✕ Regretfully Declines"}
                </span>
              </div>

              <!-- Summary Card -->
              <div style="background-color: #fdfbf7; border: 1px solid #e7dfcf; border-radius: 8px; padding: 20px 24px; margin: 24px 0;">
                <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #705828; margin-bottom: 14px; border-bottom: 1px solid #ebe5d8; padding-bottom: 8px;">
                  Your RSVP Details
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 15px; line-height: 1.6;">
                  <tr>
                    <td style="padding: 6px 0; color: #6b6b6b; width: 120px; vertical-align: top; font-weight: 500;">Guest:</td>
                    <td style="padding: 6px 0; color: #1b1511; font-weight: 600;">${escapeHtml(
                      guestName
                    )}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #6b6b6b; vertical-align: top; font-weight: 500;">Response:</td>
                    <td style="padding: 6px 0; color: ${
                      isAttending ? "#2f6f0f" : "#8c2d19"
                    }; font-weight: 600;">
                      ${
                        isAttending
                          ? "Joyfully Accepts"
                          : "Regretfully Declines"
                      }
                    </td>
                  </tr>
                  ${
                    cleanPlusOne
                      ? `
                  <tr>
                    <td style="padding: 6px 0; color: #6b6b6b; vertical-align: top; font-weight: 500;">Plus-One:</td>
                    <td style="padding: 6px 0; color: #1b1511; font-weight: 600;">
                      ${escapeHtml(cleanPlusOne)}
                      <div style="font-size: 12px; color: #705828; font-weight: normal; margin-top: 2px;">
                        (Your plus-one is only confirmed once you hear from us)
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
                    <td style="padding: 12px 0 4px 0; color: #6b6b6b; vertical-align: top; font-weight: 500;" colspan="2">
                      Your note for the couple:
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 0 0 4px 0;">
                      <div style="background-color: #ffffff; border-left: 3px solid #c09b5e; padding: 12px 16px; border-radius: 4px; font-style: italic; color: #3b332b;">
                        &ldquo;${escapeHtml(cleanMessage)}&rdquo;
                      </div>
                    </td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>

              <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 1.6; color: #6b6b6b; text-align: center;">
                Need to update your response or have a question? Reply directly to this email to reach us.
              </p>

              <!-- Closing -->
              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #ebe5d8; text-align: center;">
                <p style="margin: 0; font-family: Georgia, serif; font-size: 18px; color: #2f6f0f; font-style: italic;">
                  With love,
                </p>
                <p style="margin: 4px 0 0 0; font-family: Georgia, serif; font-size: 20px; color: #1b1511; font-weight: bold;">
                  Chioma &amp; John
                </p>
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
    // 3. Send both emails via Resend
    // ----------------------------------------------------
    const [adminEmailResult, guestEmailResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        replyTo: guestEmail,
        subject: adminSubject,
        text: adminTextContent,
        html: adminHtmlContent,
      }),
      resend.emails.send({
        from: fromEmail,
        to: guestEmail,
        subject: guestSubject,
        text: guestTextContent,
        html: guestHtmlContent,
      }),
    ]);

    if (adminEmailResult.error) {
      console.error("Resend admin notification error:", adminEmailResult.error);
    }
    if (guestEmailResult.error) {
      console.error("Resend guest confirmation error:", guestEmailResult.error);
    }

    if (adminEmailResult.error && guestEmailResult.error) {
      return NextResponse.json(
        {
          error:
            adminEmailResult.error.message ||
            "Failed to send RSVP email notification.",
        },
        { status: 500 }
      );
    }

    if (adminEmailResult.error) {
      return NextResponse.json(
        {
          error:
            adminEmailResult.error.message ||
            "Failed to notify wedding hosts. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      adminEmailId: adminEmailResult.data?.id,
      guestEmailId: guestEmailResult.data?.id,
      guestEmailSent: !guestEmailResult.error,
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
