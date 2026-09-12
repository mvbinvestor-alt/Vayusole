import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Self-service account deletion. A tester asking to be removed should be one
// tap, not an email to Balaji — that's what makes the privacy promise real.
//
// Needs SUPABASE_SERVICE_ROLE_KEY (server-side only, never NEXT_PUBLIC_).
// Deleting a user removes the row from auth.users; nothing else is stored.

export async function DELETE(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 501 });
  }

  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Verify the token really belongs to the account being deleted, so one
  // tester can never delete another.
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { error: delError } = await admin.auth.admin.deleteUser(data.user.id);
  if (delError) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
