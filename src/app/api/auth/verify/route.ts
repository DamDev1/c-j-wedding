import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { normalizePhoneNumber } from "@/data/whitelisted-numbers";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { phone, deviceId } = body;

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Please enter your phone number." },
        { status: 400 }
      );
    }

    if (!deviceId || typeof deviceId !== "string" || !deviceId.trim()) {
      return NextResponse.json(
        { error: "Device identifier is missing. Please refresh and try again." },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhoneNumber(phone.trim());

    if (normalizedPhone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const guests = db.collection("guests");

    // 1. Look up the phone number in MongoDB
    const guest = await guests.findOne({ phone: normalizedPhone });

    if (!guest) {
      return NextResponse.json(
        {
          error:
            "This phone number is not on the guest list. Please make sure you entered the number on your invitation.",
        },
        { status: 404 }
      );
    }

    // 2. Check if the number has already been used on a device
    if (guest.isUsed) {
      if (guest.deviceId === deviceId.trim()) {
        // Same device returning
        const response = NextResponse.json({
          success: true,
          message: "Welcome back!",
          phone: normalizedPhone,
        });

        // Set secure cookie valid for 60 days
        response.cookies.set("wedding_guest_access", `${normalizedPhone}:${deviceId.trim()}`, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 60,
        });

        return response;
      } else {
        // Attempt from a DIFFERENT device
        return NextResponse.json(
          {
            error:
              "This phone number has already been used on another device.",
            code: "ALREADY_USED_ON_ANOTHER_DEVICE",
          },
          { status: 403 }
        );
      }
    }

    // 3. First time use: bind this phone number to this device
    const updateResult = await guests.findOneAndUpdate(
      { phone: normalizedPhone, isUsed: false },
      {
        $set: {
          isUsed: true,
          deviceId: deviceId.trim(),
          usedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!updateResult) {
      // Handled concurrent race condition
      return NextResponse.json(
        {
          error:
            "This phone number has already been used on another device.",
        },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Invitation unlocked! Welcome.",
      phone: normalizedPhone,
    });

    response.cookies.set("wedding_guest_access", `${normalizedPhone}:${deviceId.trim()}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 60,
    });

    return response;
  } catch (error: unknown) {
    console.error("Error in /api/auth/verify:", error);
    const message =
      error instanceof Error && error.message.includes("MONGODB_URI")
        ? "Database connection is not configured yet. Please add MONGODB_URI to .env.local."
        : "Failed to verify phone number. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
