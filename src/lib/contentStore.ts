import {
  Project,
  Story,
  CommunityEvent,
  NewsPost,
  VolunteerOpportunity,
  Pillar,
} from '../types';
import {
  DEMO_PILLARS,
  DEMO_PROJECTS,
  DEMO_STORIES,
  DEMO_EVENTS,
  DEMO_NEWS,
  DEMO_VOLUNTEER_OPPORTUNITIES,
} from '../demo/demoData';

const STORAGE_KEYS = {
  PROJECTS: 'ica_custom_projects',
  STORIES: 'ica_custom_stories',
  EVENTS: 'ica_custom_events',
  NEWS: 'ica_custom_news',
  VOLUNTEERS: 'ica_custom_volunteers',
};

const EVENT_NAME = 'ica_content_store_updated';

// Helper to safely read from localStorage
function getStoredItems<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return [];
  }
}

// Helper to safely write to localStorage
function setStoredItems<T>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key } }));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export const ContentStore = {
  // Projects
  getProjects(): Project[] {
    const custom = getStoredItems<Project>(STORAGE_KEYS.PROJECTS);
    const customIds = new Set(custom.map((p) => p.id));
    const base = DEMO_PROJECTS.filter((p) => !customIds.has(p.id));
    return [...custom, ...base];
  },

  addProject(project: Project): void {
    const custom = getStoredItems<Project>(STORAGE_KEYS.PROJECTS);
    const filtered = custom.filter((p) => p.id !== project.id);
    setStoredItems(STORAGE_KEYS.PROJECTS, [project, ...filtered]);
  },

  // Stories
  getStories(): Story[] {
    const custom = getStoredItems<Story>(STORAGE_KEYS.STORIES);
    const customIds = new Set(custom.map((s) => s.id));
    const base = DEMO_STORIES.filter((s) => !customIds.has(s.id));
    return [...custom, ...base];
  },

  addStory(story: Story): void {
    const custom = getStoredItems<Story>(STORAGE_KEYS.STORIES);
    const filtered = custom.filter((s) => s.id !== story.id);
    setStoredItems(STORAGE_KEYS.STORIES, [story, ...filtered]);
  },

  // Events
  getEvents(): CommunityEvent[] {
    const custom = getStoredItems<CommunityEvent>(STORAGE_KEYS.EVENTS);
    const customIds = new Set(custom.map((e) => e.id));
    const base = (DEMO_EVENTS as CommunityEvent[]).filter((e) => !customIds.has(e.id));
    return [...custom, ...base];
  },

  addEvent(event: CommunityEvent): void {
    const custom = getStoredItems<CommunityEvent>(STORAGE_KEYS.EVENTS);
    const filtered = custom.filter((e) => e.id !== event.id);
    setStoredItems(STORAGE_KEYS.EVENTS, [event, ...filtered]);
  },

  // News
  getNews(): NewsPost[] {
    const custom = getStoredItems<NewsPost>(STORAGE_KEYS.NEWS);
    const customIds = new Set(custom.map((n) => n.id));
    const base = (DEMO_NEWS as NewsPost[]).filter((n) => !customIds.has(n.id));
    return [...custom, ...base];
  },

  addNews(news: NewsPost): void {
    const custom = getStoredItems<NewsPost>(STORAGE_KEYS.NEWS);
    const filtered = custom.filter((n) => n.id !== news.id);
    setStoredItems(STORAGE_KEYS.NEWS, [news, ...filtered]);
  },

  // Volunteer Opportunities
  getVolunteerOpportunities(): VolunteerOpportunity[] {
    const custom = getStoredItems<VolunteerOpportunity>(STORAGE_KEYS.VOLUNTEERS);
    const customIds = new Set(custom.map((v) => v.id));
    const base = (DEMO_VOLUNTEER_OPPORTUNITIES as VolunteerOpportunity[]).filter((v) => !customIds.has(v.id));
    return [...custom, ...base];
  },

  addVolunteerOpportunity(opp: VolunteerOpportunity): void {
    const custom = getStoredItems<VolunteerOpportunity>(STORAGE_KEYS.VOLUNTEERS);
    const filtered = custom.filter((v) => v.id !== opp.id);
    setStoredItems(STORAGE_KEYS.VOLUNTEERS, [opp, ...filtered]);
  },

  // Delete an item of any type
  deleteItem(type: 'project' | 'story' | 'event' | 'news' | 'volunteer', id: string): void {
    switch (type) {
      case 'project': {
        const custom = getStoredItems<Project>(STORAGE_KEYS.PROJECTS);
        setStoredItems(STORAGE_KEYS.PROJECTS, custom.filter((p) => p.id !== id));
        break;
      }
      case 'story': {
        const custom = getStoredItems<Story>(STORAGE_KEYS.STORIES);
        setStoredItems(STORAGE_KEYS.STORIES, custom.filter((s) => s.id !== id));
        break;
      }
      case 'event': {
        const custom = getStoredItems<CommunityEvent>(STORAGE_KEYS.EVENTS);
        setStoredItems(STORAGE_KEYS.EVENTS, custom.filter((e) => e.id !== id));
        break;
      }
      case 'news': {
        const custom = getStoredItems<NewsPost>(STORAGE_KEYS.NEWS);
        setStoredItems(STORAGE_KEYS.NEWS, custom.filter((n) => n.id !== id));
        break;
      }
      case 'volunteer': {
        const custom = getStoredItems<VolunteerOpportunity>(STORAGE_KEYS.VOLUNTEERS);
        setStoredItems(STORAGE_KEYS.VOLUNTEERS, custom.filter((v) => v.id !== id));
        break;
      }
    }
  },

  // Get counts of custom scraped items
  getCustomCounts(): { projects: number; stories: number; events: number; news: number; volunteers: number } {
    return {
      projects: getStoredItems<Project>(STORAGE_KEYS.PROJECTS).length,
      stories: getStoredItems<Story>(STORAGE_KEYS.STORIES).length,
      events: getStoredItems<CommunityEvent>(STORAGE_KEYS.EVENTS).length,
      news: getStoredItems<NewsPost>(STORAGE_KEYS.NEWS).length,
      volunteers: getStoredItems<VolunteerOpportunity>(STORAGE_KEYS.VOLUNTEERS).length,
    };
  },

  // Reset all custom data
  resetAllCustom(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { all: true } }));
  },

  // Export all current active items as JSON
  exportAllContent(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      projects: this.getProjects(),
      stories: this.getStories(),
      events: this.getEvents(),
      news: this.getNews(),
      volunteerOpportunities: this.getVolunteerOpportunities(),
      pillars: DEMO_PILLARS,
    };
    return JSON.stringify(data, null, 2);
  },

  // Subscribe to updates
  subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => callback();
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  },
};
