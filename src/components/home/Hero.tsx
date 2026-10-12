import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { IKImage } from '../common/IKImage';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#0B2545] text-white py-20 lg:py-28">
      {/* Background Image with dramatic gradient overlay */}
      <div className="absolute inset-0 z-0">
        <IKImage
          path="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80"
          alt="Community volunteer handing fresh food box to an elder"
          priority={true}
          className="w-full h-full object-cover opacity-20 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545] via-[#0B2545]/90 to-[#0B2545]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-8">
          
          {/* Trust Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>US 501(c)(3) Nonprofit · 88% Direct Program Allocation</span>
          </div>

          {/* Headline (Fraunces serif) */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            Small acts. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-100 to-amber-300">
              Real community impact.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-slate-200 font-sans leading-relaxed max-w-2xl">
            $40 keeps a working family housed for a week. We eliminate food deserts, stop courtroom evictions, and mentor the next generation across 7 core cause pillars.
          </p>

          {/* The Two Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              to="/donate"
              className="px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-amber-400 to-[#13A89E] hover:from-amber-300 hover:to-teal-400 text-[#0B2545] shadow-xl shadow-teal-900/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Heart className="w-5 h-5 fill-[#0B2545]" />
              <span>Donate Now</span>
            </Link>

            <Link
              to="/impact"
              className="px-8 py-4 rounded-xl font-semibold text-base bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition-all duration-200"
            >
              <span>See Our Impact</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Micro Trust Indicators */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Instant tax-deductible PDF receipt</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>100% transparent fund tracking</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Charity Navigator 4-Star rating</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
