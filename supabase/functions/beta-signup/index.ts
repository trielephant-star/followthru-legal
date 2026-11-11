// beta-signup: called by the "Join the beta" forms on usefollowthru.com.
//
// Saves the sign-up to public.beta_signups, then (for new addresses only) sends a short
// confirmation to the person and an alert to the support inbox through Resend.
// Each address gets at most one email ever: a repeat sign-up sends nothing.
//
// Deploy (only this function, never the app's):
//   npx supabase functions deploy beta-signup --project-ref drrvokcuzswsgjdwwhmn --use-api --no-verify-jwt

import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const ALERT_TO = Deno.env.get("FEEDBACK_EMAIL") ?? "";
const ALERT_FROM = Deno.env.get("FEEDBACK_FROM") || "FollowThru <hello@usefollowthru.com>";

const CONFIRM_FROM = "Momo at FollowThru <hello@usefollowthru.com>";
const REPLY_TO = "support@usefollowthru.com";
const HOURLY_EMAIL_CAP = 30;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PLATFORMS = ["iphone", "android"] as const;
type Platform = (typeof PLATFORMS)[number];

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ---------- CORS ----------

function allowedOrigin(origin: string | null): string | null {
  if (!origin) return null;
  if (origin === "https://usefollowthru.com" || origin === "https://www.usefollowthru.com") {
    return origin;
  }
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  return null;
}

function corsHeaders(req: Request): Record<string, string> {
  const origin = allowedOrigin(req.headers.get("Origin"));
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(req: Request, status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json" },
  });
}

// ---------- Email ----------

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

async function sendEmail(msg: {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  reply_to?: string;
}): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log("beta-signup: RESEND_API_KEY missing, email skipped:", msg.subject);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });
    if (!res.ok) {
      console.log(`beta-signup: Resend error ${res.status} for "${msg.subject}":`, await res.text());
    }
  } catch (err) {
    console.log(`beta-signup: Resend request failed for "${msg.subject}":`, String(err));
  }
}

// Public TestFlight invite for iPhone testers. Android testers are invited by email later.
const TESTFLIGHT_URL = "https://testflight.apple.com/join/3aSdxBz7";

function confirmationEmail(platform: Platform) {
  const iphone = platform === "iphone";
  const phone = iphone ? "iPhone" : "Android";
  const subject = iphone
    ? "You’re in! Install FollowThru on your iPhone 🦥"
    : "You’re on the FollowThru beta list 🦥";
  const nextText = iphone
    ? [
      "You can start today. On your iPhone, open this link:",
      TESTFLIGHT_URL,
      "",
      "It opens TestFlight, Apple’s free app for testing new apps (if you don’t have it yet, the link shows you where to get it from the App Store). Tap Accept, then Install, and FollowThru appears on your home screen.",
    ]
    : [
      "What happens next:",
      "We’re letting Android testers in in small groups. When it’s your turn, you’ll get an email with a Google Play link to install the app.",
    ];
  const nextHtml = iphone
    ? `<p><strong>You can start today.</strong> On your iPhone, tap the button below. It opens TestFlight, Apple’s free app for testing new apps (if you don’t have it yet, the page shows you where to get it from the App Store). Tap <strong>Accept</strong>, then <strong>Install</strong>.</p>
<p style="margin:22px 0"><a href="${TESTFLIGHT_URL}" style="display:inline-block;background:#1C7F48;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">Install FollowThru with TestFlight</a></p>
<p style="font-size:14px;color:#5A4A3E">Or copy this link into Safari on your iPhone: ${TESTFLIGHT_URL}</p>`
    : `<p><strong>What happens next:</strong> we’re letting Android testers in in small groups. When it’s your turn, you’ll get an email with a Google Play link to install the app.</p>`;
  const text = [
    "Hi there,",
    "",
    `Momo here. You’re on the FollowThru beta list for ${phone}. Thank you for joining!`,
    "",
    ...nextText,
    "",
    "Until then, have a think about the side project you want to move forward. One small Move a day is all it takes.",
    "",
    "Questions? Just reply to this email.",
    "",
    "Slowly but surely,",
    "Momo, from FollowThru",
    "https://usefollowthru.com",
  ].join("\n");
  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#FBF6EE;font-family:Nunito,Helvetica,Arial,sans-serif;color:#2E2219;font-size:16px;line-height:1.55">
<div style="max-width:520px;margin:0 auto">
<p>Hi there,</p>
<p>Momo here. You’re on the FollowThru beta list for <strong>${phone}</strong>. Thank you for joining!</p>
${nextHtml}
<p>Until then, have a think about the side project you want to move forward. One small Move a day is all it takes.</p>
<p>Questions? Just reply to this email.</p>
<p>Slowly but surely,<br>Momo, from FollowThru<br><a href="https://usefollowthru.com" style="color:#1C7F48">usefollowthru.com</a></p>
</div>
</body></html>`;
  return { subject, text, html };
}

function alertEmail(email: string, platform: Platform, source: string, at: string, total: number | null) {
  const totalLine = total === null ? "unknown" : String(total);
  const subject = `New beta sign-up: ${email} (${platform})`;
  const text = [
    "New beta sign-up",
    "",
    `Email:    ${email}`,
    `Platform: ${platform}`,
    `Source:   ${source}`,
    `Time:     ${at} (UTC)`,
    "",
    `Total sign-ups so far: ${totalLine}`,
  ].join("\n");
  const html = `<!doctype html><html><body style="font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#2E2219">
<p><strong>New beta sign-up</strong></p>
<table cellpadding="4">
<tr><td>Email</td><td>${escapeHtml(email)}</td></tr>
<tr><td>Platform</td><td>${escapeHtml(platform)}</td></tr>
<tr><td>Source</td><td>${escapeHtml(source)}</td></tr>
<tr><td>Time</td><td>${escapeHtml(at)} (UTC)</td></tr>
</table>
<p>Total sign-ups so far: <strong>${totalLine}</strong></p>
</body></html>`;
  return { subject, text, html };
}

// ---------- Handler ----------

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  if (req.method !== "POST") return json(req, 405, { error: "method_not_allowed" });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(req, 400, { error: "invalid_json" });
  }

  // Honeypot: a bot filled the hidden field. Pretend it worked, do nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return json(req, 200, { ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const platform = body.platform as Platform;
  const rawSource = typeof body.source === "string" ? body.source.trim() : "";
  const source = /^[a-z0-9_-]{1,32}$/i.test(rawSource) ? rawSource : "site";

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json(req, 400, { error: "invalid_email" });
  }
  if (!PLATFORMS.includes(platform)) {
    return json(req, 400, { error: "invalid_platform" });
  }

  const { data: row, error } = await db
    .from("beta_signups")
    .insert({ email, platform, source })
    .select("created_at")
    .single();

  if (error) {
    // 23505 = unique violation: this address is already on the list. Send nothing.
    if (error.code === "23505") return json(req, 200, { ok: true, already: true });
    console.log("beta-signup: insert failed:", error.code, error.message);
    return json(req, 500, { error: "save_failed" });
  }

  const at = (row?.created_at as string | undefined) ?? new Date().toISOString();

  // Safety cap: during a flood of sign-ups, keep saving rows but stop sending email.
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const [{ count: lastHour, error: hourErr }, { count: total }] = await Promise.all([
    db.from("beta_signups").select("id", { count: "exact", head: true }).gte("created_at", hourAgo),
    db.from("beta_signups").select("id", { count: "exact", head: true }),
  ]);
  if (hourErr || (lastHour ?? 0) > HOURLY_EMAIL_CAP) {
    console.log(`beta-signup: email cap hit (${lastHour} in the last hour), emails skipped for ${source}`);
    return json(req, 200, { ok: true });
  }

  const confirm = confirmationEmail(platform);
  const alert = alertEmail(email, platform, source, at, total ?? null);
  await Promise.all([
    sendEmail({ from: CONFIRM_FROM, to: email, reply_to: REPLY_TO, ...confirm }),
    ALERT_TO
      ? sendEmail({ from: ALERT_FROM, to: ALERT_TO, ...alert })
      : Promise.resolve(console.log("beta-signup: FEEDBACK_EMAIL missing, alert skipped")),
  ]);

  return json(req, 200, { ok: true });
});
