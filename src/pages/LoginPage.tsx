import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, CheckCircle2, User, Sparkles } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useAuth, UserRole } from '../context/AuthContext';
import { siteConfig } from '../config/siteConfig';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { sendMagicLink, signInWithGoogle, simulateDemoLogin, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/portal';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg('');

    const res = await sendMagicLink(email, `${window.location.origin}${from}`);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error.message || 'Failed to send magic link');
    } else {
      setSent(true);
    }
  };

  const handleGoogle = async () => {
    const res = await signInWithGoogle();
    if (res.error) {
      setErrorMsg(res.error.message || 'Google sign-in failed');
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    simulateDemoLogin(role);
    navigate(from);
  };

  return (
    <>
      <SEO
        title="Donor & Volunteer Sign In"
        description="Access your donation tax receipts, recurring gift statements, and volunteer shifts securely via passwordless magic link."
      />

      <div className="py-16 max-w-md mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
              Passwordless Sign In
            </h1>
            <p className="text-xs text-slate-500">
              Enter your email and we'll send a secure magic link. No passwords to remember.
            </p>
          </div>

          {sent ? (
            <div className="p-6 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-[#13A89E] mx-auto" />
              <h3 className="font-serif font-bold text-slate-900 dark:text-white text-base">
                Check Your Inbox
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                We sent a secure sign-in link to <strong>{email}</strong>. Click the link in the email to sign straight into your account.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs font-semibold text-[#13A89E] hover:underline pt-2 block mx-auto"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {loading ? 'Sending link...' : 'Send Magic Link'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative py-2 flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 absolute">
                  or
                </span>
              </div>

              {/* Google Sign-in */}
              <button
                type="button"
                onClick={handleGoogle}
                className="w-full py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Continue with Google</span>
              </button>
            </form>
          )}

          {/* Quick Demo Preview Access for reviewer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Instant Review Access (Demo Mode)</span>
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleQuickDemo('donor')}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] font-medium hover:underline"
              >
                Sign in as Donor
              </button>
              <button
                onClick={() => handleQuickDemo('volunteer')}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-medium hover:underline"
              >
                Volunteer
              </button>
              <button
                onClick={() => handleQuickDemo('admin')}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:underline"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure 501(c)(3) Donor Data Protection</span>
          </div>

        </div>
      </div>
    </>
  );
};
