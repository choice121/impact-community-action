-- ============================================================================
-- IMPACT COMMUNITY ACTION (ICA) - PRODUCTION SUPABASE DATABASE SEED DATA
-- File: supabase/seed.sql
-- ============================================================================

-- 1. Projects
INSERT INTO public.projects (
  id, slug, title, tagline, summary, full_story, pillar_id, status, state, city, lat, lng,
  goal_cents, raised_cents, donors_count, days_remaining, cover_image
) VALUES
  (
    '0a110001-0000-0000-0000-000000000001',
    'community-cold-storage-hub',
    'Appalachian Community Cold-Storage Hub',
    'Commercial refrigeration & solar hub keeping farm produce fresh for rural families.',
    'Installing a commercial walk-in refrigeration and solar generator hub to salvage 45,000 lbs of surplus farm produce monthly for rural food pantries.',
    'Across three rural counties, family farmers lose up to 30% of perishable harvests due to lack of immediate cold distribution. This project funds an industrial walk-in refrigeration trailer, solar-battery backup array, and temperature-monitored vans connecting 16 grassroots community pantries.',
    'hunger',
    'active',
    'WV',
    'Charleston',
    38.3498,
    -81.6326,
    4500000,
    3825000,
    312,
    42,
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    '0a110001-0000-0000-0000-000000000002',
    'eviction-court-rapid-bridge',
    'Eviction Court Rapid Prevention Fund',
    'Immediate courtroom back-rent conciliation stopping family displacement in 3 hours.',
    'Providing emergency rent relief vouchers and conciliation services right inside county courthouses to stop families from becoming unhoused.',
    'When an eviction filing reaches court, the average amount owed is under $1,400. ICA staff station directly at courthouse conciliation desks, settling arrears directly with landlords within 3 hours and enrolling families in 6 months of stabilizing workforce coaching.',
    'housing',
    'active',
    'OH',
    'Columbus',
    39.9612,
    -82.9988,
    7500000,
    6900000,
    548,
    18,
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    '0a110001-0000-0000-0000-000000000003',
    'emergency-insulin-prescription-fund',
    'Emergency Insulin & Chronic Rx Lifeline',
    '90-day medication vouchers and testing supplies for uninsured hourly workers.',
    'Supplying urgent 90-day medication vouchers and testing supplies for uninsured and underinsured workers with chronic illness.',
    'Nobody should ever have to ration life-saving insulin or heart medications. ICA works with local independent pharmacies to guarantee immediate zero-delay prescription pick-up while navigating long-term manufacturer patient assistance programs.',
    'health',
    'active',
    'PA',
    'Pittsburgh',
    40.4406,
    -79.9959,
    3500000,
    2975000,
    240,
    35,
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    '0a110001-0000-0000-0000-000000000004',
    'eastside-stem-youth-incubator',
    'Eastside Youth Robotics & STEM Lab',
    'Digital fabrication labs, Python coding clubs, and paid high school internships.',
    'Equipping low-income middle schoolers with hands-on 3D printing, Python coding labs, and paid high school tech internships.',
    'Equipping students in under-resourced districts with modern digital fabrication equipment, robotics competition kits, and college engineering mentors who look like them.',
    'education',
    'active',
    'OH',
    'Cleveland',
    41.4993,
    -81.6944,
    2800000,
    2240000,
    185,
    54,
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    '0a110001-0000-0000-0000-000000000005',
    'evening-shift-childcare-stipends',
    'Single-Parent Night Shift Childcare Co-op',
    'Licensed evening childcare subsidies so parents can finish nursing and trade degrees.',
    'Covering verified evening childcare costs for single parents attending technical college or working hospital night rotations.',
    'Evening and weekend childcare is virtually non-existent in state subsidies. This co-op provides certified in-home childcare vouchers enabling 60 single mothers and fathers to complete registered nursing degrees and electrical apprenticeships.',
    'families',
    'active',
    'MI',
    'Detroit',
    42.3314,
    -83.0458,
    4200000,
    3650000,
    290,
    29,
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    '0a110001-0000-0000-0000-000000000006',
    'freedom-access-veteran-ramps',
    'Freedom Access: Home Ramps for Disabled Vets',
    'ADA aluminum ramps built in 48 hours so disabled veterans can safely leave home.',
    'Constructing ADA-compliant aluminum wheelchair ramps and doorway expansions so aging and wounded veterans can stay safe in their own homes.',
    'Teaming with retired union carpenters and apprentices to build high-grade modular aluminum ramps within 48 hours of veteran hospital discharge. Restoring independent living, dignity, and outdoor access.',
    'seniors',
    'active',
    'IN',
    'Indianapolis',
    39.7684,
    -86.1581,
    3100000,
    2850000,
    228,
    15,
    'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=80'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  full_story = EXCLUDED.full_story,
  goal_cents = EXCLUDED.goal_cents,
  raised_cents = EXCLUDED.raised_cents,
  donors_count = EXCLUDED.donors_count,
  days_remaining = EXCLUDED.days_remaining,
  cover_image = EXCLUDED.cover_image;

-- 2. Events
INSERT INTO public.events (id, slug, title, description, location, event_date, is_virtual, cover_image)
VALUES
  (
    '0a220001-0000-0000-0000-000000000001',
    'hope-and-impact-gala-2025',
    'Annual Hope & Impact Gala 2025',
    'An unforgettable evening honoring grassroots community champions, featuring guest keynote speakers, live acoustic performance, and our live fundraising pledge drive.',
    'The Grand Ballroom, Nationwide Center - 400 N High St, Columbus, OH',
    '2025-11-15T18:00:00Z',
    false,
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    '0a220001-0000-0000-0000-000000000002',
    'weekend-family-meal-packathon',
    'Weekend Family Meal Pack-a-Thon',
    'Join 80 fellow neighbors packing 2,500 emergency weekend meal bags for local elementary school students across Central Ohio.',
    'ICA Central Distribution Hub - 1200 E Broad St, Columbus, OH',
    '2025-10-25T09:00:00Z',
    false,
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    '0a220001-0000-0000-0000-000000000003',
    'freedom-access-ramp-build-day',
    'Freedom Access Community Ramp Build Day',
    'Teaming up with local union carpenters to construct two modular aluminum ramps for disabled veterans in Marion County.',
    'Veterans Community Center - 700 E 38th St, Indianapolis, IN',
    '2025-11-08T08:00:00Z',
    false,
    'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=80'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  location = EXCLUDED.location,
  event_date = EXCLUDED.event_date,
  cover_image = EXCLUDED.cover_image;

-- 3. Volunteer Opportunities
INSERT INTO public.volunteer_opportunities (
  id, title, description, location, state, pillar_id, date_time, duration_hours, slots_available, slots_filled
) VALUES
  (
    '0a330001-0000-0000-0000-000000000001',
    'Fresh Produce & Pantry Sorter',
    'Sort farm-fresh deliveries, assemble 50 lb family boxes, and load mobile distribution vans.',
    'Columbus Distribution Hub',
    'OH',
    'hunger',
    '2025-10-21T09:00:00Z',
    3,
    20,
    14
  ),
  (
    '0a330001-0000-0000-0000-000000000002',
    'Eviction Court Greeter & Navigator',
    'Station at municipal courthouse conciliation desks, welcoming frightened families and connecting them to emergency relief staff.',
    'Franklin County Municipal Court',
    'OH',
    'housing',
    '2025-10-22T08:30:00Z',
    4,
    8,
    5
  ),
  (
    '0a330001-0000-0000-0000-000000000003',
    'Elementary Reading & Homework Coach',
    'Provide 1-on-1 reading mentorship to elementary school students falling behind grade level.',
    'Southside Community Center',
    'OH',
    'education',
    '2025-10-23T15:30:00Z',
    2,
    15,
    11
  ),
  (
    '0a330001-0000-0000-0000-000000000004',
    'Veteran Wheelchair Ramp Assembly Crew',
    'Help bolt modular aluminum ramps into place under senior master carpenter supervision.',
    'Various Residential Sites, Indianapolis',
    'IN',
    'seniors',
    '2025-10-25T08:00:00Z',
    6,
    12,
    9
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slots_filled = EXCLUDED.slots_filled;

-- 4. Testimonials
INSERT INTO public.testimonials (
  quote, author_name, role, organization, avatar_url, pillar_id, display_order, is_active
) VALUES
  (
    'ICA is the most responsive community partner we have ever worked with. When an uninsured diabetic patient needs insulin or a single mom needs urgent shelter, ICA delivers within hours, not months.',
    'Dr. Evelyn Sanders',
    'Chief Medical Officer',
    'Midwest Regional Health Clinic',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    'health',
    1,
    true
  ),
  (
    'What makes ICA rare is absolute, unapologetic financial transparency. Every month I receive a personalized receipt showing the exact meals and nights of shelter my $75 made happen.',
    'David Morales',
    'Monthly Sustainer Donor',
    'ICA Supporter for 4 Years',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    null,
    2,
    true
  ),
  (
    'The ICA Rapid Eviction Bridge has cut our county lockouts by over 38%. Instead of putting families out on the street, ICA puts vouchers in landlord hands and peace in people''s hearts.',
    'Hon. Teresa Campbell',
    'Municipal Court Presiding Judge',
    'Franklin County Courts',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    'housing',
    3,
    true
  )
ON CONFLICT DO NOTHING;

-- 5. Reports
INSERT INTO public.reports (id, title, year, file_url, file_size, pages)
VALUES
  ('0a440001-0000-0000-0000-000000000001', '2024 Independent Audited Financial Statements', 2024, '/downloads/2024-audited-financials.pdf', '3.8 MB', 34),
  ('0a440001-0000-0000-0000-000000000002', '2024 IRS Form 990 (Public Disclosure)', 2024, '/downloads/2024-form-990.pdf', '4.2 MB', 48),
  ('0a440001-0000-0000-0000-000000000003', '2024 Annual Impact & Outcome Report', 2024, '/downloads/2024-annual-impact-report.pdf', '12.5 MB', 62),
  ('0a440001-0000-0000-0000-000000000004', '2023 Independent Audited Financial Statements', 2023, '/downloads/2023-audited-financials.pdf', '3.5 MB', 32),
  ('0a440001-0000-0000-0000-000000000005', '2023 IRS Form 990 (Public Disclosure)', 2023, '/downloads/2023-form-990.pdf', '3.9 MB', 46)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  year = EXCLUDED.year;

-- 6. Public Activity
INSERT INTO public.public_activity (donor_name, amount_cents, pillar_id, pillar_name, project_title, frequency)
VALUES
  ('Sarah M.', 15000, 'hunger', 'Hunger & Nutrition', 'Appalachian Community Cold-Storage Hub', 'once'),
  ('Robert T.', 5000, 'housing', 'Housing & Homelessness', 'Eviction Court Rapid Prevention Fund', 'monthly'),
  ('Elena R.', 25000, 'health', 'Health & Wellness', 'Emergency Insulin & Chronic Rx Lifeline', 'once'),
  ('Anonymous Donor', 100000, 'general', 'Where Needed Most', null, 'once'),
  ('James K.', 7500, 'education', 'Education & Youth', 'Eastside Youth Robotics & STEM Lab', 'monthly'),
  ('Aaliyah W.', 50000, 'families', 'Families & Opportunity', 'Single-Parent Night Shift Childcare Co-op', 'once'),
  ('Thomas B.', 12000, 'seniors', 'Seniors & Veterans', 'Freedom Access: Home Ramps for Disabled Vets', 'once')
ON CONFLICT DO NOTHING;
