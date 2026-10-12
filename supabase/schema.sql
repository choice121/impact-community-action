-- ============================================================================
-- IMPACT COMMUNITY ACTION (ICA) - PRODUCTION SUPABASE DATABASE SCHEMA
-- File: supabase/schema.sql
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUMS & ROLES
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'admin',
    'finance',
    'program_manager',
    'volunteer_coordinator',
    'content_editor',
    'donor',
    'volunteer'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE donation_frequency AS ENUM ('once', 'monthly', 'annually');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE donation_status AS ENUM ('pending', 'confirmed', 'refunded', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('active', 'fully-funded', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Helper function to check if current user has any staff or admin role
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'finance', 'program_manager', 'volunteer_coordinator', 'content_editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_role(required_role user_role)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND (role = required_role OR role = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 2. USER PROFILES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'donor',
  avatar_url TEXT,
  phone TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger to create public.profile on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'donor'::user_role)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- 3. SITE SETTINGS & BRAND CONFIGURATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  legal_name TEXT NOT NULL DEFAULT 'Impact Community Action, Inc.',
  short_name TEXT NOT NULL DEFAULT 'ICA',
  tagline TEXT NOT NULL DEFAULT 'Small acts. Real impact.',
  ein TEXT NOT NULL DEFAULT '84-2194820',
  street_address TEXT NOT NULL DEFAULT '742 North Highland Avenue, Suite 400',
  city TEXT NOT NULL DEFAULT 'Columbus',
  state TEXT NOT NULL DEFAULT 'OH',
  zip TEXT NOT NULL DEFAULT '43215',
  country TEXT NOT NULL DEFAULT 'United States',
  phone TEXT NOT NULL DEFAULT '(614) 252-2799',
  email TEXT NOT NULL DEFAULT 'giving@impactaction.org',
  default_donation_url TEXT NOT NULL DEFAULT 'https://donate.stripe.com/demo_ica_giving',
  social_links JSONB DEFAULT '{"facebook":"","instagram":"","linkedin":"","youtube":""}'::jsonb,
  base_counters JSONB DEFAULT '{
    "mealsDelivered": 184520,
    "nightsSheltered": 42180,
    "familiesAssisted": 14650,
    "childrenSupported": 8920,
    "emergencyAidDeployed": 1240000,
    "volunteersMobilized": 3450
  }'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 4. CAUSE PILLARS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pillars (
  id TEXT PRIMARY KEY, -- 'hunger', 'housing', etc.
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  kpi_label TEXT NOT NULL,
  kpi_value TEXT NOT NULL,
  goal_cents BIGINT NOT NULL DEFAULT 0,
  raised_cents BIGINT NOT NULL DEFAULT 0,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  tangible_impact_examples JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 5. PROJECTS & MILESTONES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_story TEXT NOT NULL,
  pillar_id TEXT REFERENCES public.pillars(id) ON DELETE SET NULL,
  status project_status NOT NULL DEFAULT 'active',
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  goal_cents BIGINT NOT NULL,
  raised_cents BIGINT NOT NULL DEFAULT 0,
  donors_count INT NOT NULL DEFAULT 0,
  days_remaining INT NOT NULL DEFAULT 30,
  cover_image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  budget_breakdown JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_date TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 6. STORIES & ETHICAL CONSENT
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  pillar_id TEXT REFERENCES public.pillars(id) ON DELETE SET NULL,
  participant_name TEXT NOT NULL,
  participant_role TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  year INT NOT NULL DEFAULT 2026,
  quote TEXT NOT NULL,
  story_body TEXT NOT NULL,
  amount_cents BIGINT NOT NULL,
  outcome_metric TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  before_image TEXT,
  after_image TEXT,
  video_url TEXT,
  related_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  consent_status TEXT NOT NULL DEFAULT 'approved',
  consent_file_path TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Participant story submissions queue (from /stories public form)
CREATE TABLE IF NOT EXISTS public.story_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id TEXT REFERENCES public.pillars(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  location_city TEXT NOT NULL,
  story_body TEXT NOT NULL,
  first_name_only BOOLEAN NOT NULL DEFAULT true,
  consent_granted BOOLEAN NOT NULL DEFAULT true,
  consent_file_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 7. TESTIMONIALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  role TEXT NOT NULL,
  organization TEXT,
  avatar_url TEXT NOT NULL,
  pillar_id TEXT REFERENCES public.pillars(id) ON DELETE SET NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- ============================================================================
-- 8. DONATIONS & LIVE PUBLIC ACTIVITY FEED
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  donor_email TEXT NOT NULL,
  donor_name TEXT NOT NULL,
  amount_cents BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  frequency donation_frequency NOT NULL DEFAULT 'once',
  pillar_id TEXT REFERENCES public.pillars(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  in_honor_of TEXT,
  message TEXT,
  status donation_status NOT NULL DEFAULT 'confirmed',
  source TEXT DEFAULT 'web',
  external_ref TEXT,
  receipt_number TEXT UNIQUE NOT NULL,
  recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger-maintained feed respecting donor privacy (safe for public read)
CREATE TABLE IF NOT EXISTS public.public_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE,
  donor_name TEXT NOT NULL, -- "Sarah M." or "Anonymous Donor"
  amount_cents BIGINT NOT NULL,
  pillar_id TEXT,
  pillar_name TEXT NOT NULL,
  project_title TEXT,
  frequency donation_frequency NOT NULL DEFAULT 'once',
  in_honor_of TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 9. VOLUNTEER HUB
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.volunteer_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  pillar_id TEXT REFERENCES public.pillars(id) ON DELETE SET NULL,
  date_time TIMESTAMPTZ NOT NULL,
  duration_hours INT NOT NULL DEFAULT 3,
  slots_available INT NOT NULL DEFAULT 10,
  slots_filled INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.volunteer_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES public.volunteer_opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  volunteer_name TEXT NOT NULL,
  volunteer_email TEXT NOT NULL,
  volunteer_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.volunteer_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.volunteer_opportunities(id) ON DELETE SET NULL,
  hours_logged NUMERIC(5,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved',
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 10. GET HELP APPLICATIONS (STRICTLY SENSITIVE / PRIVATE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.help_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT UNIQUE NOT NULL,
  pillar_id TEXT REFERENCES public.pillars(id) ON DELETE SET NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  household_size INT NOT NULL DEFAULT 1,
  urgency TEXT NOT NULL DEFAULT 'immediate',
  preferred_contact TEXT NOT NULL DEFAULT 'phone',
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received', -- 'received', 'under_review', 'approved', 'disbursed'
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 11. EVENTS, NEWS & REPORTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  is_virtual BOOLEAN NOT NULL DEFAULT false,
  cover_image TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  pillar_id TEXT REFERENCES public.pillars(id) ON DELETE SET NULL,
  cover_image TEXT NOT NULL,
  author TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INT NOT NULL,
  file_url TEXT NOT NULL,
  file_size TEXT NOT NULL,
  pages INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  double_opt_in_confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 12. AUDIT LOG (FINANCIAL & RECORD INTEGRITY)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  payload JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 13. TRIGGERS FOR DONATIONS, COUNTERS, ACTIVITY, & AUDIT
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_confirmed_donation()
RETURNS trigger AS $$
DECLARE
  v_pillar_name TEXT := 'Where Needed Most';
  v_project_title TEXT := NULL;
  v_display_name TEXT;
BEGIN
  -- Only execute if donation is confirmed
  IF new.status = 'confirmed' AND (old IS NULL OR old.status != 'confirmed') THEN
    
    -- 1. Update Project total and donor count if specified
    IF new.project_id IS NOT NULL THEN
      UPDATE public.projects
      SET raised_cents = raised_cents + new.amount_cents,
          donors_count = donors_count + 1,
          updated_at = timezone('utc'::text, now())
      WHERE id = new.project_id
      RETURNING title INTO v_project_title;
    END IF;

    -- 2. Update Pillar total if specified
    IF new.pillar_id IS NOT NULL AND new.pillar_id != 'general' THEN
      UPDATE public.pillars
      SET raised_cents = raised_cents + new.amount_cents
      WHERE id = new.pillar_id
      RETURNING name INTO v_pillar_name;
    END IF;

    -- 3. Calculate privacy-respecting donor name
    IF new.is_anonymous THEN
      v_display_name := 'Anonymous Donor';
    ELSE
      -- Format "Firstname L."
      v_display_name := split_part(new.donor_name, ' ', 1);
      IF length(new.donor_name) > length(v_display_name) THEN
        v_display_name := v_display_name || ' ' || substring(split_part(new.donor_name, ' ', 2) from 1 for 1) || '.';
      END IF;
    END IF;

    -- 4. Insert into public_activity feed
    INSERT INTO public.public_activity (
      donation_id,
      donor_name,
      amount_cents,
      pillar_id,
      pillar_name,
      project_title,
      frequency,
      in_honor_of
    ) VALUES (
      new.id,
      v_display_name,
      new.amount_cents,
      new.pillar_id,
      v_pillar_name,
      v_project_title,
      new.frequency,
      new.in_honor_of
    );

    -- 5. Record entry in audit_log
    INSERT INTO public.audit_log (
      action,
      actor_id,
      entity_type,
      entity_id,
      payload
    ) VALUES (
      'donation_confirmed',
      new.donor_id,
      'donations',
      new.id::text,
      json_build_object(
        'amount_cents', new.amount_cents,
        'receipt_number', new.receipt_number,
        'pillar_id', new.pillar_id,
        'project_id', new.project_id
      )::jsonb
    );

  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_donation_confirmed ON public.donations;
CREATE TRIGGER on_donation_confirmed
  AFTER INSERT OR UPDATE ON public.donations
  FOR EACH ROW EXECUTE PROCEDURE public.handle_confirmed_donation();

-- ============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Public can read site_settings, pillars, projects, stories, testimonials, events, reports, public_activity
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read pillars" ON public.pillars FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read project_milestones" ON public.project_milestones FOR SELECT USING (true);
CREATE POLICY "Public read project_updates" ON public.project_updates FOR SELECT USING (true);
CREATE POLICY "Public read published stories" ON public.stories FOR SELECT USING (published = true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read public_activity" ON public.public_activity FOR SELECT USING (true);
CREATE POLICY "Public read volunteer_opportunities" ON public.volunteer_opportunities FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read posts" ON public.posts FOR SELECT USING (published = true);
CREATE POLICY "Public read reports" ON public.reports FOR SELECT USING (true);

-- Public can insert new newsletter subscribers, story submissions, event registrations
CREATE POLICY "Public insert subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert story_submissions" ON public.story_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert event_registrations" ON public.event_registrations FOR INSERT WITH CHECK (true);

-- Profiles: users read their own; staff read all
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_staff());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- Donations: donors read only their own; staff read all; inserts allowed
CREATE POLICY "Donors read own donations" ON public.donations FOR SELECT USING (donor_id = auth.uid() OR public.is_staff());
CREATE POLICY "Staff insert donations" ON public.donations FOR INSERT WITH CHECK (true);

-- Help Applications: STRICT RLS. Applicant reads their own; staff reads all; public can submit
CREATE POLICY "Applicant read own application" ON public.help_applications FOR SELECT USING (applicant_email = (auth.jwt()->>'email') OR public.is_staff());
CREATE POLICY "Public insert help application" ON public.help_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff manage help applications" ON public.help_applications FOR ALL USING (public.is_staff());

-- Staff full management on CMS tables
CREATE POLICY "Staff manage site_settings" ON public.site_settings FOR ALL USING (public.is_staff());
CREATE POLICY "Staff manage pillars" ON public.pillars FOR ALL USING (public.is_staff());
CREATE POLICY "Staff manage projects" ON public.projects FOR ALL USING (public.is_staff());
CREATE POLICY "Staff manage stories" ON public.stories FOR ALL USING (public.is_staff());
CREATE POLICY "Staff manage audit_log" ON public.audit_log FOR SELECT USING (public.is_staff());

-- ============================================================================
-- 15. SEED DATA (INITIAL SITE SETTINGS & PILLARS)
-- ============================================================================
INSERT INTO public.site_settings (id, legal_name, short_name, tagline, ein)
VALUES ('primary', 'Impact Community Action, Inc.', 'ICA', 'Small acts. Real impact.', '84-2194820')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.pillars (id, slug, name, tagline, description, long_description, accent_color, icon_name, cover_image, kpi_label, kpi_value, goal_cents, raised_cents, display_order)
VALUES
  ('hunger', 'hunger-and-nutrition', 'Hunger & Nutrition', 'Fresh, dignified food for every neighborhood kitchen.', 'Eliminating food deserts through community pantries and cold storage distribution.', 'Direct emergency pantries and farm-direct cold distribution hubs.', '#E8873A', 'Apple', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80', 'Nutritious Meals Delivered', '184,520', 35000000, 28450000, 1),
  ('housing', 'housing-and-homelessness', 'Housing & Homelessness', 'Rapid shelter, eviction prevention, and permanent stability.', 'Emergency rent relief grants and eviction court conciliation.', 'Direct landlord back-rent settlement stopping court lockouts within 24 hours.', '#2F6DB5', 'Home', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80', 'Nights of Safe Shelter', '42,180', 48000000, 41200000, 2),
  ('health', 'health-and-wellness', 'Health & Wellness', 'Preventive care, prescription assistance, and mental wellbeing.', 'Neighborhood screenings, vital insulin emergency funds, and counseling.', 'Preventive blood pressure, insulin, and pediatric co-pay assistance.', '#D64F6A', 'HeartPulse', 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80', 'Patients Screened & Aided', '19,340', 30000000, 23900000, 3),
  ('education', 'education-and-youth', 'Education & Youth', 'Closing the resource gap from kindergarten to trade certification.', 'STEM labs, 1-on-1 tutoring, and digital equity laptops.', 'Rural public library workstations and vocational licensing grants.', '#7A5CC7', 'GraduationCap', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80', 'Students Mentored', '8,920', 26000000, 21800000, 4),
  ('families', 'families-and-economic-opportunity', 'Families & Opportunity', 'Equipping working parents with financial literacy, childcare, and career growth.', 'Subsidized evening daycare micro-grants for vocational trade apprentices.', 'Underwriting evening childcare so single parents can finish nurse certifications.', '#1E9E8A', 'Users', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80', 'Families Stabilized', '14,650', 32000000, 26100000, 5),
  ('disaster', 'disaster-relief', 'Disaster Relief', 'First on the scene, last to leave when storm or fire strikes.', 'Industrial dehumidifiers, emergency clean drinking water, and roof tarps.', 'Mobile response trailers deployed within 6 hours of flood or storm damage.', '#D9472B', 'ShieldAlert', 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80', 'Emergency Aid Deployed', '$1.24M', 20000000, 17800000, 6),
  ('seniors', 'seniors-veterans-and-community', 'Seniors & Veterans', 'Honoring those who served and supporting our community elders with dignity.', 'Exterior aluminum accessibility ramps, winter weatherization, and companion care.', 'Union carpenter built ADA wheelchair ramps restoring home freedom.', '#4C7A4F', 'Award', 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=80', 'Veterans & Seniors Reached', '6,410', 22000000, 19100000, 7)
ON CONFLICT (id) DO NOTHING;
