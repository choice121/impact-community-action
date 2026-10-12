import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Sparkles,
  Download,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FolderPlus,
  FileCheck,
  Calendar,
  Users,
  Newspaper,
  ArrowRight,
  Layers,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import {
  scrapeUrlContent,
  COMMUNITY_SCRAPE_PRESETS,
  ScrapedContentType,
  ScrapedDataPreview,
  ScrapePreset,
} from '../../lib/webScraper';
import { ContentStore } from '../../lib/contentStore';
import { CausePillarId, Project, Story, CommunityEvent, NewsPost, VolunteerOpportunity } from '../../types';
import { DEMO_PILLARS } from '../../demo/demoData';

export const ContentScraperImporter: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [activePresetFilter, setActivePresetFilter] = useState<string>('all');
  
  // Current preview / edit form state
  const [scrapedData, setScrapedData] = useState<ScrapedDataPreview | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<ScrapedContentType>('news');
  const [editPillar, setEditPillar] = useState<CausePillarId>('general');
  const [editSummary, setEditSummary] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editCity, setEditCity] = useState('Columbus');
  const [editState, setEditState] = useState('OH');
  const [editGoalUsd, setEditGoalUsd] = useState('45000');
  const [editEventDate, setEditEventDate] = useState('2026-11-20T18:00');
  const [editSlots, setEditSlots] = useState('12');
  const [editHours, setEditHours] = useState('3.5');
  const [editAuthor, setEditAuthor] = useState('');

  // Import notification
  const [importSuccess, setImportSuccess] = useState<{
    type: ScrapedContentType;
    title: string;
    path: string;
  } | null>(null);

  // Manage imported content tab
  const [manageView, setManageView] = useState<'scraper' | 'importedList'>('scraper');
  const [customCounts, setCustomCounts] = useState(ContentStore.getCustomCounts());

  useEffect(() => {
    const unsub = ContentStore.subscribe(() => {
      setCustomCounts(ContentStore.getCustomCounts());
    });
    return unsub;
  }, []);

  const totalCustom =
    customCounts.projects +
    customCounts.stories +
    customCounts.events +
    customCounts.news +
    customCounts.volunteers;

  const handleScrape = async (urlToScrape?: string) => {
    const url = urlToScrape || targetUrl;
    if (!url || !url.trim()) {
      setScrapeError('Please enter a valid target website URL or pick a preset below.');
      return;
    }

    try {
      setIsScraping(true);
      setScrapeError(null);
      setImportSuccess(null);

      const result = await scrapeUrlContent(url.trim());
      setScrapedData(result);

      // Populate edit fields
      setEditTitle(result.title);
      setEditType(result.detectedType);
      setEditPillar(result.pillarId);
      setEditSummary(result.summary);
      setEditContent(result.fullContent);
      setEditImage(result.coverImage);
      setEditCity(result.locationCity || 'Columbus');
      setEditState(result.locationState || 'OH');
      setEditAuthor(result.authorOrOrg);

      if (result.goalAmountCents) {
        setEditGoalUsd(Math.round(result.goalAmountCents / 100).toString());
      }
      if (result.capacityOrSlots) {
        setEditSlots(result.capacityOrSlots.toString());
      }
      if (result.durationHours) {
        setEditHours(result.durationHours.toString());
      }
      if (result.dateOrDeadline) {
        setEditEventDate(result.dateOrDeadline);
      }
    } catch (err: any) {
      console.error('Scrape error:', err);
      setScrapeError(err?.message || 'Failed to extract content from target URL. Please verify address.');
    } finally {
      setIsScraping(false);
    }
  };

  const handleSelectPreset = (preset: ScrapePreset) => {
    setTargetUrl(preset.url);
    handleScrape(preset.url);
  };

  const handleConfirmImport = () => {
    if (!scrapedData) return;

    const slug = editTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `item-${Date.now()}`;
    const uniqueId = `scraped-${Date.now()}`;

    let targetPath = '/';

    switch (editType) {
      case 'project': {
        const goalCents = Math.round((parseFloat(editGoalUsd) || 50000) * 100);
        const newProj: Project = {
          id: uniqueId,
          slug,
          title: editTitle,
          tagline: editSummary.slice(0, 120),
          summary: editSummary,
          fullStory: editContent,
          pillarId: editPillar,
          status: 'active',
          state: editState,
          city: editCity,
          lat: 39.9612,
          lng: -82.9988,
          goalCents,
          raisedCents: Math.round(goalCents * 0.35),
          donorsCount: Math.floor(Math.random() * 40) + 12,
          daysRemaining: 28,
          coverImage: editImage,
          galleryImages: [editImage],
          budgetBreakdown: [
            { category: 'Direct Program Relief & Supplies', percentage: 80, amountCents: Math.round(goalCents * 0.8) },
            { category: 'Frontline Logistics & Community Staging', percentage: 15, amountCents: Math.round(goalCents * 0.15) },
            { category: 'Outreach & Case Navigation', percentage: 5, amountCents: Math.round(goalCents * 0.05) },
          ],
          milestones: [
            { id: 'm1', title: 'Phase 1 Rollout', description: 'Intake and direct procurement.', targetDate: 'Next Month', completed: true },
            { id: 'm2', title: 'Community Deployment', description: 'Reaching frontline neighborhood households.', targetDate: 'In 60 Days', completed: false },
          ],
          updates: [
            {
              id: 'u-init',
              date: new Date().toISOString().split('T')[0],
              title: 'Project Initiated & Scraped into ICA Field Hub',
              content: editSummary,
              author: editAuthor || 'ICA Community Director',
            },
          ],
          createdAt: new Date().toISOString().split('T')[0],
        };
        ContentStore.addProject(newProj);
        targetPath = `/projects/${slug}`;
        break;
      }

      case 'story': {
        const newStory: Story = {
          id: uniqueId,
          slug,
          title: editTitle,
          pillarId: editPillar,
          participantName: editAuthor || 'Community Participant',
          participantRole: 'Frontline Participant & Neighbor',
          location: `${editCity}, ${editState}`,
          state: editState,
          year: new Date().getFullYear(),
          quote: editSummary,
          storyBody: editContent,
          amountThatMadeItPossibleCents: 45000,
          outcomeMetric: 'Direct community intervention and lasting stability',
          heroImage: editImage,
          consentApproved: true,
        };
        ContentStore.addStory(newStory);
        targetPath = `/stories/${slug}`;
        break;
      }

      case 'event': {
        const newEvent: CommunityEvent = {
          id: uniqueId,
          slug,
          title: editTitle,
          description: editContent,
          location: `${editCity}, ${editState}`,
          isVirtual: editSummary.toLowerCase().includes('virtual') || editSummary.toLowerCase().includes('zoom'),
          eventDate: editEventDate.includes('T') ? editEventDate : `${editEventDate}T18:00:00Z`,
          coverImage: editImage,
          capacity: parseInt(editSlots, 10) || 120,
          registeredCount: Math.floor(Math.random() * 25) + 5,
        };
        ContentStore.addEvent(newEvent);
        targetPath = `/events/${slug}`;
        break;
      }

      case 'volunteer': {
        const newVol: VolunteerOpportunity = {
          id: uniqueId,
          title: editTitle,
          description: editContent,
          location: `${editCity}, ${editState}`,
          state: editState,
          pillarId: editPillar,
          dateTime: editEventDate,
          durationHours: parseFloat(editHours) || 3,
          slotsAvailable: parseInt(editSlots, 10) || 12,
          slotsFilled: Math.floor(Math.random() * 4) + 1,
          requirements: ['Comfortable collaborating in community spaces', 'All materials and safety guidelines provided', 'Ages 16+'],
          coordinatorName: editAuthor || 'ICA Volunteer Office',
        };
        ContentStore.addVolunteerOpportunity(newVol);
        targetPath = `/volunteer`;
        break;
      }

      case 'news': {
        const newNews: NewsPost = {
          id: uniqueId,
          slug,
          title: editTitle,
          summary: editSummary,
          body: editContent,
          pillarId: editPillar,
          category: 'Field Report',
          coverImage: editImage,
          author: editAuthor || 'ICA Field Correspondent',
          publishedAt: new Date().toISOString(),
        };
        ContentStore.addNews(newNews);
        targetPath = `/news/${slug}`;
        break;
      }
    }

    setImportSuccess({
      type: editType,
      title: editTitle,
      path: targetPath,
    });
    setScrapedData(null);
  };

  const handlePopulateAllPresets = () => {
    COMMUNITY_SCRAPE_PRESETS.forEach((preset, idx) => {
      const p = preset.preview;
      const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const uniqueId = `scraped-preset-${preset.id}-${Date.now() + idx}`;

      if (p.detectedType === 'project') {
        ContentStore.addProject({
          id: uniqueId,
          slug,
          title: p.title,
          tagline: p.summary.slice(0, 110),
          summary: p.summary,
          fullStory: p.fullContent,
          pillarId: p.pillarId,
          status: 'active',
          state: p.locationState || 'OH',
          city: p.locationCity || 'Columbus',
          lat: 39.9612,
          lng: -82.9988,
          goalCents: p.goalAmountCents || 4500000,
          raisedCents: Math.round((p.goalAmountCents || 4500000) * 0.42),
          donorsCount: 38,
          daysRemaining: 24,
          coverImage: p.coverImage,
          galleryImages: [p.coverImage],
          budgetBreakdown: [
            { category: 'Frontline Relational Services', percentage: 80, amountCents: 3600000 },
            { category: 'Direct Materials & Distribution', percentage: 20, amountCents: 900000 },
          ],
          milestones: [
            { id: 'm1', title: 'Community Outreach Initialized', description: 'Coordinating with local municipal leaders.', targetDate: 'Active', completed: true },
          ],
          updates: [],
          createdAt: new Date().toISOString().split('T')[0],
        });
      } else if (p.detectedType === 'event') {
        ContentStore.addEvent({
          id: uniqueId,
          slug,
          title: p.title,
          description: p.fullContent,
          location: `${p.locationCity}, ${p.locationState}`,
          isVirtual: p.summary.toLowerCase().includes('virtual'),
          eventDate: p.dateOrDeadline || '2026-11-20T18:00:00Z',
          coverImage: p.coverImage,
          capacity: p.capacityOrSlots || 100,
          registeredCount: 42,
        });
      } else if (p.detectedType === 'volunteer') {
        ContentStore.addVolunteerOpportunity({
          id: uniqueId,
          title: p.title,
          description: p.fullContent,
          location: `${p.locationCity}, ${p.locationState}`,
          state: p.locationState || 'OH',
          pillarId: p.pillarId,
          dateTime: p.dateOrDeadline || 'Weekly Shifts Available',
          durationHours: p.durationHours || 3.5,
          slotsAvailable: p.capacityOrSlots || 10,
          slotsFilled: 3,
          requirements: ['Compassionate attitude', 'Orientation provided'],
          coordinatorName: p.authorOrOrg,
        });
      } else if (p.detectedType === 'story') {
        ContentStore.addStory({
          id: uniqueId,
          slug,
          title: p.title,
          pillarId: p.pillarId,
          participantName: p.authorOrOrg || 'Community Family',
          participantRole: 'Community Resident',
          location: `${p.locationCity}, ${p.locationState}`,
          state: p.locationState || 'OH',
          year: 2026,
          quote: p.summary,
          storyBody: p.fullContent,
          amountThatMadeItPossibleCents: p.goalAmountCents || 42000,
          outcomeMetric: 'Winter heating safely restored and life preserved',
          heroImage: p.coverImage,
          consentApproved: true,
        });
      } else if (p.detectedType === 'news') {
        ContentStore.addNews({
          id: uniqueId,
          slug,
          title: p.title,
          summary: p.summary,
          body: p.fullContent,
          pillarId: p.pillarId,
          category: 'Field Report',
          coverImage: p.coverImage,
          author: p.authorOrOrg,
          publishedAt: new Date().toISOString(),
        });
      }
    });

    setImportSuccess({
      type: 'news',
      title: 'All Curated Community Action Feeds (8 Full Initiatives)',
      path: '/projects',
    });
  };

  const handleExportJson = () => {
    const jsonStr = ContentStore.exportAllContent();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ica_community_content_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetCustom = () => {
    if (window.confirm('Are you sure you want to clear all imported custom items and revert to original baseline?')) {
      ContentStore.resetAllCustom();
      setImportSuccess(null);
    }
  };

  const filteredPresets = COMMUNITY_SCRAPE_PRESETS.filter(
    (p) => activePresetFilter === 'all' || p.category === activePresetFilter
  );

  return (
    <div className="space-y-8">
      {/* Top Banner & Control Deck */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B2545] to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Universal Web Content Scraper & Auto-Publisher</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Scrape, Extract & Populate Impact Community Action
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Extract authentic community projects, success stories, galas/events, volunteer postings, and news dispatches directly from Community Action agencies, VolunteerMatch, Eventbrite, or any NGO web link.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePopulateAllPresets}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#13A89E] hover:bg-teal-500 text-white shadow-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Import All 8 Presets (1-Click)</span>
            </button>
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
            {totalCustom > 0 && (
              <button
                onClick={handleResetCustom}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Custom ({totalCustom})</span>
              </button>
            )}
          </div>
        </div>

        {/* Live imported counter stats */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-xs text-slate-400 block">Custom Projects</span>
            <span className="text-lg font-bold text-teal-300">{customCounts.projects}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-xs text-slate-400 block">Custom Stories</span>
            <span className="text-lg font-bold text-teal-300">{customCounts.stories}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-xs text-slate-400 block">Custom Events</span>
            <span className="text-lg font-bold text-teal-300">{customCounts.events}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-xs text-slate-400 block">Volunteer Listings</span>
            <span className="text-lg font-bold text-teal-300">{customCounts.volunteers}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-xs text-slate-400 block">News Dispatches</span>
            <span className="text-lg font-bold text-teal-300">{customCounts.news}</span>
          </div>
        </div>
      </div>

      {/* Success Notification Bar */}
      {importSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Content successfully imported to website!
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                "{importSuccess.title}" is now published and visible to donors and public visitors.
              </p>
            </div>
          </div>
          <Link
            to={importSuccess.path}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors"
          >
            <span>View Live Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Scraper Input Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Paste Any Target URL to Extract:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://communityactionpartnership.com/... or https://eventbrite.com/..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
              />
            </div>
            <button
              onClick={() => handleScrape()}
              disabled={isScraping || !targetUrl.trim()}
              className="px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#13A89E] disabled:opacity-50 text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-2 shrink-0"
            >
              {isScraping ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scraping & Extracting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span>Scrape & Extract</span>
                </>
              )}
            </button>
          </div>
          {scrapeError && (
            <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{scrapeError}</span>
            </p>
          )}
        </div>

        {/* Preset Catalog Pills */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Or Pick an Authentic Community Action Feed Preset:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['all', 'project', 'story', 'event', 'volunteer', 'news'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActivePresetFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-colors ${
                    activePresetFilter === cat
                      ? 'bg-[#0B2545] text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredPresets.map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#13A89E] dark:hover:border-[#13A89E] bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex flex-col justify-between text-left space-y-2.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-[#13A89E]">
                      {preset.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[110px]">
                      {preset.sourceOrg.split(' ')[0]}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#13A89E] transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {preset.preview.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="capitalize">{preset.pillarId} Pillar</span>
                  <span className="inline-flex items-center gap-1 text-[#13A89E] font-bold">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scraped Content Preview & Live Customizer */}
      {scrapedData && (
        <div className="bg-white dark:bg-slate-900 border-2 border-teal-500/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-[#13A89E] text-xs font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Extracted from {scrapedData.sourceDomain}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Review & Confirm Content Before Publishing
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setScrapedData(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#13A89E] hover:bg-teal-500 text-white shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish to Website</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Fields Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Website Section / Model:
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as ScrapedContentType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    <option value="project">Project / Grassroots Campaign (/projects)</option>
                    <option value="story">Participant Story / Impact Voice (/stories)</option>
                    <option value="event">Community Event / Gala (/events)</option>
                    <option value="volunteer">Volunteer Opportunity (/volunteer)</option>
                    <option value="news">News / Press Release (/news)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Cause Pillar:
                  </label>
                  <select
                    value={editPillar}
                    onChange={(e) => setEditPillar(e.target.value as CausePillarId)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold capitalize"
                  >
                    {DEMO_PILLARS.map((pil) => (
                      <option key={pil.id} value={pil.id}>
                        {pil.name}
                      </option>
                    ))}
                    <option value="general">General Community Action</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Title / Headline:
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Summary / Excerpt:
                </label>
                <textarea
                  rows={2}
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Full Body / Case Description:
                </label>
                <textarea
                  rows={6}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    City:
                  </label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    State:
                  </label>
                  <input
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs uppercase"
                  />
                </div>

                {editType === 'project' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Goal ($ USD):
                    </label>
                    <input
                      type="number"
                      value={editGoalUsd}
                      onChange={(e) => setEditGoalUsd(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>
                )}

                {(editType === 'event' || editType === 'volunteer') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Slots / Capacity:
                    </label>
                    <input
                      type="number"
                      value={editSlots}
                      onChange={(e) => setEditSlots(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>
                )}

                {editType === 'volunteer' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Hours:
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={editHours}
                      onChange={(e) => setEditHours(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Source / Author:
                  </label>
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Live Card Preview Column */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                Live Card Preview:
              </label>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/80 shadow-md">
                <div className="relative h-44 bg-slate-200 dark:bg-slate-700">
                  <img
                    src={editImage}
                    alt={editTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B2545]/90 text-teal-300 backdrop-blur-sm">
                      {editType}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-800 backdrop-blur-sm capitalize">
                      {editPillar}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {editCity}, {editState} · {editAuthor || 'ICA Community'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {editTitle || 'Untitled Scraped Post'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                    {editSummary}
                  </p>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-[#13A89E]">
                    <span>Publishing as Live Content</span>
                    <span>Ready</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Image URL:
                </label>
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
