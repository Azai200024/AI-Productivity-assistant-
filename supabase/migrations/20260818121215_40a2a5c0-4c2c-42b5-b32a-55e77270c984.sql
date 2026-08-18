CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity TEXT NOT NULL,
  operator TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_date DATE,
  party_size INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.bookings TO anon;
GRANT INSERT ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a booking"
  ON public.bookings FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND length(activity) BETWEEN 1 AND 200
    AND coalesce(length(notes), 0) <= 1000
    AND party_size BETWEEN 1 AND 50
  );

CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_messages TO anon;
GRANT INSERT ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send a contact message"
  ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND coalesce(length(subject), 0) <= 200
    AND length(message) BETWEEN 1 AND 2000
  );