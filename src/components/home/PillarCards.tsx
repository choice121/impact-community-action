import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Apple, Home, HeartPulse, GraduationCap, Users, ShieldAlert, Award } from 'lucide-react';
import { DEMO_PILLARS } from '../../demo/demoData';
import { IKImage } from '../common/IKImage';
import { formatCurrency } from '../../lib/format';

const iconMap: Record<string, React.ElementType> = {
  Apple,
  Home,
  HeartPulse,
  GraduationCap,
  Users,
  ShieldAlert,
  Award,
};

export const PillarCards: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#13A89E] mb-2">
            Targeted & Community-Governed
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B2545] dark:text-white">
            Seven Pillars of Lasting Change
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
            Every donation is designated with total transparency. Choose the specific cause closest to your heart or fuel our general emergency relief fund.
          </p>
        </div>

        <Link
          to="/our-work"
          className="inline-flex items-center gap-1.5 font-semibold text-sm text-[#13A89E] hover:text-[#0B2545] dark:hover:text-white transition-colors"
        >
          <span>Explore All 7 Pillars</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid of 7 Cause Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {DEMO_PILLARS.map((pillar) => {
          const IconComponent = iconMap[pillar.iconName] || Heart;
          const percentFunded = Math.min(100, Math.round((pillar.raisedCents / pillar.goalCents) * 100));

          return (
            <div
              key={pillar.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Image & Pillar Accent Badge */}
              <div className="relative">
                <IKImage
                  path={pillar.coverImage}
                  alt={pillar.name}
                  aspectRatio="16/9"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-10">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md backdrop-blur-md"
                    style={{ backgroundColor: pillar.accentColor }}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{pillar.name}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#13A89E] transition-colors">
                    {pillar.tagline}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Progress Thermometer */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(pillar.raisedCents)} raised
                    </span>
                    <span className="text-slate-500 font-medium">
                      {percentFunded}% of {formatCurrency(pillar.goalCents)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${percentFunded}%`,
                        backgroundColor: pillar.accentColor,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{pillar.kpiLabel}:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {pillar.kpiValue}
                    </span>
                  </div>
                </div>

                {/* Dual Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to={`/our-work/${pillar.slug}`}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
                  >
                    View Projects
                  </Link>
                  <Link
                    to={`/donate?pillar=${pillar.id}`}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[#0B2545] hover:bg-[#13A89E] transition-colors text-center flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Give Direct</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
