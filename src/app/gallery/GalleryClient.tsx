"use client";

import { useEffect, useState, useRef, FormEvent, TouchEvent } from "react";
import Link from "next/link";
import { FloralFrame } from "@/components/Decoration";

interface Photo {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  created_at: string;
}

export function GalleryClient() {
  const [password, setPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Lightbox state
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Check saved session on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("cj_gallery_auth");
    if (stored) {
      setSavedPassword(stored);
      setIsAuthenticated(true);
      fetchPhotos(stored);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Keyboard navigation for Lightbox (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (activePhotoIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActivePhotoIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActivePhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      } else if (e.key === "ArrowRight") {
        setActivePhotoIndex((prev) =>
          prev !== null && prev < photos.length - 1 ? prev + 1 : prev
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, photos.length]);

  // Touch swipe support for mobile navigation
  function handleTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: TouchEvent) {
    if (touchStartX.current === null || activePhotoIndex === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && activePhotoIndex > 0) {
        // Swiped right -> go to previous photo
        setActivePhotoIndex(activePhotoIndex - 1);
      } else if (diff < 0 && activePhotoIndex < photos.length - 1) {
        // Swiped left -> go to next photo
        setActivePhotoIndex(activePhotoIndex + 1);
      }
    }
    touchStartX.current = null;
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setAuthError("");
    setIsVerifying(true);

    try {
      const res = await fetch("/api/photos/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setAuthError(data.error || "Incorrect password. Please try again.");
        setIsVerifying(false);
        return;
      }

      sessionStorage.setItem("cj_gallery_auth", password);
      setSavedPassword(password);
      setIsAuthenticated(true);
      fetchPhotos(password);
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("cj_gallery_auth");
    setSavedPassword(null);
    setIsAuthenticated(false);
    setPassword("");
    setPhotos([]);
  }

  async function fetchPhotos(authPass: string) {
    setLoadingPhotos(true);
    setFetchError("");
    try {
      const res = await fetch("/api/photos", {
        headers: {
          "x-admin-password": authPass,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          setAuthError("Session expired. Please log in again.");
          return;
        }
        setFetchError(data.error || "Failed to load photos.");
        return;
      }

      // Sort newest first
      const sorted = (data.photos || []).sort(
        (a: Photo, b: Photo) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setPhotos(sorted);
    } catch {
      setFetchError("Unable to connect to photo server.");
    } finally {
      setLoadingPhotos(false);
    }
  }

  async function handleDelete(public_id: string) {
    if (!savedPassword) return;
    setDeletingId(public_id);

    try {
      const res = await fetch("/api/photos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": savedPassword,
        },
        body: JSON.stringify({ public_id }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.error || "Failed to delete photo.");
        return;
      }

      setPhotos((prev) => prev.filter((p) => p.public_id !== public_id));
      if (activePhotoIndex !== null) {
        if (photos.length <= 1) {
          setActivePhotoIndex(null);
        } else if (activePhotoIndex >= photos.length - 1) {
          setActivePhotoIndex(photos.length - 2);
        }
      }
      setConfirmDeleteId(null);
    } catch {
      alert("Error deleting photo. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  // Initial loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <p className="font-script text-4xl text-olive animate-pulse">
            Chioma &amp; John
          </p>
          <div className="h-0.5 w-16 bg-gold/40" />
        </div>
      </div>
    );
  }

  // 1. Password Protection Gate
  if (!isAuthenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-12">
        <FloralFrame />

        <div className="relative z-10 w-full max-w-[480px] rounded-2xl border-2 border-gold/70 bg-white/95 p-8 shadow-2xl backdrop-blur-sm sm:p-12">
          <header className="text-center">
            <Link href="/" className="inline-block">
              <span className="font-script text-4xl text-olive sm:text-5xl">
                C &amp; J
              </span>
            </Link>
            <div className="mx-auto my-3 h-px w-20 bg-gold/60" />
            <h1 className="font-display text-2xl font-semibold tracking-wide text-olive sm:text-3xl">
              Photo Gallery Admin
            </h1>
            <p className="mt-2 text-sm text-olive/75">
              Enter the admin password to view and manage guest photos.
            </p>
          </header>

          <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-5">
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold tracking-wide text-ink"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="h-12 w-full rounded-xl border border-gold/40 bg-cream/30 px-4 text-base text-ink outline-none transition placeholder:text-olive/40 focus:border-olive focus:ring-2 focus:ring-olive/20"
              />
            </div>

            {authError && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-center text-sm font-medium text-red-700"
              >
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-olive text-base font-semibold tracking-wide text-white transition hover:bg-[#323d1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive disabled:opacity-60"
            >
              {isVerifying ? "Verifying…" : "Unlock Gallery"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-olive/60 hover:text-olive underline"
            >
              &larr; Back to wedding site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Gallery View
  return (
    <div className="min-h-screen bg-cream text-olive">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-gold/30 bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-12">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-script text-3xl text-olive md:text-4xl">
              C&amp;J
            </Link>
            <span className="hidden h-5 w-px bg-gold/40 sm:inline-block" />
            <h1 className="hidden font-display text-xl font-medium sm:inline-block">
              Guest Photo Gallery
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-olive/10 px-3.5 py-1 text-xs font-semibold text-olive">
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </span>

            <button
              onClick={() => savedPassword && fetchPhotos(savedPassword)}
              disabled={loadingPhotos}
              title="Refresh photos"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-olive/30 text-olive transition hover:bg-olive hover:text-white disabled:opacity-50"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={loadingPhotos ? "animate-spin" : ""}
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </button>

            <Link
              href="/share-photos"
              className="hidden rounded-full border border-olive/40 px-4 py-1.5 text-xs font-semibold text-olive transition hover:bg-olive hover:text-white md:inline-flex"
            >
              + Upload More
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-full bg-rose-100 px-4 py-1.5 text-xs font-semibold text-rose-800 transition hover:bg-rose-200"
            >
              Lock Gallery
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1440px] px-6 py-8 md:px-12">
        {/* Banner with Upload link on mobile */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Memories Shared by Loved Ones
            </h2>
            <p className="mt-1 text-sm text-olive/75">
              Click any photo to enlarge and browse through the gallery.
            </p>
          </div>
          <Link
            href="/share-photos"
            className="inline-flex items-center justify-center self-start rounded-full bg-olive px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#343e1c] sm:self-auto"
          >
            + Upload Photos
          </Link>
        </div>

        {/* Error message */}
        {fetchError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
            {fetchError}
          </div>
        )}

        {/* Loading Skeleton */}
        {loadingPhotos && photos.length === 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl bg-olive/10"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loadingPhotos && photos.length === 0 && (
          <div className="my-16 rounded-3xl border-2 border-dashed border-gold/50 bg-white/50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-champagne text-gold">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-medium text-olive">
              No photos uploaded yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-olive/75">
              Guests haven&apos;t shared any photos yet. Share the upload link to start collecting moments from the celebration!
            </p>
            <Link
              href="/share-photos"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-olive px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#343e1c]"
            >
              Go to Upload Page
            </Link>
          </div>
        )}

        {/* Photos Grid — Click any image to enlarge */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {photos.map((photo, index) => (
              <div
                key={photo.public_id}
                onClick={() => setActivePhotoIndex(index)}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-gold/40 bg-black/5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.secure_url}
                  alt={`Wedding photo ${index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-108"
                />

                {/* Hover overlay with Enlarge indicator & Delete action */}
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/75 via-black/10 to-black/40 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(photo.public_id);
                      }}
                      disabled={deletingId === photo.public_id}
                      title="Delete photo"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 text-white shadow transition hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingId === photo.public_id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs font-medium text-white/95">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-md">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                      Click to view
                    </span>
                    <span className="text-[11px] opacity-75">#{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-red-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-ink">Delete this photo?</h3>
            <p className="mt-2 text-sm text-olive/75">
              This will permanently delete the photo from Cloudinary. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deletingId === confirmDeleteId}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId === confirmDeleteId ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Lightbox Modal: Enlarge photo & Navigate (Next / Prev / Swipe) */}
      {/* ============================================================== */}
      {activePhotoIndex !== null && photos[activePhotoIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged photo view"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-lg select-none"
          onClick={(e) => {
            // Clicking backdrop outside image closes the modal
            if (e.target === e.currentTarget) {
              setActivePhotoIndex(null);
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar inside Lightbox */}
          <div className="relative z-20 flex items-center justify-between px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-md">
                {activePhotoIndex + 1} of {photos.length}
              </span>
              <span className="hidden text-xs text-white/60 md:inline-block">
                Tip: Press <kbd className="rounded bg-white/20 px-1.5 py-0.5 text-[11px]">←</kbd> / <kbd className="rounded bg-white/20 px-1.5 py-0.5 text-[11px]">→</kbd> to navigate, <kbd className="rounded bg-white/20 px-1.5 py-0.5 text-[11px]">Esc</kbd> to close
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={photos[activePhotoIndex].secure_url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white/25"
                title="Open original high resolution"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span className="hidden sm:inline">Open Full Size</span>
              </a>

              <button
                type="button"
                onClick={() => setConfirmDeleteId(photos[activePhotoIndex].public_id)}
                className="flex items-center gap-1.5 rounded-full bg-red-600/80 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
                title="Delete this photo"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>Delete</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActivePhotoIndex(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg text-white transition hover:bg-white/40 focus:outline-none"
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Main Stage with Image & Next/Prev Controls */}
          <div className="relative flex flex-1 items-center justify-center px-4 py-2 sm:px-16">
            {/* Previous Button */}
            <button
              type="button"
              disabled={activePhotoIndex === 0}
              onClick={(e) => {
                e.stopPropagation();
                if (activePhotoIndex > 0) setActivePhotoIndex(activePhotoIndex - 1);
              }}
              className={`absolute left-3 sm:left-6 z-30 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white shadow-2xl backdrop-blur-md transition-all duration-200 ${
                activePhotoIndex === 0
                  ? "opacity-25 cursor-not-allowed"
                  : "hover:scale-110 hover:bg-black/70 hover:border-white/50 active:scale-95"
              }`}
              title="Previous photo (Left arrow)"
              aria-label="Previous photo"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              type="button"
              disabled={activePhotoIndex === photos.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                if (activePhotoIndex < photos.length - 1) setActivePhotoIndex(activePhotoIndex + 1);
              }}
              className={`absolute right-3 sm:right-6 z-30 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white shadow-2xl backdrop-blur-md transition-all duration-200 ${
                activePhotoIndex === photos.length - 1
                  ? "opacity-25 cursor-not-allowed"
                  : "hover:scale-110 hover:bg-black/70 hover:border-white/50 active:scale-95"
              }`}
              title="Next photo (Right arrow)"
              aria-label="Next photo"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Enlarged Image Display */}
            <div className="relative flex max-h-[78vh] max-w-[88vw] items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={photos[activePhotoIndex].public_id}
                src={photos[activePhotoIndex].secure_url}
                alt={`Wedding celebration enlarged view ${activePhotoIndex + 1}`}
                className="max-h-[76vh] max-w-full rounded-2xl object-contain shadow-2xl transition-opacity duration-300 animate-fadeIn"
              />
            </div>
          </div>

          {/* Bottom Thumbnail Filmstrip Navigation */}
          {photos.length > 1 && (
            <div className="relative z-20 flex justify-center overflow-x-auto px-4 py-3 bg-black/40 backdrop-blur-md">
              <div className="flex gap-2 max-w-full overflow-x-auto py-1 px-2 scrollbar-thin">
                {photos.map((p, idx) => (
                  <button
                    key={p.public_id}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                      idx === activePhotoIndex
                        ? "ring-2 ring-gold scale-110 shadow-lg"
                        : "opacity-45 hover:opacity-85"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.secure_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
