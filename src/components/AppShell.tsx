import type { ReactNode } from "react";
import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Compass, Heart, Search, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Explore", icon: Compass, exact: true },
  { to: "/search", label: "Search", icon: Search, exact: false },
  { to: "/saved", label: "Saved", icon: Heart, exact: false },
  { to: "/charity", label: "Giving", icon: Sparkles, exact: false },
  { to: "/account", label: "Account", icon: User, exact: false },
] as const;

export function TopBar({
  title,
  showBack,
  action,
  transparent,
}: {
  title?: string;
  showBack?: boolean;
  action?: ReactNode;
  transparent?: boolean;
}) {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-3 px-4",
        transparent
          ? "bg-transparent"
          : "border-b border-border bg-background/85 backdrop-blur-md",
      )}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {showBack ? (
        <button
          type="button"
          aria-label="Go back"
          onClick={() => (canGoBack ? router.history.back() : router.navigate({ to: "/" }))}
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : null}
      <p className="truncate font-display text-lg tracking-tight">{title ?? "Wild Cape"}</p>
      <div className="ml-auto flex items-center gap-2">{action}</div>
    </header>
  );
}

function TabItems({ variant }: { variant: "bottom" | "rail" }) {
  return (
    <>
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          activeOptions={{ exact: tab.exact }}
          className={cn(
            "group flex items-center justify-center gap-3 rounded-xl text-muted-foreground transition-colors",
            variant === "bottom"
              ? "flex-1 flex-col gap-1 py-2 text-[11px]"
              : "w-full px-3 py-2.5 text-sm justify-start",
          )}
          activeProps={{ className: "text-primary bg-primary/10" }}
        >
          <tab.icon className="h-5 w-5" aria-hidden="true" />
          <span className={variant === "bottom" ? "" : "font-medium"}>{tab.label}</span>
        </Link>
      ))}
    </>
  );
}

export function AppShell({
  children,
  title,
  showBack,
  action,
  transparentBar,
  hideTopBar,
}: {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  action?: ReactNode;
  transparentBar?: boolean;
  hideTopBar?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground md:flex">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card px-3 py-6 md:flex">
        <Link to="/" className="px-3 pb-6 font-display text-xl tracking-tight">
          Wild Cape
        </Link>
        <nav className="flex flex-col gap-1">
          <TabItems variant="rail" />
        </nav>
        <p className="mt-auto px-3 text-xs text-muted-foreground">
          An independent guide to Cape Town's outdoors.
        </p>
      </aside>

      <div className="relative flex min-h-screen w-full flex-col">
        {hideTopBar ? null : (
          <div className={transparentBar ? "absolute inset-x-0 top-0 z-30" : "md:hidden"}>
            <TopBar
              title={title}
              showBack={showBack}
              action={action}
              transparent={transparentBar}
            />
          </div>
        )}

        <main className="flex-1 pb-24 md:pb-10">{children}</main>

        <nav
          className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background/90 px-2 pt-1 backdrop-blur-md md:hidden"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)" }}
        >
          <TabItems variant="bottom" />
        </nav>
      </div>
    </div>
  );
}
