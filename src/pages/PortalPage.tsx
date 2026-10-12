import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Download,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  LogOut,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';
import { RippleAnimation } from '../components/common/RippleAnimation';
import { generateDonationReceipt } from '../lib/receiptGenerator';
import { DonationRecord } from '../types';
import { formatCurrency, formatDate } from '../lib/format';

export const PortalPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();

  // Mock donor history for demo
  const [donations] = useState<DonationRecord[]>([
    {
      id: 'don-1',
      donorName: profile?.fullName || 'Sarah Miller',
      donorEmail: profile?.email || 'sarah@example.com',
      amountCents: 5000,
      currency: 'USD',
      frequency: 'monthly',
      pillarId: 'hunger',
      isAnonymous: false,
      status: 'confirmed',
      createdAt: '2026-09-15T10:00:00Z',
      receiptNumber: 'ICA-2026-894102',
    },
    {
      id: 'don-2',
      donorName: profile?.fullName || 'Sarah Miller',
      donorEmail: profile?.email || 'sarah@example.com',
      amountCents: 15000,
      currency: 'USD',
      frequency: 'once',
      pillarId: 'housing',
      isAnonymous: false,
      inHonorOf: 'Grandma Betty',
      status: 'confirmed',
      createdAt: '2026-07-02T14:30:00Z',
      receiptNumber: 'ICA-2026-612940',
    },
  ]);

  const totalGivenCents = donations.reduce((sum, d) => sum + d.amountCents, 0);

  return (
    <>
      <SEO
        title="Donor Portal"
        description="View your cumulative charitable impact, download official 501(c)(3) tax receipts, and track funded community milestones."
      />

      <div className="bg-[#0B2545] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Donor Stewardship Portal
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">
              Welcome back, {profile?.fullName || user?.email || 'Valued Supporter'}
            </h1>
            <p className="text-xs text-slate-300">
              Role: <span className="capitalize font-semibold text-teal-300">{profile?.role || 'Donor'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/donate"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-[#0B2545] hover:bg-amber-300 transition-colors"
            >
              Make New Gift
            </Link>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Lifetime Giving</span>
            <p className="font-serif text-3xl font-bold text-[#0B2545] dark:text-white">
              {formatCurrency(totalGivenCents)}
            </p>
            <p className="text-[11px] text-[#13A89E] font-medium">100% Tax-Deductible</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Impact Generated</span>
            <p className="font-serif text-3xl font-bold text-teal-600 dark:text-teal-400">
              100 Meals + 3 Nights
            </p>
            <p className="text-[11px] text-slate-500">Across 2 Community Pillars</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recurring Status</span>
            <p className="font-serif text-3xl font-bold text-amber-500">
              $50 / month
            </p>
            <p className="text-[11px] text-slate-500">Next renewal: Nov 15, 2026</p>
          </div>
        </div>

        {/* Signature Concentric Ripple Preview in Dashboard */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
            Your Cumulative Ripple Effect
          </h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Visualizing how your collective support ripples outward into meals, warm housing, and student tools.
          </p>
          <RippleAnimation amountCents={totalGivenCents} />
        </div>

        {/* Donation Records & Tax Receipts Download List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0B2545] dark:text-white">
                Giving History & Tax Deduction Receipts
              </h2>
              <p className="text-xs text-slate-500">
                Official receipts eligible for IRS tax filings.
              </p>
            </div>
            <button
              onClick={() => generateDonationReceipt(donations[0])}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Annual Statement</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-right">Tax PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {d.receiptNumber}
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {formatDate(d.createdAt)}
                    </td>
                    <td className="py-4 px-4 font-semibold capitalize text-slate-800 dark:text-slate-200">
                      {d.pillarId} Pillar
                    </td>
                    <td className="py-4 px-4 capitalize text-slate-500">
                      {d.frequency}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#13A89E]">
                      {formatCurrency(d.amountCents, true)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => generateDonationReceipt(d)}
                        className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] hover:bg-[#13A89E] hover:text-white transition-colors"
                        title="Download Tax Receipt PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
};
