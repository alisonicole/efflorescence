import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

const PARSE_APP_ID = process.env.NEXT_PUBLIC_PARSE_APP_ID!;
const PARSE_MASTER_KEY = process.env.PARSE_MASTER_KEY!;
const PARSE_SERVER_URL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL!;

const NOTIFICATIONS = {
  morning: {
    title: "efflorescence",
    body: "What are you grateful for this morning?",
    url: "/garden",
  },
  evening: {
    title: "efflorescence",
    body: "Time to water your garden.",
    url: "/garden",
  },
} as const;

type NotificationType = keyof typeof NOTIFICATIONS;

async function fetchAllSubscriptions() {
  const where = encodeURIComponent(
    JSON.stringify({ pushSubscription: { $exists: true } }),
  );
  const res = await fetch(
    `${PARSE_SERVER_URL}/users?where=${where}&limit=1000`,
    {
      headers: {
        "X-Parse-Application-Id": PARSE_APP_ID,
        "X-Parse-Master-Key": PARSE_MASTER_KEY,
      },
    },
  );
  if (!res.ok) return [];
  const data = (await res.json()) as {
    results: { pushSubscription?: string }[];
  };
  return data.results.flatMap((user) => {
    if (!user.pushSubscription) return [];
    try {
      const sub = JSON.parse(user.pushSubscription) as {
        endpoint: string;
        keys: { auth: string; p256dh: string };
      };
      return sub.endpoint && sub.keys?.auth && sub.keys?.p256dh ? [sub] : [];
    } catch {
      return [];
    }
  });
}

// Vercel cron calls GET with Authorization: Bearer <CRON_SECRET>
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Determine type from hour: 12 UTC = morning, 23 UTC = evening
  const hour = new Date().getUTCHours();
  const type: NotificationType = hour < 18 ? "morning" : "evening";
  const payload = NOTIFICATIONS[type];

  const subscriptions = await fetchAllSubscriptions();
  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, JSON.stringify(payload));
        sent++;
      } catch {
        failed++;
      }
    }),
  );

  return NextResponse.json({ type, sent, failed });
}
