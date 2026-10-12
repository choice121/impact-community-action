import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { DEMO_TESTIMONIALS } from '../../demo/demoData';
import { IKImage } from '../common/IKImage';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((c) => (c === 0 ? DEMO_TESTIMONIALS.length - 1 : c - 1));
  };

  const next = () => {
    setCurrentIndex((c) => (c === DEMO_TESTIMONIALS.length - 1 ? 0 : c + 1));
  };

  const current = DEMO_TESTIMONIALS[currentIndex];

  const partners = [
    { name: 'Ohio Community Foundation', role: 'Anchor Grantee' },
    { name: 'Appalachian Regional Partnership', role: 'Civic Partner' },
    { name: 'Midwest Food Bank Logistics', role: 'Cold Chain Provider' },
    { name: 'Cuyahoga County Housing Coalition', role: 'Court Liaison' },
    { name: 'Veterans Mobility Alliance', role: 'Accessibility Partner' },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Testimonials Slider */}
      <div className="bg-[#0B2545] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl mb-16">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-teal-500/10 pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1 text-amber-300">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>

          <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed italic text-slate-100">
            "{current.quote}"
          </p>

          <div className="flex flex-col items-center justify-center pt-2">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-teal-400 mb-3">
              <IKImage
                path={current.avatarUrl}
                alt={current.authorName}
                aspectRatio="1/1"
                focalPoint="face"
              />
            </div>
            <div className="font-bold text-base text-white">{current.authorName}</div>
            <div className="text-xs text-teal-300 mt-0.5">{current.role}</div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs text-slate-400 font-mono">
              {currentIndex + 1} / {DEMO_TESTIMONIALS.length}
            </span>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Partner Logos / Trust Badges */}
      <div className="text-center space-y-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Institutional Trust & Community Coalitions
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {partners.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-1"
            >
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                {p.name}
              </div>
              <div className="text-[10px] text-[#13A89E] font-medium">{p.role}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
