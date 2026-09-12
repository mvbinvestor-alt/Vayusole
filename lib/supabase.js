import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Auth only.
//
// During the beta we authenticate testers so we know WHO is using the app, and
// we deliberately do NOT record WHAT they do with it. Supabase's own auth table
// already gives the account list and last-sign-in time, which is the whole
// question we set out to answer.
//
// An email address is ordinary personal data. An email joined to a symptom
// history is health data about an identifiable person, which brings consent,
// purpose limitation, retention and breach-notification duties under India's
// DPDP Act. No reason to take that on just to learn who opened the app.
//
// Protocol logging is intentionally absent. If it returns it must be explicit
// opt-in, after the clinical review, with the privacy notice updated FIRST.
// The old logSession/getSessions helpers were deleted rather than left
// commented out, so nobody wires them up by accident.
// ---------------------------------------------------------------------------

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Auth is optional: with no keys configured the app runs exactly as before,
// open and anonymous. Nothing here should throw on a missing key.
export const authEnabled = Boolean(url && anonKey);

export const supabase = authEnabled
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export async function sendMagicLink(email) {
  if (!supabase) return { ok: false, error: "Sign-in isn't configured." };

  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      // Closed beta: no self-serve sign-ups. An address that hasn't been
      // invited gets no account and no email.
      shouldCreateUser: false,
    },
  });

  if (error) {
    // Deliberately vague — don't confirm whether an address is on the list.
    return { ok: false, error: "That address isn't on the tester list." };
  }
  return { ok: true };
}

export async function getSession() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function deleteMyAccount() {
  if (!supabase) return { ok: false };
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { ok: false };

  const res = await fetch("/api/account", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (res.ok) {
    await supabase.auth.signOut();
    return { ok: true };
  }
  return { ok: false };
}
