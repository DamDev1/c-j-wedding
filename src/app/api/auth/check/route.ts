import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { deviceId } = body;

    const cookieStore = await cookies();
    const guestCookie = cookieStore.get("wedding_guest_access")?.value;

    if (!deviceId && !guestCookie) {
      return NextResponse.json({ authenticated: false });
    }

    const db = await getDatabase();
    const guests = db.collection("guests");

    // 1. If cookie is present (format: "phone:deviceId")
    if (guestCookie) {
      const [cookiePhone, cookieDeviceId] = guestCookie.split(":");
      if (cookiePhone && cookieDeviceId) {
        const guest = await guests.findOne({
          phone: cookiePhone,
          deviceId: cookieDeviceId,
          isUsed: true,
        });

        if (guest) {
          return NextResponse.json({
            authenticated: true,
            phone: guest.phone,
          });
        }
      }
    }

    // 2. If deviceId is passed directly from client localStorage
    if (deviceId && typeof deviceId === "string") {
      const guest = await guests.findOne({
        deviceId: deviceId.trim(),
        isUsed: true,
      });

      if (guest) {
        const response = NextResponse.json({
          authenticated: true,
          phone: guest.phone,
        });

        // Re-issue cookie if missing
        response.cookies.set("wedding_guest_access", `${guest.phone}:${guest.deviceId}`, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 60,
        });

        return response;
      }
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error("Error in /api/auth/check:", error);
    return NextResponse.json({ authenticated: false });
  }
}
