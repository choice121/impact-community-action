import React, { useState, useEffect } from 'react';
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
  Repeat,
  FileText,
  Clock,
  Award,
  AlertCircle,
  Pause,
  Play,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';
import { RippleAnimation } from '../components/common/RippleAnimation';
import { generateDonationReceipt } from '../lib/receiptGenerator';
import { generateVolunteerCertificate } from '../lib/certificateGenerator';
import { DonationRecord, CausePillarId } from '../types';
import { formatCurrency, formatDate } from '../lib/format';
import { DEMO_PROJECTS } from '../demo/demoData';

type PortalTab = 'overview' | 'recurring' | 'receipts' | 'followed' | 'volunteer';

export const PortalPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<PortalTab>('overview');

  // Recurring gift state
  const [recurringPlan, setRecurringPlan] = useState<{
    id: string;
    amountCents: number;
    frequency: 'monthly' | 'annually';
    pillarId: CausePillarId;
    status: 'active' | 'paused';
    nextDate: string;
  }>({
    id: 'sub-9481',
    amountCents: 5000,
    frequency: 'monthly',
    pillarId: 'hunger',
    status: 'active',
    nextDate: 'November 15, 2026',
  });

  // Donations History
  const [donations, setDonations] = useState<DonationRecord[]>([
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
      createdAt: '2026-10-15T10:00:00Z',
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
    {
      id: 'don-3',
      donorName: profile?.fullName || 'Sarah Miller',
      donorEmail: profile?.email || 'sarah@example.com',
      amountCents: 10000,
      currency: 'USD',
      frequency: 'once',
      pillarId: 'education',
      isAnonymous: false,
      status: 'confirmed',
      createdAt: '2025-12-18T16:00:00Z',
      receiptNumber: 'ICA-2025-330192',
    },
  ]);

  // Volunteer shifts from local storage or defaults
  const [volunteerShifts, setVolunteerShifts] = useState<any[]>([
    {
      id: 'vol-shift-1',
      opportunityTitle: 'Eastside Food Hub Weekend Fresh Produce Packing',
      dateTime: 'Saturday, Oct 17, 9:00 AM – 12:30 PM EST',
      location: 'Eastside Logistics Hub, Columbus, OH',
      durationHours: 3.5,
      status: 'confirmed',
    },
    {
      id: 'vol-shift-2',
      opportunityTitle: 'Youth Coding Lab Weekend Mentor',
      dateTime: 'Sunday, Sep 20, 1:00 PM – 3:30 PM EST',
      location: 'Kanawha County Public Library & Virtual',
      durationHours: 2.5,
      status: 'completed',
    },
  ]);

  // Load any newly registered shifts from localStorage
  useEffect(() => {
    try {
      const savedShifts = localStorage.getItem('ica_my_volunteer_shifts');
      if (savedShifts) {
        const parsed = JSON.parse(savedShifts);
        if (parsed.length > 0) {
          setVolunteerShifts((prev) => [...parsed, ...prev.slice(0, 2)]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const totalGivenCents = donations.reduce((sum, d) => sum + d.amountCents, 0);
  const totalVolunteerHours = volunteerShifts.reduce((sum, s) => sum + (s.durationHours || 0), 0);

  const toggleRecurringStatus = () => {
    setRecurringPlan((prev) => ({
      ...prev,
      status: prev.status === 'active' ? 'paused' : 'active',
    }));
  };

  const handleDownloadAnnualReport = (year: number) => {
    const yearDonations = donations.filter((d) => d.createdAt.startsWith(String(year)));
    if (yearDonations.length === 0) {
      alert(`No donations recorded in tax year ${year}.`);
      return;
    }
    // Generate statement from first record with total summary
    generateDonationReceipt({
      ...yearDonations[0],
      receiptNumber: `ICA-ANNUAL-${year}-STATEMENT`,
      amountCents: yearDonations.reduce((sum, d) => sum + d.amountCents, 0),
    });
  };

  return (
    <>
      <SEO
        title="Donor & Volunteer Stewardship Portal"
        description="Manage recurring contributions, generate verified 501(c)(3) annual tax deduction statements, track followed community projects, and download service certificates."
      />

      {/* Header Banner */}
      <div className="bg-[#0B2545] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Stewardship Portal · 501(c)(3) Verified</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">
              Welcome back, {profile?.fullName || user?.email || 'Sarah Miller'}
            </h1>
            <p className="text-xs text-slate-300">
              Role: <span className="capitalize font-semibold text-teal-300">{profile?.role || 'Donor & Volunteer'}</span>
              <span className="mx-2">·</span>
              Giving Member since 2025
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/donate"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-[#0B2545] shadow-md transition-colors"
            >
              Make a Gift
            </Link>
            <button
              onClick={() => signOut()}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto no-scrollbar text-xs font-bold py-2">
            {[
              { id: 'overview', label: 'Impact Overview', icon: Sparkles },
              { id: 'recurring', label: 'Recurring Giving Plan', icon: Repeat },
              { id: 'receipts', label: 'Tax Deduction Statements', icon: FileText },
              { id: 'followed', label: 'Followed Projects Feed', icon: Heart },
              { id: 'volunteer', label: 'Volunteer Shifts & Hours', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as PortalTab)}
                  className={`flex items-center gap-2 py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-[#13A89E] text-[#13A89E]'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Lifetime Giving</span>
                <p className="font-serif text-3xl font-bold text-[#0B2545] dark:text-white">
                  {formatCurrency(totalGivenCents)}
                </p>
                <p className="text-[11px] text-[#13A89E] font-medium">100% Tax-Deductible</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Recurring Plan</span>
                <p className="font-serif text-3xl font-bold text-amber-500">
                  ${recurringPlan.amountCents / 100} / mo
                </p>
                <p className="text-[11px] text-slate-500 capitalize">{recurringPlan.status} status</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Hours Donated</span>
                <p className="font-serif text-3xl font-bold text-teal-600 dark:text-teal-400">
                  {totalVolunteerHours} Hours
                </p>
                <p className="text-[11px] text-slate-500">2 Community Shifts</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Generosity Streak</span>
                <p className="font-serif text-3xl font-bold text-purple-600">
                  6 Months
                </p>
                <p className="text-[11px] text-slate-500">Community Guardian Badge</p>
              </div>
            </div>

            {/* Signature Concentric Ripple Visualization */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#13A89E]">
                Personal Impact Mapping
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                Your Cumulative Ripple Effect
              </h2>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                Watch how your combined ${totalGivenCents / 100} in contributions has rippled directly into meals, emergency rent releases, and school kits.
              </p>
              <RippleAnimation amountCents={totalGivenCents} />
            </div>
          </div>
        )}

        {/* TAB 2: RECURRING GIFTS MANAGER */}
        {activeTab === 'recurring' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                Recurring Giving Plan
              </h2>
              <p className="text-xs text-slate-500">
                You have full control over your recurring gift. Pause, adjust, or cancel anytime with zero friction or waiting.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                    <Repeat className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                      ${recurringPlan.amountCents / 100} / month · Hunger & Nutrition Fund
                    </h3>
                    <p className="text-xs text-slate-500">Plan #{recurringPlan.id} · Next charge: {recurringPlan.nextDate}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    recurringPlan.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                  }`}
                >
                  {recurringPlan.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <span className="text-slate-400 block">Designated Cause</span>
                  <strong className="text-slate-900 dark:text-white capitalize">{recurringPlan.pillarId} Pillar</strong>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <span className="text-slate-400 block">Payment Method</span>
                  <strong className="text-slate-900 dark:text-white">Secure External Card (••• 4242)</strong>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <span className="text-slate-400 block">Fee Coverage</span>
                  <strong className="text-emerald-600">Covering fees (+2.9%)</strong>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3">
                <button
                  onClick={toggleRecurringStatus}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  {recurringPlan.status === 'active' ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause for 1 Month</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Resume Giving Plan</span>
                    </>
                  )}
                </button>

                <Link
                  to="/donate?amount=75"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Change Giving Tier</span>
                </Link>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you wish to cancel this recurring gift?')) {
                      setRecurringPlan((prev) => ({ ...prev, status: 'paused' }));
                      alert('Your recurring gift has been cancelled. Thank you for your past support!');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl font-medium text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ml-auto"
                >
                  Cancel Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TAX DEDUCTION STATEMENTS */}
        {activeTab === 'receipts' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                  Tax Deduction Receipts & Annual Statements
                </h2>
                <p className="text-xs text-slate-500">
                  Every contribution is 100% tax-deductible under IRS code 501(c)(3). Download official PDF letters below.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadAnnualReport(2026)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>2026 Annual Statement (PDF)</span>
                </button>
                <button
                  onClick={() => handleDownloadAnnualReport(2025)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>2025 Statement</span>
                </button>
              </div>
            </div>

            {/* Individual Receipts Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/40">
                    <th className="py-3 px-6">Receipt #</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6">Designation</th>
                    <th className="py-3 px-6">Type</th>
                    <th className="py-3 px-6">Amount</th>
                    <th className="py-3 px-6 text-right">PDF Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                      <td className="py-4 px-6 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {d.receiptNumber}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {formatDate(d.createdAt)}
                      </td>
                      <td className="py-4 px-6 font-semibold capitalize text-slate-800 dark:text-slate-200">
                        {d.pillarId} Pillar
                        {d.inHonorOf && <span className="block text-[11px] text-amber-600 font-normal">Tribute: {d.inHonorOf}</span>}
                      </td>
                      <td className="py-4 px-6 capitalize text-slate-500">
                        {d.frequency}
                      </td>
                      <td className="py-4 px-6 font-bold text-[#13A89E] font-serif text-sm">
                        {formatCurrency(d.amountCents, true)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => generateDonationReceipt(d)}
                          className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] hover:bg-[#13A89E] hover:text-white font-bold transition-colors inline-flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: FOLLOWED PROJECTS FEED */}
        {activeTab === 'followed' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                Followed Projects & Field Milestones
              </h2>
              <p className="text-xs text-slate-500">
                Real-time updates directly from organizers on the projects you contributed towards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DEMO_PROJECTS.slice(0, 2).map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#13A89E]">{proj.city}, {proj.state}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                      Funded by you
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                    {proj.title}
                  </h3>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{formatCurrency(proj.raisedCents)}</span>
                      <span>Goal: {formatCurrency(proj.goalCents)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-[#13A89E]"
                        style={{ width: `${Math.min(100, Math.round((proj.raisedCents / proj.goalCents) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Latest Milestone / Update */}
                  {proj.updates.length > 0 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 text-xs">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span className="font-bold text-[#0B2545] dark:text-teal-300">{proj.updates[0].author}</span>
                        <span>{proj.updates[0].date}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{proj.updates[0].title}</p>
                      <p className="text-slate-500 text-[11px] line-clamp-2">{proj.updates[0].content}</p>
                    </div>
                  )}

                  <Link
                    to={`/projects/${proj.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#13A89E] hover:underline pt-2"
                  >
                    <span>View Full Project Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: VOLUNTEER DASHBOARD & CERTIFICATES */}
        {activeTab === 'volunteer' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                  My Volunteer Shifts & Service Certificates
                </h2>
                <p className="text-xs text-slate-500">
                  Track upcoming volunteer shifts and download signed certificates of service for school or employer recognition.
                </p>
              </div>

              <Link
                to="/volunteer"
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <span>Browse New Shifts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Certificate Highlight Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-500/10 via-amber-500/10 to-teal-500/10 border border-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#13A89E] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                    Verified Service Award: {totalVolunteerHours} Hours Contributed
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Official 501(c)(3) signed letter and certificate suitable for high school, college honors, or corporate match.
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  generateVolunteerCertificate({
                    volunteerName: profile?.fullName || 'Sarah Miller',
                    hoursCompleted: totalVolunteerHours,
                    programName: 'Eastside Food Hub & Youth Tech Mentorship',
                    completionDate: 'October 11, 2026',
                    coordinatorName: 'David Washington',
                  })
                }
                className="px-5 py-3 rounded-xl font-bold text-xs bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center gap-2 shadow-md shrink-0 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Generate Official Certificate (PDF)</span>
              </button>
            </div>

            {/* Shifts Listing */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                Upcoming & Recent Shifts
              </h3>

              <div className="space-y-3">
                {volunteerShifts.map((shift, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <strong className="block text-slate-900 dark:text-white text-sm">
                        {shift.opportunityTitle}
                      </strong>
                      <div className="flex flex-wrap items-center gap-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#13A89E]" />
                          {shift.dateTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#13A89E]" />
                          {shift.durationHours} hrs
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/40 text-[#13A89E]">
                        Confirmed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};
