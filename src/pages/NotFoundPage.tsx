import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, ArrowLeft } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO title="Page Not Found" />
      <div className="py-24 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] flex items-center justify-center mx-auto shadow-sm">
          <Heart className="w-10 h-10 fill-current" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Error 404
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B2545] dark:text-white">
          This Page Has Moved or Doesn't Exist
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          The link you followed may be outdated. You can explore our 7 cause pillars, review ongoing community projects, or return to the home page.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-[#0B2545] text-white hover:bg-[#13A89E] transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/our-work"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Cause Pillars</span>
          </Link>
        </div>
      </div>
    </>
  );
};
