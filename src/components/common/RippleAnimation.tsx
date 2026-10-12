import React from 'react';
import { Utensils, Home, BookOpen, Heart, Shield, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../lib/format';

interface RippleAnimationProps {
  amountCents: number;
  pillarId?: string;
}

export const RippleAnimation: React.FC<RippleAnimationProps> = ({
  amountCents,
  pillarId = 'general',
}) => {
  const dollars = amountCents / 100;

  // Calculate concrete multiplier outcomes based on dollar amount
  const mealsCount = Math.max(1, Math.round(dollars * 2)); // $25 = 50 meals
  const shelterNights = Math.max(1, Math.round(dollars / 40)); // $40 = 1 night shelter
  const schoolKits = Math.max(1, Math.round(dollars / 35)); // $35 = 1 kit
  const healthSupport = Math.max(1, Math.round(dollars / 30)); // $30 = 1 prescription

  const outcomes = [
    {
      icon: Utensils,
      label: `${mealsCount} Fresh Meals`,
      sub: 'Delivered to families',
      color: 'bg-amber-500/10 text-amber-600 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300',
      pos: '-top-12 -left-6 sm:-top-16 sm:-left-16',
    },
    {
      icon: Home,
      label: `${shelterNights} Nights Shelter`,
      sub: 'Safe warm emergency bed',
      color: 'bg-blue-500/10 text-blue-600 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300',
      pos: '-top-12 -right-6 sm:-top-16 sm:-right-16',
    },
    {
      icon: BookOpen,
      label: `${schoolKits} Learning Kits`,
      sub: 'Equipping rural students',
      color: 'bg-purple-500/10 text-purple-600 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300',
      pos: '-bottom-12 -left-6 sm:-bottom-16 sm:-left-16',
    },
    {
      icon: Heart,
      label: `${healthSupport} Med Grants`,
      sub: 'Preventive co-pay aid',
      color: 'bg-rose-500/10 text-rose-600 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300',
      pos: '-bottom-12 -right-6 sm:-bottom-16 sm:-right-16',
    },
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto py-16 px-4 flex items-center justify-center">
      {/* Concentric expanding ripple rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Ring 1 */}
        <div className="absolute w-44 h-44 rounded-full border border-teal-500/40 dark:border-teal-400/30 animate-ripple-1" />
        {/* Ring 2 */}
        <div className="absolute w-72 h-72 rounded-full border border-teal-400/30 dark:border-teal-300/20 animate-ripple-2" />
        {/* Ring 3 */}
        <div className="absolute w-96 h-96 rounded-full border border-teal-300/20 dark:border-teal-200/10 animate-ripple-3" />
      </div>

      {/* Central Epicenter: The Donor's Amount */}
      <div className="relative z-10 flex flex-col items-center justify-center w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-[#0B2545] to-[#13A89E] text-white shadow-2xl shadow-teal-500/25 p-4 text-center ring-4 ring-white dark:ring-slate-800 transition-transform hover:scale-105 duration-300">
        <Sparkles className="w-5 h-5 text-amber-300 mb-1 animate-pulse" />
        <span className="text-xs uppercase tracking-wider text-teal-100 font-semibold">Your Gift</span>
        <span className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          {formatCurrency(amountCents)}
        </span>
        <span className="text-[11px] text-teal-100/90 mt-1">Expanding outwards</span>
      </div>

      {/* Orbiting Outcome Satellite Badges */}
      {outcomes.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            className={`absolute ${item.pos} z-20 flex items-center gap-3 p-3 sm:p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border shadow-lg transition-all duration-300 hover:scale-105 ${item.color}`}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm shrink-0">
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-tight">
                {item.label}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                {item.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
