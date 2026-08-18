import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImg from "@/assets/hero-table-mountain.jpg";
import hikingImg from "@/assets/act-hiking.jpg";
import kayakImg from "@/assets/act-kayak.jpg";
import wineImg from "@/assets/act-wine.jpg";
import paraglideImg from "@/assets/act-paraglide.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wild Cape — Things To Do in Cape Town" },
      {
        name: "description",
        content:
          "Discover Cape Town's best outdoor experiences: hiking Table Mountain, sea kayaking, winelands and paragliding, with links to trusted local operators.",
      },
      { property: "og:title", content: "Wild Cape — Things To Do in Cape Town" },
      {
        property: "og:description",
        content:
          "Mountain trails, ocean paddles, winelands and flight. Book Cape Town adventures with trusted local operators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const activities = [
  {
    name: "Table Mountain Trails",
    operator: "Cape Town Hiking Co.",
    url: "https://capetownhiking.co.za",
    image: hikingImg,
    tag: "Hiking",
    price: "From R650 pp",
    blurb:
      "Guided sunrise ascents up Platteklip and Skeleton Gorge, with fynbos and waterfall detours.",
  },
  {
    name: "Kelp Forest Paddle",
    operator: "Kaskazi Kayaks",
    url: "https://kayak.co.za",
    image: kayakImg,
    tag: "Ocean",
    price: "From R550 pp",
    blurb:
      "Two-hour sea kayak from Three Anchor Bay past kelp beds, often alongside seals and dolphins.",
  },
  {
    name: "Winelands Day Escape",
    operator: "Wine Flies Tours",
    url: "https://wineflies.co.za",
    image: wineImg,
    tag: "Winelands",
    price: "From R1 350 pp",
    blurb:
      "Stellenbosch and Franschhoek estates below the granite peaks, tastings and a valley lunch.",
  },
  {
    name: "Signal Hill Tandem Flight",
    operator: "Cape Town Tandem Paragliding",
    url: "https://paraglide.co.za",
    image: paraglideImg,
    tag: "Air",
    price: "From R1 800 pp",
    blurb:
      "Step off Signal Hill and glide over the city bowl and Atlantic seaboard with a certified pilot.",
  },
];

const seasons = [
  { label: "Summer", months: "Dec – Feb", note: "Long light for trails and beach paddles." },
  { label: "Autumn", months: "Mar – May", note: "Still air, best month for flying." },
  { label: "Winter", months: "Jun – Aug", note: "Green slopes, waterfalls at full flow." },
  { label: "Spring", months: "Sep – Nov", note: "Fynbos in bloom, whales in the bay." },
];

const reviews = [
  {
    name: "Thandi M.",
    from: "Johannesburg",
    activity: "Table Mountain Trails",
    quote:
      "Booked the sunrise Platteklip hike through Wild Cape and had the guide's number within an hour. Being above the cloud tablecloth at 6am is something I'll never forget.",
  },
  {
    name: "Daniel V.",
    from: "Rotterdam",
    activity: "Kelp Forest Paddle",
    quote:
      "The app made picking an operator easy — real prices, no upsell. A seal swam under my kayak twice. Worth every rand.",
  },
  {
    name: "Ayanda K.",
    from: "Cape Town",
    activity: "Winelands Day Escape",
    quote:
      "I live here and still found estates I'd never heard of. Everything listed was accurate, right down to the lunch stop.",
  },
  {
    name: "Sarah L.",
    from: "London",
    activity: "Signal Hill Tandem Flight",
    quote:
      "Nervous flyer, incredible pilot. I liked that the app tells you which season is actually best — we went in autumn and the air was glass.",
  },
];


function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="absolute inset-x-0 top-0 z-20">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="font-display text-lg tracking-tight text-primary-foreground">
            Wild Cape
          </span>
          <div className="flex items-center gap-6">
            <a
              href="#activities"
              className="text-sm text-primary-foreground/85 underline-offset-4 hover:underline"
            >
              Activities
            </a>
            <a
              href="#reviews"
              className="text-sm text-primary-foreground/85 underline-offset-4 hover:underline"
            >
              Reviews
            </a>
            <Link
              to="/charity"
              className="text-sm text-primary-foreground/85 underline-offset-4 hover:underline"
            >
              Giving back
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Table Mountain at golden hour with its cloud tablecloth spilling over the cliffs above green fynbos slopes"
          width={1920}
          height={1280}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: "var(--gradient-canopy)" }}
        />
        <div className="mx-auto w-full max-w-6xl px-6 pb-20">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-primary-foreground/80">
            Cape Town · Western Cape
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] text-primary-foreground sm:text-7xl">
            Mountain, water and everything between.
          </h1>
          <p className="mt-6 max-w-xl text-base text-primary-foreground/85">
            A hand-picked guide to what to do outdoors in Cape Town — and the local
            companies who run it well.
          </p>
          <Button asChild size="lg" className="mt-8">
            <a href="#activities">See the activities</a>
          </Button>
        </div>
      </section>

      <section id="activities" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <h2 className="font-display text-3xl sm:text-4xl">Recreational activities</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Each listing links straight to the operator's own website for pricing and booking.
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {activities.map((a) => (
            <article
              key={a.name}
              className="group overflow-hidden rounded-xl border border-border bg-card"
              style={{ boxShadow: "var(--shadow-forest)" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={a.image}
                  alt={a.name}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground">
                  {a.tag}
                </Badge>
              </div>
              <div className="space-y-3 p-6">
                <h3 className="font-display text-2xl">{a.name}</h3>
                <p className="text-sm text-muted-foreground">{a.blurb}</p>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-sm font-medium">{a.operator}</p>
                    <p className="text-xs text-muted-foreground">{a.price}</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <a href={a.url} target="_blank" rel="noreferrer noopener">
                      Visit website
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl sm:text-4xl text-secondary-foreground">
            When to go
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-2 lg:grid-cols-4">
            {seasons.map((s) => (
              <div key={s.label} className="bg-card p-6">
                <p className="font-display text-xl">{s.label}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {s.months}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">{s.note}</p>
              </div>
            ))}
          </div>
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
