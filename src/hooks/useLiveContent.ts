import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_PILLARS, DEMO_PROJECTS, DEMO_STORIES } from '../demo/demoData';
import { Pillar, Project, Story } from '../types';

export function useLiveContent() {
  const [pillars, setPillars] = useState<Pillar[]>(DEMO_PILLARS);
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);
  const [stories, setStories] = useState<Story[]>(DEMO_STORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    async function loadData() {
      try {
        // Load Pillars
        const { data: dbPillars } = await supabase
          .from('pillars')
          .select('*')
          .order('display_order', { ascending: true });

        if (dbPillars && dbPillars.length > 0) {
          const mappedPillars: Pillar[] = dbPillars.map((p) => ({
            id: p.id as any,
            slug: p.slug,
            name: p.name,
            tagline: p.tagline,
            description: p.description,
            longDescription: p.long_description,
            accentColor: p.accent_color,
            badgeBg: `bg-[${p.accent_color}]/10 text-[${p.accent_color}]`,
            iconName: p.icon_name,
            coverImage: p.cover_image,
            kpiLabel: p.kpi_label,
            kpiValue: p.kpi_value,
            goalCents: p.goal_cents,
            raisedCents: p.raised_cents,
            projectsCount: 0,
            storiesCount: 0,
            tangibleImpactExamples: p.tangible_impact_examples || [],
          }));
          setPillars(mappedPillars);
        }

        // Load Projects
        const { data: dbProjects } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbProjects && dbProjects.length > 0) {
          const mappedProjects: Project[] = dbProjects.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            tagline: p.tagline,
            summary: p.summary,
            fullStory: p.full_story,
            pillarId: p.pillar_id || 'general',
            status: p.status || 'active',
            state: p.state,
            city: p.city,
            lat: p.lat,
            lng: p.lng,
            goalCents: p.goal_cents,
            raisedCents: p.raised_cents,
            donorsCount: p.donors_count || 0,
            daysRemaining: p.days_remaining || 30,
            coverImage: p.cover_image,
            galleryImages: p.gallery_images || [],
            budgetBreakdown: p.budget_breakdown || [],
            milestones: [],
            updates: [],
            createdAt: p.created_at,
          }));
          setProjects(mappedProjects);
        }

        // Load Stories
        const { data: dbStories } = await supabase
          .from('stories')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (dbStories && dbStories.length > 0) {
          const mappedStories: Story[] = dbStories.map((s) => ({
            id: s.id,
            slug: s.slug,
            title: s.title,
            pillarId: s.pillar_id || 'general',
            participantName: s.participant_name,
            participantRole: s.participant_role,
            location: s.location,
            state: s.state,
            year: s.year || 2026,
            quote: s.quote,
            storyBody: s.story_body,
            amountThatMadeItPossibleCents: s.amount_cents,
            outcomeMetric: s.outcome_metric,
            heroImage: s.hero_image,
            beforeImage: s.before_image,
            afterImage: s.after_image,
            videoUrl: s.video_url,
            consentApproved: s.consent_status === 'approved',
          }));
          setStories(mappedStories);
        }
      } catch (err) {
        console.warn('Could not load live Supabase content, using cached baseline', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();

    // Subscribe to realtime project updates
    const projectSub = supabase
      .channel('projects_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectSub);
    };
  }, []);

  return { pillars, projects, stories, isLoading };
}
