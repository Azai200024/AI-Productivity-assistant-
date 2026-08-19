CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  operator text NOT NULL,
  operator_url text NOT NULL,
  category text NOT NULL,
  price_from integer NOT NULL DEFAULT 0,
  price_label text NOT NULL,
  blurb text NOT NULL,
  description text NOT NULL,
  best_season text NOT NULL,
  duration text NOT NULL DEFAULT '',
  meeting_point text NOT NULL DEFAULT '',
  image_key text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activities TO anon;
GRANT SELECT ON public.activities TO authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activities are public" ON public.activities FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_slug text NOT NULL REFERENCES public.activities(slug) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_location text,
  rating integer NOT NULL DEFAULT 5,
  quote text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved reviews are public" ON public.reviews FOR SELECT TO anon, authenticated USING (approved = true);
CREATE POLICY "Anyone can submit a review" ON public.reviews FOR INSERT TO anon, authenticated
  WITH CHECK (
    approved = false
    AND length(author_name) BETWEEN 1 AND 100
    AND COALESCE(length(author_location), 0) <= 100
    AND rating BETWEEN 1 AND 5
    AND length(quote) BETWEEN 1 AND 1000
  );
CREATE POLICY "Admins can read all reviews" ON public.reviews FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update reviews" ON public.reviews FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.bookings TO authenticated;
GRANT SELECT ON public.contact_messages TO authenticated;
CREATE POLICY "Admins can read bookings" ON public.bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read contact messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.activities (slug, name, operator, operator_url, category, price_from, price_label, blurb, description, best_season, duration, meeting_point, image_key, sort_order) VALUES
('table-mountain-trails', 'Table Mountain Trails', 'Cape Town Hiking Co.', 'https://capetownhiking.co.za', 'Hiking', 650, 'From R650 pp', 'Guided sunrise ascents up Platteklip and Skeleton Gorge, with fynbos and waterfall detours.', 'Start in the dark at the Platteklip trailhead and summit as the sun lifts over the Hottentots Holland. Your guide sets a steady pace, points out fynbos species found nowhere else on earth, and takes the quiet contour path back down past the reservoirs. Includes water, trail snacks and cableway assistance if you would rather ride down.', 'Autumn', '4 – 6 hours', 'Platteklip Gorge trailhead, Tafelberg Road', 'hiking', 1),
('kelp-forest-paddle', 'Kelp Forest Paddle', 'Kaskazi Kayaks', 'https://kayak.co.za', 'Ocean', 550, 'From R550 pp', 'Two-hour sea kayak from Three Anchor Bay past kelp beds, often alongside seals and dolphins.', 'Launch from Three Anchor Bay into the Atlantic with Table Mountain at your shoulder. Stable double kayaks make this suitable for beginners, and the guides read the swell carefully. Seals are near guaranteed, dolphins are common, and in season southern right whales surface just beyond the kelp line.', 'Summer', '2 hours', 'Three Anchor Bay slipway, Sea Point', 'kayak', 2),
('winelands-day-escape', 'Winelands Day Escape', 'Wine Flies Tours', 'https://wineflies.co.za', 'Winelands', 1350, 'From R1 350 pp', 'Stellenbosch and Franschhoek estates below the granite peaks, tastings and a valley lunch.', 'A full day through the Cape Winelands with a driver who actually knows the winemakers. Five tastings across boutique and heritage estates, a cheese pairing, and a long lunch in the Franschhoek valley. Small groups only, hotel pick-up included across the city bowl and Atlantic seaboard.', 'Autumn', '8 hours', 'Hotel pick-up, Cape Town city bowl', 'wine', 3),
('signal-hill-tandem-flight', 'Signal Hill Tandem Flight', 'Cape Town Tandem Paragliding', 'https://paraglide.co.za', 'Air', 1800, 'From R1 800 pp', 'Step off Signal Hill and glide over the city bowl and Atlantic seaboard with a certified pilot.', 'No experience needed: you run three steps off Signal Hill and the wing does the rest. Flights last eight to fifteen minutes depending on conditions, landing on the grass at the Sea Point promenade. Certified tandem pilots, full safety brief, and photos from a wing-mounted camera included.', 'Autumn', '1 hour total, 10 – 15 min airborne', 'Signal Hill upper parking, Cape Town', 'paraglide', 4);

INSERT INTO public.reviews (activity_slug, author_name, author_location, rating, quote, approved) VALUES
('table-mountain-trails', 'Thandi M.', 'Johannesburg', 5, 'Booked the sunrise Platteklip hike through Wild Cape and had the guide''s number within an hour. Being above the cloud tablecloth at 6am is something I''ll never forget.', true),
('kelp-forest-paddle', 'Daniel V.', 'Rotterdam', 5, 'The app made picking an operator easy — real prices, no upsell. A seal swam under my kayak twice. Worth every rand.', true),
('winelands-day-escape', 'Ayanda K.', 'Cape Town', 5, 'I live here and still found estates I''d never heard of. Everything listed was accurate, right down to the lunch stop.', true),
('signal-hill-tandem-flight', 'Sarah L.', 'London', 5, 'Nervous flyer, incredible pilot. I liked that the app tells you which season is actually best — we went in autumn and the air was glass.', true);