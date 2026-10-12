import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { DEMO_NEWS } from '../demo/demoData';
import { IKImage } from '../components/common/IKImage';
import { formatDate } from '../lib/format';

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = DEMO_NEWS.find((n) => n.slug === slug || n.id === slug);

  if (!article) {
    return <Navigate to="/news" replace />;
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: [article.coverImage],
    datePublished: article.publishedAt,
    author: [{ '@type': 'Person', name: article.author }],
    publisher: {
      '@type': 'Organization',
      name: 'Impact Community Action, Inc.',
      logo: { '@type': 'ImageObject', url: 'https://impact-community-action.pages.dev/favicon.ico' },
    },
  };

  return (
    <>
      <SEO
        title={article.title}
        description={article.summary}
        image={article.coverImage}
        ogType="article"
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Dispatches</span>
        </Link>

        <div className="space-y-4">
          <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] text-xs font-bold">
            {article.category}
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B2545] dark:text-white leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1.5 font-bold text-[#13A89E]">
              <Calendar className="w-4 h-4" />
              {formatDate(article.publishedAt)}
            </span>
            <span>·</span>
            <span>By {article.author}</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Organization Release</span>
            </span>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
          <IKImage path={article.coverImage} alt={article.title} aspectRatio="16/9" priority={true} />
        </div>

        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
          {article.body}
        </div>

        <div className="p-8 rounded-3xl bg-[#0B2545] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl font-bold">Support frontline community actions</h3>
            <p className="text-xs text-slate-300">Your tax-deductible gift enables fast, direct interventions.</p>
          </div>
          <Link
            to="/donate"
            className="px-6 py-3 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-[#0B2545] shrink-0"
          >
            Donate Today
          </Link>
        </div>
      </article>
    </>
  );
};
