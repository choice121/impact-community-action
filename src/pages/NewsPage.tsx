import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useLiveContent } from '../hooks/useLiveContent';
import { IKImage } from '../components/common/IKImage';
import { formatDate } from '../lib/format';

export const NewsPage: React.FC = () => {
  const { news } = useLiveContent();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Press Release', 'Field Report', 'Community Story'];

  const filteredNews = news.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <>
      <SEO
        title="News & Field Dispatches"
        description="Official press releases, longitudinal outcome audits, and field reports from Impact Community Action."
      />

      <section className="bg-[#0B2545] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Frontline Reporting
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              News & Field Dispatches
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Read verified programmatic milestones, independent audit announcements, and policy developments directly from our field directors.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0B2545] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Dispatches' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredNews.map((article) => (
            <article
              key={article.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative">
                  <IKImage
                    path={article.coverImage}
                    alt={article.title}
                    aspectRatio="16/9"
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-[#13A89E]" />
                    <span>{formatDate(article.publishedAt)}</span>
                    <span>·</span>
                    <span>{article.author}</span>
                  </div>

                  <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#13A89E] transition-colors">
                    {article.title}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/news/${article.slug}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-[#0B2545] hover:text-white dark:hover:bg-teal-500 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Read Full Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};
