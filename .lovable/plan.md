# Wild Cape — app-style rebuild + feature upgrades

Turn the current marketing site into something that reads and behaves like a mobile app, and ship the improvements discussed.

## App shell (the "feels like an app" part)

- Bottom tab bar on mobile (Explore, Search, Saved, Giving, Account) with active-state icons; sidebar rail on desktop.
- Compact sticky top bar with page title and back arrow on sub-screens instead of a marketing header.
- Full-width scrollable content areas, rounded cards, safe-area padding, tap-sized targets.
- Bottom sheets instead of centre modals for booking on mobile.
- Skeleton loaders while data loads, toast confirmations, smooth page transitions.
- Installable as a home-screen app (manifest, icons, theme colour).

## Screens

1. **Explore** — hero Table Mountain card, category chips (Hiking, Ocean, Winelands, Air), activity cards.
2. **Activity detail** — own route per activity (`/activities/table-mountain-trails`) with gallery, price, season guidance, operator link, book button, and its own reviews. Real SEO metadata and share preview per activity.
3. **Search** — dedicated screen: text search plus filters for category, price band, and best season.
4. **Saved** — favourite activities kept on the device.
5. **Reviews** — visitors can submit a review tied to an activity; reviews stay hidden until approved, and approved ones show on the activity screen.
6. **Giving back** — existing charity content restyled as an app screen.
7. **Contact** — existing form restyled.
8. **Account / Admin** — sign in (email + Google). Signed-in owner sees bookings, contact messages, and pending reviews to approve.

## Backend work

- Move activities into the database so detail pages, filters, and reviews reference real rows (seeded with the current four).
- New `reviews` table with approved/pending state; public reads only approved rows, owner reads all.
- Owner role table plus read policies so bookings and messages become viewable in-app by the owner only.
- Booking confirmation email to the visitor and a notification to you when a booking arrives.

## Technical notes

- New routes under `src/routes/`, with the owner dashboard under a protected `_authenticated` subtree; public screens stay server-rendered for SEO.
- Data reads/writes through server functions; reviews and bookings validated with Zod.
- Shell components (`AppShell`, `BottomNav`, `TopBar`) replace the duplicated headers/footers in the three existing route files.
- Design tokens stay the current green/brown/white palette; no hardcoded colours.
- Email sending requires a verified sender domain — I will flag what is needed when that step is reached.

## Order of work

1. App shell + restyle existing screens
2. Activities in the database + detail routes
3. Search & filters, Saved
4. Auth + owner dashboard (bookings, messages)
5. Reviews with moderation
6. Emails + install/PWA polish
