import React, { useEffect, useState } from 'react';
import { Utensils, Home, Users, GraduationCap, ShieldAlert } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { formatNumber } from '../../lib/format';

interface CounterItem {
  icon: React.ElementType;
  label: string;
  target: number;
  prefix?: string;
  suffix?: string;
}

export const ImpactCounters: React.FC = () => {
  const { baseCounters } = siteConfig.settings;
  const [counts, setCounts] = useState({
    meals: 0,
    shelter: 0,
    families: 0,
    youth: 0,
    aid: 0,
  });

  const targets = {
    meals: baseCounters.mealsDelivered,
    shelter: baseCounters.nightsSheltered,
    families: baseCounters.familiesAssisted,
    youth: baseCounters.childrenSupported,
    aid: baseCounters.emergencyAidDeployed / 1000000, // in Millions
  };

  useEffect(() => {
    const duration = 1800; // 1.8s animation
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setCounts({
        meals: Math.floor(targets.meals * ease),
        shelter: Math.floor(targets.shelter * ease),
        families: Math.floor(targets.families * ease),
        youth: Math.floor(targets.youth * ease),
        aid: Number((targets.aid * ease).toFixed(2)),
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const items: CounterItem[] = [
    {
      icon: Utensils,
      label: 'Fresh Meals Distributed',
      target: counts.meals,
      suffix: '+',
    },
    {
      icon: Home,
      label: 'Nights of Emergency Shelter',
      target: counts.shelter,
      suffix: '+',
    },
    {
      icon: Users,
      label: 'Families Economically Stabilized',
      target: counts.families,
      suffix: '+',
    },
    {
      icon: GraduationCap,
      label: 'Youth & Students Mentored',
      target: counts.youth,
      suffix: '+',
    },
    {
      icon: ShieldAlert,
      label: 'Emergency Relief Deployed',
      target: counts.aid,
      prefix: '$',
      suffix: 'M+',
    },
  ];

  return (
    <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
          {items.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center text-center space-y-2 ${
                  idx > 0 ? 'pt-4 lg:pt-0 lg:pl-4' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] flex items-center justify-center">
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white tracking-tight">
                  {item.prefix || ''}
                  {item.prefix ? item.target.toString() : formatNumber(item.target)}
                  {item.suffix || ''}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
