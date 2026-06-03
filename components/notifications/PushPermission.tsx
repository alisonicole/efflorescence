"use client";

import { useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const arr = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i);
  return arr.buffer;
}

export default function PushPermission() {
  const [status, setStatus] = useState<
    "idle" | "requesting" | "granted" | "denied" | "unsupported"
  >("idle");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "granted") setStatus("granted");
    if (Notification.permission === "denied") setStatus("denied");

    // Register service worker silently on mount
    navigator.serviceWorker
      .register("/sw.js")
      .catch(() => setStatus("unsupported"));
  }, []);

  async function requestPermission() {
    if (!("serviceWorker" in navigator)) return;
    setStatus("requesting");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      // Save subscription to Parse User object
      initParse();
      const user = Parse.User.current();
      if (user) {
        user.set("pushSubscription", JSON.stringify(subscription));
        await user.save();
      }

      setStatus("granted");
    } catch {
      setStatus("denied");
    }
  }

  if (status === "granted" || status === "denied" || status === "unsupported") {
    return null;
  }

  return (
    <div className="mx-2.5 mb-3 bg-white rounded-card p-4 shadow-sm border border-border flex items-start gap-3">
      <span className="text-xl flex-shrink-0">🌿</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-bark mb-0.5">
          Morning gratitude. Evening tending.
        </p>
        <p className="text-xs text-muted mb-3">
          Get a gentle nudge to add a pebble each morning and water your plants
          each evening.
        </p>
        <button
          onClick={requestPermission}
          disabled={status === "requesting"}
          className="bg-bark text-cream rounded-card px-4 py-2 text-xs font-medium disabled:opacity-40"
        >
          {status === "requesting" ? "Setting up..." : "Enable reminders"}
        </button>
      </div>
    </div>
  );
}
