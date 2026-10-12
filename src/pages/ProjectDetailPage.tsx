import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Calendar,
  Share2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  PieChart as PieIcon,
  Check,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { DEMO_PROJECTS, DEMO_PILLARS, DEMO_STORIES } from '../demo/demoData';
import { IKImage } from '../components/common/IKImage';
import { formatCurrency, formatDate } from '../lib/format';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = DEMO_PROJECTS.find((p) => p.slug === slug || p.id === slug);
  const [copied, setCopied] = useState(false);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const pillar = DEMO_PILLARS.find((p) => p.id === project.pillarId);
  const percentFunded = Math.min(100, Math.round((project.raisedCents / project.goalCents) * 100));
  const relatedStories = DEMO_STORIES.filter((s) => s.relatedProjectSlug === project.slug);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEO
        title={project.title}
        description={project.summary}
        image={project.coverImage}
      />

      {/* Hero Section */}
      <section className="bg-[#0B2545] text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link
                to={`/our-work/${pillar?.slug}`}
                className="px-3 py-1 rounded-full font-bold text-white shadow-sm"
                style={{ backgroundColor: pillar ? pillar.accentColor : '#13A89E' }}
              >
                {pillar?.name}
              </Link>
              <div className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>
                  {project.city}, {project.state}
                </span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              {project.title}
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              {project.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image, Full Story, Budget, Milestones, Updates */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Cover Image */}
            <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
              <IKImage
                path={project.coverImage}
                alt={project.title}
                aspectRatio="16/9"
                priority={true}
              />
            </div>

            {/* About This Initiative */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                The Community Need & Solution
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {project.fullStory}
              </p>
            </div>

            {/* Budget Transparency Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <div className="flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-[#13A89E]" />
                <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                  Every Dollar Itemized
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Total Project Budget: <strong>{formatCurrency(project.goalCents)}</strong>. No overhead padding.
              </p>

              <div className="space-y-4">
                {project.budgetBreakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.category}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(item.amountCents)} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#13A89E]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                Project Milestones
              </h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {project.milestones.map((milestone) => (
                  <div key={milestone.id} className="relative flex items-start gap-4 pl-8">
                    <div
                      className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        milestone.completed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {milestone.completed ? <Check className="w-3.5 h-3.5" /> : '○'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {milestone.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {milestone.targetDate}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Updates Feed */}
            {project.updates.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                  Field Updates
                </h2>
                <div className="space-y-4">
                  {project.updates.map((update) => (
                    <div
                      key={update.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold text-[#13A89E]">{update.author}</span>
                        <span>{formatDate(update.date)}</span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {update.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {update.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Story Link if available */}
            {relatedStories.length > 0 && (
              <div className="bg-gradient-to-r from-teal-500/10 to-amber-500/10 border border-teal-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#13A89E] uppercase tracking-wider">
                    Participant Spotlight
                  </span>
                  <p className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                    Read Clara's journey: How this project changed Sunday dinner
                  </p>
                </div>
                <Link
                  to={`/stories/${relatedStories[0].slug}`}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#0B2545] hover:bg-[#13A89E] text-white shrink-0 transition-colors"
                >
                  Read Story
                </Link>
              </div>
            )}

          </div>

          {/* Right Column: Funding Sticky Card & Donor Stats */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              
              {/* Thermometer */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-[#0B2545] dark:text-white">
                    {formatCurrency(project.raisedCents)}
                  </span>
                  <span className="text-xs text-slate-500">
                    of {formatCurrency(project.goalCents)}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${percentFunded}%`,
                      backgroundColor: pillar ? pillar.accentColor : '#13A89E',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>{percentFunded}% funded</span>
                  <span>{project.daysRemaining} days remaining</span>
                </div>
              </div>

              {/* Supporter Metrics */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-around text-center">
                <div>
                  <p className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                    {project.donorsCount}
                  </p>
                  <p className="text-[11px] text-slate-500">Neighbors Contributed</p>
                </div>
                <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
                  <p className="font-serif text-xl font-bold text-emerald-600">
                    100%
                  </p>
                  <p className="text-[11px] text-slate-500">Tax Deductible</p>
                </div>
              </div>

              {/* Fund This Project CTA */}
              <div className="space-y-3">
                <Link
                  to={`/donate?project=${project.id}&pillar=${project.pillarId}`}
                  className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-400 to-[#13A89E] hover:from-amber-300 hover:to-teal-400 text-[#0B2545] shadow-lg flex items-center justify-center gap-2 transition-transform transform active:scale-95"
                >
                  <Heart className="w-4 h-4 fill-[#0B2545]" />
                  <span>Fund This Project</span>
                </Link>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Link Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Share With Friends</span>
                    </>
                  )}
                </button>
              </div>

              {/* Legal Notice */}
              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                Eligible for 501(c)(3) tax receipt. If this project surpasses 100%, surplus funds will be directed to immediate needs within the {pillar?.name} pillar.
              </p>

            </div>
          </div>

        </div>
      </section>
    </>
  );
};
