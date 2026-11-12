import { createSupabaseServer } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("UNAUTHORIZED");
  return data.user;
}
