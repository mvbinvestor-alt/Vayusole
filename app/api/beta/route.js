import { NextResponse } from "next/server";

export const runtime = "edge";

const COOKIE = "vs_beta";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function parseCodes(raw) {
  return (raw || "")
    .split(",")
    .map((e) => e.trim())
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

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(request) {
  let code = "";
  try {
    const body = await request.json();
    code = String(body.code || "").trim();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const match = parseCodes(process.env.BETA_CODES).find((e) => safeEqual(e.code, code));

  if (!match) {
    // Deliberately vague, and slow enough to make guessing tedious.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const secret = process.env.BETA_SECRET || "insecure-fallback-set-BETA_SECRET";
  const exp = Date.now() + MAX_AGE * 1000;
  const value = `${exp}.${match.label}`;
  const signed = `${value}.${await sign(value, secret)}`;

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, signed, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: MAX_AGE,
  });
  return response;
}
