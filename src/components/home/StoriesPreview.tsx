import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote, Heart } from 'lucide-react';
import { DEMO_STORIES } from '../../demo/demoData';
import { IKImage } from '../common/IKImage';
import { formatCurrency } from '../../lib/format';

export const StoriesPreview: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#13A89E]">
              Verified Dignity & Hope
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B2545] dark:text-white mt-1">
              Real Stories. Tangible Outcomes.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
              Every story is shared with verified participant consent. See exactly how modest community gifts create generational breakthroughs.
            </p>
          </div>

          <Link
            to="/stories"
            className="inline-flex items-center gap-1.5 font-semibold text-sm text-[#13A89E] hover:text-[#0B2545] dark:hover:text-white transition-colors"
          >
            <span>Explore All Stories Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DEMO_STORIES.slice(0, 3).map((story) => (
            <div
              key={story.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative">
                  <IKImage
                    path={story.heroImage}
                    alt={story.title}
                    aspectRatio="16/9"
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                    {story.location}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Concrete Amount Tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] text-xs font-bold">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{formatCurrency(story.amountThatMadeItPossibleCents)} made this possible</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#13A89E] transition-colors">
                    {story.title}
                  </h3>

                  {/* Quote Snippet */}
                  <div className="relative pl-4 border-l-2 border-amber-400 italic text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    "{story.quote}"
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    — {story.participantName}, {story.participantRole}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  to={`/stories/${story.slug}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-[#0B2545] hover:text-white dark:hover:bg-teal-500 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
