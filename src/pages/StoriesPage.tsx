import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Filter, PlusCircle, ArrowRight, Quote, Sparkles } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useLiveContent } from '../hooks/useLiveContent';
import { IKImage } from '../components/common/IKImage';
import { BeforeAfterSlider } from '../components/stories/BeforeAfterSlider';
import { ShareStoryModal } from '../components/stories/ShareStoryModal';
import { formatCurrency } from '../lib/format';

export const StoriesPage: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { stories, pillars } = useLiveContent();

  const availableStates = Array.from(new Set(stories.map((s) => s.state))).sort();

  const filteredStories = useMemo(() => {
    return stories.filter((s) => {
      const matchPillar = selectedPillar === 'all' || s.pillarId === selectedPillar;
      const matchState = selectedState === 'all' || s.state === selectedState;
      return matchPillar && matchState;
    });
  }, [selectedPillar, selectedState, stories]);

  return (
    <>
      <SEO
        title="Stories of Impact"
        description="Verified community stories with participant consent showing how small acts create transformational change."
      />

      {/* Header Banner */}
      <section className="bg-[#0B2545] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Frontline Impact
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
                Stories of Resilience & Dignity
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Behind every dollar is a kitchen stocked, an eviction dismissed, or an elder regaining freedom. Every story published with strict consent.
              </p>
            </div>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-5 py-3 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-[#0B2545] shadow-lg flex items-center gap-2 self-start md:self-auto shrink-0 transition-transform transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share Your Journey</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Before & After Spotlight */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#13A89E]">
                Visual Transformation Spotlight
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white">
                From Emptiness to Abundance
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Drag the interactive slider to see how ICA’s Eastside Food Hub transformed Clara’s pantry from empty shelves into fresh local vegetables and dignity.
              </p>
              <div className="pt-2">
                <Link
                  to="/stories/clara-fresh-groceries-grandkids"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#13A89E] hover:underline"
                >
                  <span>Read Clara's Full Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=1200&q=80"
                afterImage="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
                beforeLabel="Before: Empty Pantry"
                afterLabel="After: Fresh Harvest Delivery"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="py-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
            >
              <option value="all">All Cause Pillars</option>
              {pillars.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
            >
              <option value="all">All States</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500">
            Showing {filteredStories.length} verified participant stories
          </div>
        </div>
      </section>

      {/* Stories Masonry / Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => {
            const pillar = pillars.find((p) => p.id === story.pillarId);

            return (
              <div
                key={story.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative">
                    <IKImage
                      path={story.heroImage}
                      alt={story.title}
                      aspectRatio="16/9"
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold">
                      {story.location}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className="font-bold"
                        style={{ color: pillar ? pillar.accentColor : '#13A89E' }}
                      >
                        {pillar?.name}
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {formatCurrency(story.amountThatMadeItPossibleCents)} made possible
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#13A89E] transition-colors">
                      {story.title}
                    </h3>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs italic text-slate-600 dark:text-slate-300">
                      "{story.quote}"
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Outcome: <strong>{story.outcomeMetric}</strong>
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={`/stories/${story.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Share Modal */}
      <ShareStoryModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
};
