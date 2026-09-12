import { createClient } from "@supabase/supabase-js";

// Sessions table schema (run in Supabase SQL editor):
//
// create table sessions (
//   id uuid primary key default gen_random_uuid(),
//   user_id uuid references auth.users(id),
//   protocol text not null,
//   completed_at timestamptz default now()
// );
// alter table sessions enable row level security;
// create policy "own sessions" on sessions
//   for all using (auth.uid() = user_id);

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function logSession(protocol) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("sessions")
    .insert({ user_id: user.id, protocol });
  if (error) console.error("logSession failed:", error.message);
  return data;
}

export async function getSessions() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("sessions")
    .select("protocol, completed_at")
    .order("completed_at", { ascending: true });
  if (error) { console.error(error.message); return []; }
  return data;
}
