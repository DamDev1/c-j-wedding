import { NextRequest } from "next/server";
import cloudinary, { PHOTOS_FOLDER } from "@/lib/cloudinary";

const ADMIN_PASSWORD = process.env.GALLERY_ADMIN_PASSWORD ?? "johnlovechioma2026";

export async function GET(req: NextRequest) {
  try {
    const password = req.headers.get("x-admin-password");
    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: "Unauthorised." }, { status: 401 });
    }

    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: PHOTOS_FOLDER,
      max_results: 500,
      resource_type: "image",
    });

    const photos = result.resources.map(
      (r: { public_id: string; secure_url: string; width: number; height: number; created_at: string }) => ({
        public_id: r.public_id,
        secure_url: r.secure_url,
        width: r.width,
        height: r.height,
        created_at: r.created_at,
      })
    );

    return Response.json({ photos, total: photos.length });
  } catch (err) {
    console.error("Fetch photos error:", err);
    return Response.json({ error: "Failed to fetch photos." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const password = req.headers.get("x-admin-password");
    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: "Unauthorised." }, { status: 401 });
    }

    const { public_id } = await req.json();
    if (!public_id) {
      return Response.json({ error: "No photo ID provided." }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "image",
    });

    if (result.result !== "ok" && result.result !== "not found") {
      return Response.json(
        { error: "Failed to delete photo from Cloudinary.", detail: result },
        { status: 400 }
      );
    }

    return Response.json({ success: true, deleted: public_id });
  } catch (err) {
    console.error("Delete photo error:", err);
    return Response.json({ error: "Delete failed." }, { status: 500 });
  }
}

