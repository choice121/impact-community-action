import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';

export const MobileDonateBar: React.FC = () => {
  const location = useLocation();

  // Hide on donate page and donate thank you page to avoid redundant distraction
  if (location.pathname.startsWith('/donate')) return null;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B2545]/95 backdrop-blur-md border-t border-slate-800 p-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
      <div className="flex flex-col pl-1">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-300">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>$40 houses a family for 1 week</span>
        </div>
        <span className="text-[10px] text-slate-300">
          100% tax-deductible 501(c)(3)
        </span>
      </div>

      <Link
        to="/donate"
        className="min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-[#13A89E] text-[#0B2545] shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform shrink-0"
      >
        <Heart className="w-4 h-4 fill-[#0B2545]" />
        <span>Give Now</span>
      </Link>
    </div>
  );
};
