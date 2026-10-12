import React, { useState } from 'react';
import { Send, CheckCircle2, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#0B2545] via-[#0E325D] to-[#13A89E] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Header */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Join Our Movement
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Ready to make a real difference in someone's life today?
          </h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Whether you give $25 once, join our monthly giving circle, or receive our transparent field reports, you are part of a neighborhood transformed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/donate"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-amber-400 hover:bg-amber-300 text-[#0B2545] shadow-xl flex items-center justify-center gap-2 transition-transform transform active:scale-95"
          >
            <Heart className="w-5 h-5 fill-[#0B2545]" />
            <span>Donate $40 Today</span>
          </Link>
          <Link
            to="/stories"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-colors"
          >
            <span>Read Stories of Impact</span>
          </Link>
        </div>

        {/* Newsletter Box */}
        <div className="max-w-xl mx-auto pt-8 border-t border-white/15">
          <p className="text-xs text-slate-300 mb-4">
            Or subscribe to the <strong>ICA Monthly Dispatch</strong> — verified frontline stories, zero solicitation spam.
          </p>

          {submitted ? (
            <div className="p-4 bg-teal-900/60 border border-teal-400/40 rounded-2xl text-teal-200 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-300" />
              <span>Double confirmation email sent! Please check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-white text-[#0B2545] hover:bg-teal-50 font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
