import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Apple, Home, HeartPulse, GraduationCap, Users, ShieldAlert, Award, Sparkles } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { DEMO_PILLARS } from '../demo/demoData';
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

export const PillarsPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Our Work — Seven Cause Pillars"
        description="Explore Impact Community Action's 7 cause pillars: Hunger, Housing, Health, Education, Families, Disaster Relief, and Seniors & Veterans."
      />

      {/* Header Banner */}
      <section className="bg-[#0B2545] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Community Action Ecosystem
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Seven Pillars of Dignity & Community Power
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              We focus resources where traditional safety nets falter. Every pillar is led in partnership with local community organizers, ensuring assistance goes directly to neighbors in need.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars Comprehensive Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {DEMO_PILLARS.map((pillar, idx) => {
          const IconComp = iconMap[pillar.iconName] || Heart;
          const isEven = idx % 2 === 0;

          return (
            <div
              key={pillar.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm`}
            >
              {/* Image Column */}
              <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                  <IKImage
                    path={pillar.coverImage}
                    alt={pillar.name}
                    aspectRatio="4/3"
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    style={{ backgroundColor: pillar.accentColor }}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{pillar.name}</span>
                  </div>
                </div>
              </div>

              {/* Text Details Column */}
              <div className={`lg:col-span-7 space-y-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white">
                    {pillar.name}
                  </h2>
                  <p className="font-medium text-sm text-[#13A89E] mt-1">
                    {pillar.tagline}
                  </p>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {pillar.longDescription}
                </p>

                {/* Tangible Impact Examples */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tangible Impact Scale</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                    {pillar.tangibleImpactExamples.slice(0, 2).map((ex, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="font-bold text-[#13A89E] shrink-0">
                          ${ex.amount}:
                        </span>
                        <span>{ex.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to={`/our-work/${pillar.slug}`}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>View Projects & Stories</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/donate?pillar=${pillar.id}`}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0B2545] hover:bg-[#13A89E] transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Give to this Cause</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};
