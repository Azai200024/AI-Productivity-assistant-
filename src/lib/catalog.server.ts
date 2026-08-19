import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Activity = Database["public"]["Tables"]["activities"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];

function publicClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    },
  );
}

export async function fetchActivities(): Promise<Activity[]> {
  const { data, error } = await publicClient()
    .from("activities")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchActivity(slug: string): Promise<Activity | null> {
  const { data, error } = await publicClient()
    .from("activities")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function fetchApprovedReviews(slug?: string): Promise<Review[]> {
  let query = publicClient()
    .from("reviews")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(50);
  if (slug) query = query.eq("activity_slug", slug);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
