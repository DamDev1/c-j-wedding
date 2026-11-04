import { NextRequest } from "next/server";
import cloudinary from "@/lib/cloudinary";

const ADMIN_PASSWORD = process.env.GALLERY_ADMIN_PASSWORD ?? "johnlovechioma2026";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    // Check admin password from header
    const password = req.headers.get("x-admin-password");
    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: "Unauthorised." }, { status: 401 });
    }

    const { publicId } = await params;

    // The publicId comes URL-encoded and uses -- as separator (since / is not valid in URL segments)
    // e.g. "cj-wedding-photos--abc123" => "cj-wedding-photos/abc123"
    const decodedId = decodeURIComponent(publicId).replace(/--/g, "/");

    const result = await cloudinary.uploader.destroy(decodedId, {
      resource_type: "image",
    });

    if (result.result !== "ok") {
      return Response.json(
        { error: "Failed to delete photo.", detail: result },
        { status: 400 }
      );
    }

    return Response.json({ deleted: decodedId });
  } catch (err) {
    console.error("Delete photo error:", err);
    return Response.json({ error: "Delete failed." }, { status: 500 });
  }
}
