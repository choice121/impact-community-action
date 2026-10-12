import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_PILLARS } from '../demo/demoData';
import { ContentStore } from '../lib/contentStore';
import { Pillar, Project, Story, CommunityEvent, NewsPost, VolunteerOpportunity } from '../types';

export function useLiveContent() {
  const [pillars, setPillars] = useState<Pillar[]>(DEMO_PILLARS);
  const [projects, setProjects] = useState<Project[]>(() => ContentStore.getProjects());
  const [stories, setStories] = useState<Story[]>(() => ContentStore.getStories());
  const [events, setEvents] = useState<CommunityEvent[]>(() => ContentStore.getEvents());
  const [news, setNews] = useState<NewsPost[]>(() => ContentStore.getNews());
  const [volunteerOpportunities, setVolunteerOpportunities] = useState<VolunteerOpportunity[]>(() =>
    ContentStore.getVolunteerOpportunities()
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const syncLocalStore = useCallback(() => {
    setProjects(ContentStore.getProjects());
    setStories(ContentStore.getStories());
    setEvents(ContentStore.getEvents());
    setNews(ContentStore.getNews());
    setVolunteerOpportunities(ContentStore.getVolunteerOpportunities());
  }, []);

  useEffect(() => {
    // Listen for local ContentStore updates
    const unsubscribeStore = ContentStore.subscribe(() => {
      syncLocalStore();
    });

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return unsubscribeStore;
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
          
          // Merge with custom stored projects (custom projects take precedence)
          const custom = ContentStore.getProjects().filter((cp) => cp.id.startsWith('scraped-') || cp.id.startsWith('custom-'));
          const existingIds = new Set(custom.map(c => c.id));
          const combined = [...custom, ...mappedProjects.filter(mp => !existingIds.has(mp.id))];
          setProjects(combined);
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
          
          const custom = ContentStore.getStories().filter((cs) => cs.id.startsWith('scraped-') || cs.id.startsWith('custom-'));
          const existingIds = new Set(custom.map(c => c.id));
          const combined = [...custom, ...mappedStories.filter(ms => !existingIds.has(ms.id))];
          setStories(combined);
        }
      } catch (err) {
        console.warn('Could not load live Supabase content, using ContentStore baseline', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();

    // Subscribe to realtime project updates if Supabase configured
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
      unsubscribeStore();
      supabase.removeChannel(projectSub);
    };
  }, [syncLocalStore]);

  return {
    pillars,
    projects,
    stories,
    events,
    news,
    volunteerOpportunities,
    isLoading,
    refresh: syncLocalStore,
  };
}
