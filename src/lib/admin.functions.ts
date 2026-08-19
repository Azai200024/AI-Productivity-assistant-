import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: Boolean(data) };
  });

export const getAdminData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [bookings, messages, reviews] = await Promise.all([
      context.supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      context.supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      context.supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);

    return {
      isAdmin: !bookings.error,
      bookings: bookings.data ?? [],
      messages: messages.data ?? [],
      reviews: reviews.data ?? [],
    };
  });

export const setReviewApproval = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), approved: z.boolean() }).parse(data),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("reviews")
      .update({ approved: data.approved })
      .eq("id", data.id);
    if (error) throw new Error("Not allowed");
    return { ok: true };
  });

export const deleteReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("reviews").delete().eq("id", data.id);
    if (error) throw new Error("Not allowed");
    return { ok: true };
  });
