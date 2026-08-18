import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/charity")({
  head: () => ({
    meta: [
      { title: "Giving Back — Wild Cape Community Work" },
      {
        name: "description",
        content:
          "How Wild Cape gives back: trail restoration, youth hiking clubs, ocean clean-ups and guide training bursaries across Cape Town communities.",
      },
      { property: "og:title", content: "Giving Back — Wild Cape Community Work" },
      {
        property: "og:description",
        content:
          "Trail restoration, youth hiking clubs, ocean clean-ups and guide bursaries funded by every Wild Cape booking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Charity,
});

const programmes = [
  {
    title: "Youth Trail Club",
    place: "Khayelitsha & Mitchells Plain",
    body: "Weekend hikes for 240 learners a year, with transport, kit and a packed lunch covered by us.",
  },
  {
    title: "Fynbos Restoration",
    place: "Table Mountain National Park",
    body: "1 800 volunteer hours clearing invasive pine and wattle, and replanting indigenous fynbos on eroded slopes.",
  },
  {
    title: "Blue Flag Clean-ups",
    place: "Atlantic Seaboard & False Bay",
    body: "Monthly beach and kelp-line clean-ups with our kayak partners — 6.4 tonnes of waste removed since 2021.",
  },
  {
    title: "Guide Bursary Fund",
    place: "Western Cape",
    body: "Full sponsorship of mountain-guide and first-aid certification for 18 guides from local townships.",
  },
];

const impact = [
  { figure: "5%", label: "of every booking goes to the fund" },
  { figure: "R1.2m", label: "granted to partners since 2021" },
  { figure: "240", label: "learners on the trail each year" },
  { figure: "18", label: "guides fully certified" },
];

function Charity() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link to="/" className="font-display text-lg tracking-tight">
            Wild Cape
          </Link>
          <Link to="/" className="text-sm underline-offset-4 hover:underline">
            Back to activities
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Giving back
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] sm:text-6xl">
          The mountain looks after us. We try to return the favour.
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground">
          Wild Cape is small, independent and locally run. A fixed share of every booking
          we send to an operator goes straight into community and conservation work here
          in the Cape.
        </p>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {impact.map((i) => (
            <div key={i.label}>
              <p className="font-display text-4xl text-secondary-foreground">{i.figure}</p>
              <p className="mt-2 text-sm text-muted-foreground">{i.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl sm:text-4xl">Where the money goes</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {programmes.map((p) => (
            <article
              key={p.title}
              className="rounded-xl border border-border bg-card p-6"
              style={{ boxShadow: "var(--shadow-forest)" }}
            >
              <h3 className="font-display text-2xl">{p.title}</h3>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {p.place}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{p.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-mist p-8">
          <h2 className="font-display text-2xl">Want to join a workday?</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            We run an open volunteer morning on the last Saturday of every month. Boots,
            gloves and coffee provided.
          </p>
          <Button asChild className="mt-6">
            <a href="mailto:hello@wildcape.co.za">Email us to volunteer</a>
          </Button>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm text-muted-foreground">
          Wild Cape — an independent guide to Cape Town's outdoors.
        </p>
      </footer>
    </div>
  );
}
