import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const listActivities = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchActivities } = await import("./catalog.server");
  return fetchActivities();
});

export const getActivity = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().max(120) }).parse(data))
  .handler(async ({ data }) => {
    const { fetchActivity, fetchApprovedReviews } = await import("./catalog.server");
    const activity = await fetchActivity(data.slug);
    if (!activity) return { activity: null, reviews: [] };
    const reviews = await fetchApprovedReviews(data.slug);
    return { activity, reviews };
  });

export const listReviews = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchApprovedReviews } = await import("./catalog.server");
  return fetchApprovedReviews();
});
