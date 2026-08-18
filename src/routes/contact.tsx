import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Wild Cape — Cape Town Adventure Help" },
      {
        name: "description",
        content:
          "Ask about Cape Town hikes, kayaking, winelands tours or paragliding. Send the Wild Cape team a message and we'll match you with the right local operator.",
      },
      { property: "og:title", content: "Contact Wild Cape" },
      {
        property: "og:description",
        content:
          "Questions about a Cape Town adventure? Message the Wild Cape team and we'll help you plan it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  full_name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Please write a message").max(2000),
});

function ContactPage() {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const parsed = contactSchema.safeParse(
      Object.fromEntries(new FormData(formEl)),
    );

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }

    setErrors({});
    setSaving(true);
    const { error } = await supabase.from("contact_messages").insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    });
    setSaving(false);

    if (error) {
      toast.error("Your message didn't send. Please try again.");
      return;
    }

    toast.success("Thanks — we'll reply within one working day.");
    formEl.reset();
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link to="/" className="font-display text-lg tracking-tight">
            Wild Cape
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              Activities
            </Link>
            <Link to="/charity" className="text-sm text-muted-foreground hover:underline">
              Giving back
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
          Talk to someone who has walked the trail.
        </h1>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground">
          Tell us what you'd like to do in Cape Town and we'll point you at the right
          operator, season and starting point.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <form
            onSubmit={onSubmit}
            className="space-y-5 rounded-xl border border-border bg-card p-6"
            style={{ boxShadow: "var(--shadow-forest)" }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-name">Full name</Label>
                <Input id="c-name" name="full_name" maxLength={100} required />
                {errors["full_name"] && (
                  <p className="text-xs text-destructive">{errors["full_name"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-email">Email</Label>
                <Input id="c-email" name="email" type="email" maxLength={255} required />
                {errors["email"] && (
                  <p className="text-xs text-destructive">{errors["email"]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="c-subject">Subject</Label>
              <Input
                id="c-subject"
                name="subject"
                maxLength={200}
                placeholder="Group hike in March"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="c-message">Message</Label>
              <Textarea id="c-message" name="message" rows={6} maxLength={2000} required />
              {errors["message"] && (
                <p className="text-xs text-destructive">{errors["message"]}</p>
              )}
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Sending…" : "Send message"}
            </Button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-secondary p-6">
              <h2 className="font-display text-xl text-secondary-foreground">
                Find us
              </h2>
              <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>12 Kloof Nek Road, Tamboerskloof, Cape Town 8001</span>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>hello@wildcape.co.za</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>+27 21 555 0134</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border p-6">
              <h2 className="font-display text-xl">Office hours</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Mon – Fri, 08:00 – 17:00 SAST. Weekend messages are answered on Monday,
                unless you're already on a trip — then call the number above.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm text-muted-foreground">
          Wild Cape — an independent guide to Cape Town's outdoors.
        </p>
      </footer>
    </div>
  );
}
