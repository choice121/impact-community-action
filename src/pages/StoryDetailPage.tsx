import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Heart, MapPin, Calendar, ArrowRight, ShieldCheck, Quote, Sparkles } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useLiveContent } from '../hooks/useLiveContent';
import { IKImage } from '../components/common/IKImage';
import { formatCurrency } from '../lib/format';

export const StoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { stories, pillars } = useLiveContent();
  const story = stories.find((s) => s.slug === slug || s.id === slug);

  if (!story) {
    return <Navigate to="/stories" replace />;
  }

  const pillar = pillars.find((p) => p.id === story.pillarId);
  const relatedStories = stories.filter((s) => s.id !== story.id).slice(0, 2);

  return (
    <>
      <SEO
        title={story.title}
        description={`"${story.quote}" — Read ${story.participantName}'s story of resilience supported by Impact Community Action.`}
        image={story.heroImage}
        ogType="article"
      />

      <article className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation & Pillar Breadcrumb */}
        <div className="flex items-center justify-between text-xs">
          <Link
            to="/stories"
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
          >
            ← Back to All Stories
          </Link>
          <div
            className="px-3 py-1 rounded-full text-white font-bold text-xs"
            style={{ backgroundColor: pillar ? pillar.accentColor : '#13A89E' }}
          >
            {pillar?.name}
          </div>
        </div>

        {/* Story Title & Meta */}
        <div className="space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2545] dark:text-white leading-tight">
            {story.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#13A89E]" />
              <span>{story.location}, {story.state}</span>
            </div>
            <span>·</span>
            <span>Documented in {story.year}</span>
            <span>·</span>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Participant Consent on File</span>
            </div>
          </div>
        </div>

        {/* Hero Photo with Impact Overlay */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
          <IKImage
            path={story.heroImage}
            alt={story.title}
            aspectRatio="16/9"
            priority={true}
          />
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg sm:max-w-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Direct Contribution Needed
            </span>
            <p className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
              {formatCurrency(story.amountThatMadeItPossibleCents)}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {story.outcomeMetric}
            </p>
          </div>
        </div>

        {/* Pull Quote Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 relative">
          <Quote className="w-8 h-8 text-[#13A89E] opacity-40 mb-2" />
          <p className="font-serif text-lg sm:text-xl italic font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
            "{story.quote}"
          </p>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-4">
            — {story.participantName}, {story.participantRole}
          </p>
        </div>

        {/* Full Story Narrative */}
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
          <p>{story.storyBody}</p>
          <p>
            When neighbors support organizations like Impact Community Action, the benefit doesn't stop at emergency intervention. It builds generational stability: children stay enrolled in their home schools, parents finish career certifications, and community ties deepen.
          </p>
        </div>

        {/* Fund a Similar Story CTA Box */}
        <div className="p-8 rounded-3xl bg-[#0B2545] text-white space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Create the Next Breakthrough
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                Fund a similar story for {formatCurrency(story.amountThatMadeItPossibleCents)}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md">
                100% of your donation is deployed directly toward {pillar?.name.toLowerCase()} assistance.
              </p>
            </div>

            <Link
              to={`/donate?amount=${story.amountThatMadeItPossibleCents / 100}&pillar=${story.pillarId}`}
              className="px-6 py-3.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-[#0B2545] shadow-lg flex items-center gap-2 shrink-0 transition-transform transform active:scale-95"
            >
              <Heart className="w-4 h-4 fill-[#0B2545]" />
              <span>Fund Similar Outcome</span>
            </Link>
          </div>
        </div>

        {/* Related Stories */}
        {relatedStories.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="font-serif text-xl font-bold text-[#0B2545] dark:text-white">
              More Stories of Impact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedStories.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/stories/${rel.slug}`}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#13A89E]">
                      {rel.location}
                    </span>
                    <h4 className="font-serif text-base font-bold text-slate-900 dark:text-white group-hover:text-[#13A89E] transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate-500 italic line-clamp-2">
                      "{rel.quote}"
                    </p>
                  </div>
                  <div className="pt-3 flex items-center gap-1 text-xs font-bold text-[#0B2545] dark:text-teal-400">
                    <span>Read story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </article>
    </>
  );
};
