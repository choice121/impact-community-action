import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles, CheckCircle2, MapPin, Apple, Home, HeartPulse, GraduationCap, Users, ShieldAlert, Award } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { DEMO_PILLARS, DEMO_PROJECTS, DEMO_STORIES } from '../demo/demoData';
import { IKImage } from '../components/common/IKImage';
import { formatCurrency } from '../lib/format';

const iconMap: Record<string, React.ElementType> = {
  Apple,
  Home,
  HeartPulse,
  GraduationCap,
  Users,
  ShieldAlert,
  Award,
};

export const PillarDetailPage: React.FC = () => {
  const { pillar: pillarSlug } = useParams<{ pillar: string }>();
  const pillar = DEMO_PILLARS.find((p) => p.slug === pillarSlug || p.id === pillarSlug);

  if (!pillar) {
    return <Navigate to="/our-work" replace />;
  }

  const IconComp = iconMap[pillar.iconName] || Heart;
  const relatedProjects = DEMO_PROJECTS.filter((proj) => proj.pillarId === pillar.id);
  const relatedStories = DEMO_STORIES.filter((s) => s.pillarId === pillar.id);
  const percentFunded = Math.min(100, Math.round((pillar.raisedCents / pillar.goalCents) * 100));

  return (
    <>
      <SEO
        title={`${pillar.name} — Our Work`}
        description={pillar.description}
        image={pillar.coverImage}
      />

      {/* Hero Banner with Pillar Accent */}
      <section
        className="relative text-white py-16 lg:py-24 overflow-hidden"
        style={{ backgroundColor: '#0B2545' }}
      >
        <div className="absolute inset-0 z-0 opacity-25">
          <IKImage
            path={pillar.coverImage}
            alt={pillar.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545] via-[#0B2545]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-md"
              style={{ backgroundColor: pillar.accentColor }}
            >
              <IconComp className="w-4 h-4" />
              <span>Cause Pillar · {pillar.name}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              {pillar.tagline}
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              {pillar.longDescription}
            </p>

            {/* Live Impact Counter */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl inline-flex items-center gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-teal-200">
                  {pillar.kpiLabel}
                </p>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {pillar.kpiValue}
                </p>
              </div>
              <div className="border-l border-white/20 pl-4">
                <p className="text-xs uppercase tracking-wider text-teal-200">
                  Fund Allocation
                </p>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-300">
                  {formatCurrency(pillar.raisedCents)}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={`/donate?pillar=${pillar.id}`}
                className="px-8 py-3.5 rounded-xl font-bold text-sm bg-amber-400 hover:bg-amber-300 text-[#0B2545] shadow-lg inline-flex items-center gap-2 transition-transform transform active:scale-95"
              >
                <Heart className="w-4 h-4 fill-[#0B2545]" />
                <span>Give Directly to {pillar.name}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tangible Impact Examples */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#13A89E]">
              What Your Donation Buys
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white mt-1">
              Direct Dollar-to-Outcome Equivalents
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillar.tangibleImpactExamples.map((ex, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="font-serif text-3xl font-bold"
                    style={{ color: pillar.accentColor }}
                  >
                    ${ex.amount}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {ex.description}
                  </p>
                </div>
                <Link
                  to={`/donate?amount=${ex.amount}&pillar=${pillar.id}`}
                  className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs font-bold text-[#13A89E] hover:underline flex items-center justify-between"
                >
                  <span>Fund this tier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Projects under this pillar */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white">
              Active Community Projects
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Currently fundraising initiatives led by verified neighborhood coordinators
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-bold text-[#13A89E] hover:underline hidden sm:inline"
          >
            All Projects →
          </Link>
        </div>

        {relatedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <IKImage path={proj.coverImage} alt={proj.title} aspectRatio="16/9" />
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-[#13A89E]" />
                      <span>{proj.city}, {proj.state}</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {proj.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold">{formatCurrency(proj.raisedCents)}</span>
                      <span className="text-slate-500">Goal: {formatCurrency(proj.goalCents)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, Math.round((proj.raisedCents / proj.goalCents) * 100))}%`,
                          backgroundColor: pillar.accentColor,
                        }}
                      />
                    </div>
                  </div>

                  <Link
                    to={`/projects/${proj.slug}`}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#0B2545] hover:bg-[#13A89E] text-white text-center block transition-colors"
                  >
                    View Project
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-sm text-slate-500">
              New project proposals for this pillar are currently in civic committee review.
            </p>
          </div>
        )}
      </section>

      {/* Stories Feed under this pillar */}
      {relatedStories.length > 0 && (
        <section className="py-16 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white mb-8">
              Stories of Impact from this Pillar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-6 items-center"
                >
                  <div className="w-full sm:w-44 h-40 shrink-0 rounded-2xl overflow-hidden">
                    <IKImage path={story.heroImage} alt={story.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#13A89E]">
                      {formatCurrency(story.amountThatMadeItPossibleCents)} funded this
                    </span>
                    <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">
                      {story.title}
                    </h3>
                    <p className="text-xs text-slate-500 italic line-clamp-2">
                      "{story.quote}"
                    </p>
                    <Link
                      to={`/stories/${story.slug}`}
                      className="text-xs font-bold text-[#0B2545] dark:text-teal-400 hover:underline inline-flex items-center gap-1 pt-1"
                    >
                      <span>Read Clara's journey</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
