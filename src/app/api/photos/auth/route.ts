import { NextRequest } from "next/server";

const ADMIN_PASSWORD = process.env.GALLERY_ADMIN_PASSWORD ?? "johnlovechioma2026";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (password === ADMIN_PASSWORD) {
      return Response.json({ success: true });
    }

    return Response.json({ error: "Invalid password. Please try again." }, { status: 401 });
  } catch (err) {
    console.error("Auth error:", err);
    return Response.json({ error: "Authentication failed." }, { status: 500 });
  }
}
