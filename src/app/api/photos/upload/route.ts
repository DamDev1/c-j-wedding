import { NextRequest } from "next/server";
import cloudinary, { PHOTOS_FOLDER } from "@/lib/cloudinary";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("photos") as File[];

    if (!files.length) {
      return Response.json({ error: "No files provided." }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return Response.json(
        { error: `You can upload a maximum of ${MAX_FILES} photos at once.` },
        { status: 400 }
      );
    }

    // Validate each file
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return Response.json(
          { error: `"${file.name}" is not a supported image type. Use JPEG, PNG, WebP, or HEIC.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return Response.json(
          { error: `"${file.name}" exceeds the 10 MB file size limit.` },
          { status: 400 }
        );
      }
    }

    // Upload each file to Cloudinary
    const results = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise<{ public_id: string; secure_url: string; width: number; height: number }>(
          (resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: PHOTOS_FOLDER,
                resource_type: "image",
                transformation: [
                  { quality: "auto:good", fetch_format: "auto" },
                ],
              },
              (error, result) => {
                if (error || !result) return reject(error ?? new Error("Upload failed"));
                resolve({
                  public_id: result.public_id,
                  secure_url: result.secure_url,
                  width: result.width,
                  height: result.height,
                });
              }
            );
            stream.end(buffer);
          }
        );
      })
    );

    return Response.json({ uploaded: results, count: results.length });
  } catch (err) {
    console.error("Upload error:", err);
    return Response.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
