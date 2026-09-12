import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Beta gate
//
// Controlled entirely by environment variables in Vercel — no redeploy needed
// to flip it, just change the var and redeploy (or use the dashboard's
// "Redeploy" after editing).
//
//   BETA_GATE   "on" | "off"   — the switch. Anything other than "on" is off.
//   BETA_CODES  "amy:sun-42,mohan:heel-19"  — comma separated. Each entry is
//               either "label:code" or a bare "code". The label is only used
//               so you can tell which code was used; it is never shown.
//   BETA_SECRET  any long random string — signs the session cookie.
//
// With BETA_GATE unset or "off", this file does nothing at all.
// ---------------------------------------------------------------------------

const COOKIE = "vs_beta";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function parseCodes(raw) {
  return (raw || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const idx = entry.indexOf(":");
      if (idx === -1) return { label: "unnamed", code: entry };
      return { label: entry.slice(0, idx).trim(), code: entry.slice(idx + 1).trim() };
    })
    .filter((e) => e.code.length > 0);
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Constant-time-ish comparison, so a wrong code can't be narrowed by timing.
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function validCookie(raw, secret) {
  if (!raw) return false;
  const parts = raw.split(".");
  if (parts.length !== 3) return false;
  const [exp, label, sig] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = await sign(`${exp}.${label}`, secret);
  return safeEqual(sig, expected);
}

export async function middleware(request) {
  // The switch.
  if (process.env.BETA_GATE !== "on") return NextResponse.next();

  const { pathname, searchParams } = request.nextUrl;
  const secret = process.env.BETA_SECRET || "insecure-fallback-set-BETA_SECRET";

  // The gate screen itself must stay reachable.
  if (pathname === "/gate") return NextResponse.next();

  // Already let in?
  if (await validCookie(request.cookies.get(COOKIE)?.value, secret)) {
    return NextResponse.next();
  }

  // A code can also arrive as ?code= — lets you send a one-tap link.
  const supplied = searchParams.get("code");
  if (supplied) {
    const match = parseCodes(process.env.BETA_CODES).find((e) =>
      safeEqual(e.code, supplied)
    );
    if (match) {
      const exp = Date.now() + MAX_AGE * 1000;
      const value = `${exp}.${match.label}`;
      const signed = `${value}.${await sign(value, secret)}`;

      // Strip the code from the URL so it doesn't sit in history or get shared.
      const clean = request.nextUrl.clone();
      clean.searchParams.delete("code");
      const response = NextResponse.redirect(clean);
      response.cookies.set(COOKIE, signed, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: MAX_AGE,
      });
      return response;
    }
  }

  const gate = request.nextUrl.clone();
  gate.pathname = "/gate";
  gate.search = "";
  return NextResponse.rewrite(gate);
}

export const config = {
  // Everything except Next's own assets and the PWA files.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/|api/beta).*)",
  ],
};
