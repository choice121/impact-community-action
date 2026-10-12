import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Users, Target, ArrowRight } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { IKImage } from '../components/common/IKImage';
import { siteConfig } from '../config/siteConfig';

export const AboutPage: React.FC = () => {
  const { settings } = siteConfig;

  return (
    <>
      <SEO
        title="About Impact Community Action"
        description="Learn the history, mission, leadership, and community ethos behind Impact Community Action (ICA)."
      />

      <section className="bg-[#0B2545] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Our Origin & Ethos
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Rooted in Community. Driven by Outcomes.
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              We started with a single neighborhood food pantry run out of a church basement. Today, we coordinate rapid emergency response across seven essential cause pillars.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#13A89E]">
              The Core Problem
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#0B2545] dark:text-white">
              Why Traditional Safety Nets Leave Gaps
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              When an unexpected $400 car repair or medical emergency hits a working-class household, federal assistance often takes 60 to 90 days of bureaucratic paperwork to respond. By then, the family has been evicted, their credit ruined, and the children relocated.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Impact Community Action was engineered to act within <strong>24 hours</strong>. We bridge the critical gap between crisis and stability.
            </p>
          </div>

          <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
            <IKImage
              path="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80"
              alt="ICA volunteers preparing produce packages"
              aspectRatio="4/3"
            />
          </div>
        </div>

        {/* 3 Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
              Dignity Above All
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We never treat assistance as charity handouts. Every interaction protects self-respect and community agency.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
              88% Direct Efficiency
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Zero executive perks or wasteful marketing campaigns. 88 cents of every dollar reaches frontline families.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
              Data-Backed Interventions
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We track longitudinal outcomes 6 and 12 months after assistance to ensure sustainable community retention.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#0B2545] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-2xl font-bold">Want to see our financial audits?</h3>
            <p className="text-xs text-slate-300">View Form 990 filings, 4-star Charity Navigator reports, and board rosters.</p>
          </div>
          <Link
            to="/transparency"
            className="px-6 py-3 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-[#0B2545] shrink-0"
          >
            Review Transparency Portal
          </Link>
        </div>
      </section>
    </>
  );
};
