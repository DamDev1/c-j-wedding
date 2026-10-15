"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { FloralFrame } from "./Decoration";

interface AccessGateProps {
  children: React.ReactNode;
}

export function AccessGate({ children }: AccessGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [phone, setPhone] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Retrieve or generate persistent device identifier
  useEffect(() => {
    let currentDeviceId = localStorage.getItem("cj_wedding_device_id");
    if (!currentDeviceId) {
      currentDeviceId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "dev_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("cj_wedding_device_id", currentDeviceId);
    }
    setDeviceId(currentDeviceId);

    // Verify if this device is already authenticated
    async function checkAuth(devId: string) {
      try {
        const res = await fetch("/api/auth/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId: devId }),
        });
        const data = await res.json().catch(() => ({}));
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Failed to check auth status:", err);
        setIsAuthenticated(false);
      }
    }

    checkAuth(currentDeviceId);
  }, []);

  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, deviceId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(
          data.error || "Unable to verify phone number. Please check and try again."
        );
        setLoading(false);
        return;
      }

      setSuccessMessage("Invitation unlocked! Entering celebration...");
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 700);
    } catch (err) {
      console.error("Verification error:", err);
      setErrorMessage("Network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // 1. Loading check screen (seamless transition without flash)
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffcf7]">
        <div className="flex flex-col items-center gap-3">
          <p className="font-script text-4xl text-[#3f4b22] animate-pulse">
            Chioma &amp; John
          </p>
          <div className="h-0.5 w-16 bg-[#b8955a]/40" />
        </div>
      </div>
    );
  }

  // 2. Already authenticated: display full site
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 3. Not authenticated: display access gate
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffcf7] px-4 py-12">
      <FloralFrame />

      <div className="relative z-10 w-full max-w-[540px] rounded-2xl border-2 border-[#c09b5e] bg-[#ffffff]/90 p-8 shadow-xl backdrop-blur-sm sm:p-12">
        <header className="text-center">
          <p className="font-script mb-2 text-4xl leading-tight text-[#3f4b22] sm:text-5xl">
            Chioma &amp; John
          </p>
          <div className="mx-auto my-3 h-px w-20 bg-[#b8955a]" />
          <h1 className="font-display text-2xl font-semibold tracking-wide text-[#3f4b22] sm:text-3xl">
            Private Wedding Invitation
          </h1>
          <p className="mt-2 text-base text-[#6b6b6b]">
            Please enter the phone number where you received your invitation to unlock access.
          </p>
        </header>

        <form onSubmit={handleVerify} className="mt-8 flex flex-col gap-5">
          <div>
            <label
              htmlFor="guest-phone"
              className="mb-2 block text-sm font-semibold tracking-wide text-[#1b1511]"
            >
              Phone Number
            </label>
            <input
              id="guest-phone"
              type="tel"
              required
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0803 123 4567"
              className="h-14 w-full rounded-xl border border-[#dcdcdc] bg-[#ffffff] px-4 text-lg text-[#1b1511] outline-none transition placeholder:text-[#9b9b9b] focus:border-[#3f4b22] focus:ring-2 focus:ring-[#3f4b22]/20"
            />
            <p className="mt-2 text-xs text-[#8c827a]">
              * Each invitation is strictly linked to one device.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-700"
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-800"
            >
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-13 w-full items-center justify-center rounded-full bg-[#3f4b22] text-lg font-semibold tracking-wide text-white transition hover:bg-[#343e1c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f4b22] disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Unlock Invitation"}
          </button>
        </form>
      </div>
    </div>
  );
}
