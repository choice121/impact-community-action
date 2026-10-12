import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Send, CheckCircle2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { DEMO_PILLARS } from '../../demo/demoData';

export const Footer: React.FC = () => {
  const { settings } = siteConfig;
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#0B2545] text-slate-300 pt-16 pb-24 sm:pb-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Legal Address (span 2 on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#13A89E] to-teal-400 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-current text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl text-white tracking-tight">
                  {settings.legalName}
                </span>
                <span className="text-xs text-teal-300">
                  {settings.tagline}
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              A registered US 501(c)(3) tax-exempt public charity. We partner directly with local communities to deploy transparent, tangible emergency relief, housing stability, and youth empowerment.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  {settings.address.street}, {settings.address.city}, {settings.address.state} {settings.address.zip}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-2 pt-1 font-medium text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Federal EIN / Tax ID: {settings.ein}</span>
              </div>
            </div>
          </div>

          {/* Col 2: 7 Cause Pillars */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              Cause Pillars
            </p>
            <ul className="space-y-2 text-xs">
              {DEMO_PILLARS.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/our-work/${p.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/donate" className="text-amber-400 hover:text-amber-300 font-medium">
                  ★ Where Needed Most Fund
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Transparency & Accountability */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              Get Involved & Impact
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/volunteer" className="hover:text-white transition-colors text-amber-300 font-medium">
                  ✦ Volunteer Opportunities
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Community Events
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-white transition-colors">
                  News & Field Dispatches
                </Link>
              </li>
              <li>
                <Link to="/transparency" className="hover:text-white transition-colors">
                  Where Every Dollar Goes
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-white transition-colors">
                  Annual Impact Report & 990
                </Link>
              </li>
              <li>
                <Link to="/get-help" className="hover:text-white transition-colors">
                  Assistance Application
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-white transition-colors text-teal-300">
                  Donor Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Community Signup */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              Community Dispatch
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bi-weekly verified stories of neighbors helped and field updates. Zero spam, ever.
            </p>

            {subscribed ? (
              <div className="p-3 bg-teal-950/60 border border-teal-800 rounded-xl text-teal-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Check your inbox for a double-opt-in confirmation link!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1.5 top-1.5 p-1 bg-[#13A89E] hover:bg-teal-400 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  Double opt-in required. You can unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Quiet Legal Links & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {settings.legalName}. All rights reserved. 501(c)(3) tax-exempt public charity.
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/privacy" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-slate-200 transition-colors">
              Terms of Use
            </Link>
            <span>·</span>
            <Link to="/refunds" className="hover:text-slate-200 transition-colors">
              Donation Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
