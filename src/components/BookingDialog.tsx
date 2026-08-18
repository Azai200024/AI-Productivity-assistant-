import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const bookingSchema = z.object({
  full_name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  preferred_date: z.string().trim().max(20).optional().or(z.literal("")),
  party_size: z.coerce.number().int().min(1, "At least 1 person").max(50),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export function BookingDialog({
  activity,
  operator,
}: {
  activity: string;
  operator: string;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = bookingSchema.safeParse(Object.fromEntries(form));

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[String(issue.path[0])] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setSaving(true);
    const v = parsed.data;
    const { error } = await supabase.from("bookings").insert({
      activity,
      operator,
      full_name: v.full_name,
      email: v.email,
      phone: v.phone || null,
      preferred_date: v.preferred_date ? v.preferred_date : null,
      party_size: v.party_size,
      notes: v.notes || null,
    });
    setSaving(false);

    if (error) {
      toast.error("We couldn't save your booking. Please try again.");
      return;
    }

    toast.success(`Booking request sent for ${activity}. We'll be in touch.`);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Book</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{activity}</DialogTitle>
          <DialogDescription>
            Leave your details and {operator} will confirm availability with you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`name-${activity}`}>Full name</Label>
            <Input id={`name-${activity}`} name="full_name" maxLength={100} required />
            {errors["full_name"] && (
              <p className="text-xs text-destructive">{errors["full_name"]}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`email-${activity}`}>Email</Label>
              <Input
                id={`email-${activity}`}
                name="email"
                type="email"
                maxLength={255}
                required
              />
              {errors["email"] && (
                <p className="text-xs text-destructive">{errors["email"]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`phone-${activity}`}>Phone (optional)</Label>
              <Input id={`phone-${activity}`} name="phone" maxLength={30} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`date-${activity}`}>Preferred date</Label>
              <Input id={`date-${activity}`} name="preferred_date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`party-${activity}`}>People</Label>
              <Input
                id={`party-${activity}`}
                name="party_size"
                type="number"
                min={1}
                max={50}
                defaultValue={2}
              />
              {errors["party_size"] && (
                <p className="text-xs text-destructive">{errors["party_size"]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`notes-${activity}`}>Anything we should know?</Label>
            <Textarea
              id={`notes-${activity}`}
              name="notes"
              maxLength={1000}
              rows={3}
              placeholder="Fitness level, dietary needs, pick-up area…"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving ? "Sending…" : "Request booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
