import React from 'react';
import { HeartHandshake, Truck, Waves, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Target Your Gift',
      desc: 'Pick one of our 7 cause pillars, a specific neighborhood project, or our emergency reserve. 100% tax-deductible with instant IRS receipt.',
      icon: HeartHandshake,
      color: 'bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] border-teal-200 dark:border-teal-800',
    },
    {
      step: '02',
      title: 'Direct Grassroots Deployment',
      desc: '88% goes directly to field purchases—paying landlords to stop lockouts, funding cold storage produce, and buying student hardware.',
      icon: Truck,
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-200 dark:border-amber-800',
    },
    {
      step: '03',
      title: 'Watch Your Ripple Expand',
      desc: 'Receive field updates, photos, and concrete outcome reports showing the exact families housed and meals distributed through your support.',
      icon: Waves,
      color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 border-blue-200 dark:border-blue-800',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#13A89E]">
            Accountable Philanthropy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B2545] dark:text-white mt-2">
            How Impact Community Action Works
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-3">
            No bureaucratic delays. No mysterious administrative black boxes. Just verified local change.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-3xl font-bold text-slate-300 dark:text-slate-700">
                      {item.step}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-semibold text-[#13A89E]">
                  <span>Audited in real-time</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Link */}
        <div className="text-center mt-12">
          <Link
            to="/transparency"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B2545] dark:text-teal-400 hover:underline"
          >
            <span>Learn more about our transparent financial structure</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
