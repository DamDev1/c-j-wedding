"use client";

import { useRef, useState, type ChangeEvent } from "react";

const MAX_FILES = 10;

interface UploadResult {
  public_id: string;
  secure_url: string;
}

export function PhotoUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // 0–100
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setError("");
    setSuccess("");
    const selected = Array.from(e.target.files ?? []);

    if (selected.length > MAX_FILES) {
      setError(`Please select at most ${MAX_FILES} photos.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setFiles(selected);
    // Generate local previews
    const urls = selected.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  }

  function clearSelection() {
    setPreviews((prev) => {
      prev.forEach(URL.revokeObjectURL);
      return [];
    });
    setFiles([]);
    setError("");
    setSuccess("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleUpload() {
    if (!files.length) return;

    setUploading(true);
    setError("");
    setSuccess("");
    setProgress(0);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("photos", f));

      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        setUploading(false);
        return;
      }

      setProgress(100);
      setSuccess(
        `${(data as { uploaded: UploadResult[] }).uploaded.length} photo${(data as { uploaded: UploadResult[] }).uploaded.length === 1 ? "" : "s"} uploaded successfully! Thank you 💚`
      );
      clearSelection();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-8">
      {/* File input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="photo-input"
      />

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="mb-5">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden rounded-lg border border-gold/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-olive/60">
            {files.length} photo{files.length === 1 ? "" : "s"} selected
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col items-center gap-3">
        {files.length === 0 ? (
          <label
            htmlFor="photo-input"
            className="inline-flex cursor-pointer items-center justify-center rounded-[30px] bg-olive px-10 py-3 text-base font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Choose photos
          </label>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={clearSelection}
              disabled={uploading}
              className="inline-flex items-center justify-center rounded-[30px] border border-olive/40 px-6 py-3 text-base font-semibold text-olive transition duration-300 hover:bg-olive/5 disabled:opacity-50"
            >
              Clear
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center justify-center rounded-[30px] bg-olive px-10 py-3 text-base font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
        )}
      </div>

      {/* Upload progress bar */}
      {uploading && (
        <div className="mx-auto mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-olive/15">
          <div
            className="h-full rounded-full bg-olive transition-all duration-500"
            style={{ width: `${Math.max(progress, 15)}%` }}
          />
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="mx-auto mt-4 max-w-sm rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mx-auto mt-4 max-w-sm rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          {success}
        </div>
      )}
    </div>
  );
}
