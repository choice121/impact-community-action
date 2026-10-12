import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  ShieldCheck,
  FolderPlus,
  Users,
  FileSpreadsheet,
  FileCheck,
  Download,
  CheckCircle2,
  Clock,
  Search,
  PlusCircle,
  Eye,
  AlertCircle,
  DollarSign,
  TrendingUp,
  History,
  LifeBuoy,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';
import {
  DEMO_PROJECTS,
  DEMO_PILLARS,
  DEMO_HELP_APPLICATIONS,
  DEMO_AUDIT_LOG,
  DEMO_PUBLIC_ACTIVITY,
} from '../demo/demoData';
import { formatCurrency, formatDate } from '../lib/format';
import { ImageKitUploader } from '../components/admin/ImageKitUploader';
import { CsvDonationImporter } from '../components/admin/CsvDonationImporter';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

type AdminTab = 'analytics' | 'projects' | 'casework' | 'stories' | 'finance' | 'subscribers' | 'audit';

export const AdminPage: React.FC = () => {
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  // Casework state
  const [helpApps, setHelpApps] = useState<any[]>(DEMO_HELP_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  // Offline Donation Entry Form state
  const [offlineName, setOfflineName] = useState('');
  const [offlineEmail, setOfflineEmail] = useState('');
  const [offlineAmount, setOfflineAmount] = useState('');
  const [offlinePillar, setOfflinePillar] = useState('general');
  const [offlineType, setOfflineType] = useState('Check');
  const [offlineRecorded, setOfflineRecorded] = useState(false);

  // New Project Form state
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectGoal, setNewProjectGoal] = useState('');
  const [newProjectPillar, setNewProjectPillar] = useState('hunger');
  const [newProjectCity, setNewProjectCity] = useState('');
  const [newProjectImage, setNewProjectImage] = useState('');

  // Story submissions review queue
  const [storySubmissions, setStorySubmissions] = useState<any[]>([
    {
      id: 'sub-1',
      authorName: 'Maria R.',
      pillarId: 'hunger',
      locationCity: 'Hilltop, Columbus',
      storyBody: 'The weekly fruit and dairy boxes meant my 2 kids had fresh breakfast every morning before school started. It gave me breathing room to finish nursing school.',
      firstNameOnly: true,
      consentGranted: true,
      status: 'pending_review',
      createdAt: '2026-10-10T14:00:00Z',
    },
    {
      id: 'sub-2',
      authorName: 'David K.',
      pillarId: 'housing',
      locationCity: 'Cleveland, OH',
      storyBody: 'My landlord accepted the direct settlement within 12 hours of filing. Saved our family from moving into temporary shelter.',
      firstNameOnly: true,
      consentGranted: true,
      status: 'pending_review',
      createdAt: '2026-10-09T09:30:00Z',
    },
  ]);

  // Subscribers list
  const subscribers = [
    { email: 'patricia.h@example.com', name: 'Patricia Henderson', joined: '2026-10-08' },
    { email: 'james.w@example.com', name: 'James Wright', joined: '2026-10-07' },
    { email: 'maria.s@example.com', name: 'Maria Sanchez', joined: '2026-10-05' },
    { email: 'carlos.m@example.com', name: 'Carlos Mendez', joined: '2026-10-01' },
  ];

  const handleUpdateAppStatus = (appId: string, newStatus: string) => {
    setHelpApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp((prev: any) => ({ ...prev, status: newStatus }));
    }
  };

  const handleRecordOfflineDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountCents = Math.round(parseFloat(offlineAmount) * 100);
    const receiptNum = `ICA-OFFLINE-${Date.now().toString().slice(-6)}`;

    if (isSupabaseConfigured) {
      try {
        await supabase.from('donations').insert([
          {
            donor_name: offlineName,
            donor_email: offlineEmail || 'donor@impactaction.org',
            amount_cents: amountCents,
            currency: 'USD',
            frequency: 'once',
            pillar_id: offlinePillar,
            status: 'confirmed',
            source: offlineType.toLowerCase(),
            receipt_number: receiptNum,
          },
        ]);
      } catch (err) {
        console.warn('Recorded locally', err);
      }
    }

    setOfflineRecorded(true);
    setOfflineName('');
    setOfflineEmail('');
    setOfflineAmount('');
  };

  const handleExportSubscribers = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,Full Name,Joined Date', ...subscribers.map((s) => `${s.email},${s.name},${s.joined}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ica_newsletter_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <SEO
        title="Staff & Governance Operations Hub"
        description="Internal command desk for casework triage, financial auditing, offline donation recording, and CMS publication."
      />

      {/* Admin Header */}
      <div className="bg-[#0B2545] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Executive Command Desk · RBAC Level: Staff/Admin</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">
              Operations & Governance Portal
            </h1>
            <p className="text-xs text-slate-300">
              Active Session: <strong>{profile?.fullName || user?.email || 'Administrator'}</strong> (Role: {profile?.role || 'Admin'})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/portal"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Public Donor View
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Subnav */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto no-scrollbar text-xs font-bold py-2">
            {[
              { id: 'analytics', label: 'Executive Analytics', icon: BarChart3 },
              { id: 'projects', label: 'Projects & Milestones CMS', icon: FolderPlus },
              { id: 'casework', label: 'Emergency Casework Desk', icon: LifeBuoy },
              { id: 'stories', label: 'Story Review & Consent Queue', icon: FileCheck },
              { id: 'finance', label: 'Offline Giving & CSV Import', icon: DollarSign },
              { id: 'subscribers', label: 'Subscribers (CSV Export)', icon: Users },
              { id: 'audit', label: 'Financial Audit Trail', icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
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

      {/* Main Content */}
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 1. EXECUTIVE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">Total Funds Mobilized</span>
                <p className="font-serif text-3xl font-bold text-[#0B2545] dark:text-white">$2,435,000</p>
                <p className="text-[11px] text-emerald-600 font-semibold">+18.4% YoY</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">Average Gift Size</span>
                <p className="font-serif text-3xl font-bold text-[#13A89E]">$84.50</p>
                <p className="text-[11px] text-slate-500">Median Gift: $50.00</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">Donor Retention Rate</span>
                <p className="font-serif text-3xl font-bold text-amber-500">76.8%</p>
                <p className="text-[11px] text-slate-500">Benchmark: 43.6%</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">Direct Programmatic</span>
                <p className="font-serif text-3xl font-bold text-purple-600">88.2%</p>
                <p className="text-[11px] text-slate-500">Audited Form 990</p>
              </div>
            </div>

            {/* Recent Live Activity Feed */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                Live Transaction & Inflow Stream
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {DEMO_PUBLIC_ACTIVITY.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 dark:text-white">{item.donorName}</strong>
                      <span className="text-slate-500 ml-2">contributed to {item.pillarName}</span>
                    </div>
                    <div className="font-bold text-[#13A89E] font-serif text-sm">
                      {formatCurrency(item.amountCents)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. PROJECTS & MILESTONES CMS */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                  Projects & Milestones Manager
                </h2>
                <p className="text-xs text-slate-500">
                  Publish grassroots initiatives, adjust funding targets, and upload field photos.
                </p>
              </div>
            </div>

            {/* ImageKit Staff Uploader Widget */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white mb-2">
                Quick ImageKit Media CDN Uploader
              </h3>
              <ImageKitUploader
                onSuccess={(url) => {
                  setNewProjectImage(url);
                  alert(`Image successfully optimized on ImageKit: ${url}`);
                }}
              />
              {newProjectImage && (
                <p className="text-[11px] text-teal-600 font-mono mt-2 truncate">
                  Latest uploaded asset: {newProjectImage}
                </p>
              )}
            </div>

            {/* Existing Projects Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold uppercase">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Project Title</th>
                    <th className="py-3 px-4">Pillar</th>
                    <th className="py-3 px-4">Raised / Goal</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Days Left</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {DEMO_PROJECTS.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {proj.title}
                      </td>
                      <td className="py-3.5 px-4 capitalize text-slate-600 dark:text-slate-400">
                        {proj.pillarId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#13A89E]">{formatCurrency(proj.raisedCents)}</span>
                        <span className="text-slate-400"> / {formatCurrency(proj.goalCents)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                          {proj.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {proj.daysRemaining} days
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. CASEWORK / HELP APPLICATIONS */}
        {activeTab === 'casework' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                Emergency Assistance Casework Queue
              </h2>
              <p className="text-xs text-slate-500">
                Confidential client triage desk. Review utility shutoff notices, assign advocates, and disburse relief vouchers.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Queue List */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">
                  Active Intake Applications ({helpApps.length})
                </h3>

                <div className="space-y-3">
                  {helpApps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                        selectedApp?.id === app.id
                          ? 'border-[#13A89E] ring-2 ring-[#13A89E] bg-teal-50/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#0B2545] dark:text-teal-300">
                          {app.referenceNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            app.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : app.status === 'under_review'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white mt-1">
                        {app.applicantName} ({app.city}, {app.state})
                      </div>
                      <p className="text-slate-500 mt-1 line-clamp-2">{app.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail Panel */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
                {selectedApp ? (
                  <div className="space-y-4 text-xs">
                    <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-xs font-bold text-[#13A89E]">
                        {selectedApp.referenceNumber}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {selectedApp.applicantName}
                      </h4>
                      <p className="text-slate-500">
                        {selectedApp.applicantEmail} · {selectedApp.applicantPhone}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <strong className="block text-slate-700 dark:text-slate-300">Description:</strong>
                      <p className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                        {selectedApp.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <strong className="block text-slate-700 dark:text-slate-300">Internal Advocate Notes:</strong>
                      <p className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50">
                        {selectedApp.internalNotes || 'No advocate notes yet.'}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <strong className="block text-slate-700 dark:text-slate-300">Update Case Status:</strong>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleUpdateAppStatus(selectedApp.id, 'under_review')}
                          className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold"
                        >
                          Mark Under Review
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(selectedApp.id, 'approved')}
                          className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold"
                        >
                          Approve Grant
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-12">
                    Select an application from the left to inspect caseworker details and update status.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. STORIES & CONSENT REVIEW */}
        {activeTab === 'stories' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                Stories & Participant Consent Review Queue
              </h2>
              <p className="text-xs text-slate-500">
                Ethical verification protocol: stories require signed consent before publishing to the public gallery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {storySubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#13A89E] capitalize">{sub.pillarId} Pillar</span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                      Pending Review
                    </span>
                  </div>

                  <div>
                    <strong className="block text-slate-900 dark:text-white text-sm">
                      {sub.authorName} ({sub.locationCity})
                    </strong>
                    <span className="text-[11px] text-slate-400">
                      Privacy: {sub.firstNameOnly ? 'First Name Only Protected' : 'Full Name Permitted'}
                    </span>
                  </div>

                  <p className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{sub.storyBody}"
                  </p>

                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Participant Consent Verified on File</span>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setStorySubmissions((prev) => prev.filter((s) => s.id !== sub.id));
                        alert('Story approved and published to live Stories Gallery!');
                      }}
                      className="flex-1 py-2 rounded-xl font-bold bg-[#0B2545] hover:bg-[#13A89E] text-white transition-colors"
                    >
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => setStorySubmissions((prev) => prev.filter((s) => s.id !== sub.id))}
                      className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. OFFLINE GIVING & CSV IMPORTER */}
        {activeTab === 'finance' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            {/* CSV Batch Importer Component */}
            <CsvDonationImporter />

            {/* Manual Single Donation Record Form */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0B2545] dark:text-white">
                Record Individual Offline Donation (Check, Cash, or Wire)
              </h3>

              {offlineRecorded ? (
                <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-2xl text-center space-y-2 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-[#13A89E] mx-auto" />
                  <p className="font-bold text-slate-900 dark:text-white">Donation Successfully Logged</p>
                  <button
                    onClick={() => setOfflineRecorded(false)}
                    className="px-4 py-2 rounded-xl bg-[#0B2545] text-white font-bold"
                  >
                    Record Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRecordOfflineDonation} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Donor Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Thomas Edison"
                        value={offlineName}
                        onChange={(e) => setOfflineName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Donor Email</label>
                      <input
                        type="email"
                        placeholder="thomas@example.com"
                        value={offlineEmail}
                        onChange={(e) => setOfflineEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Amount ($ USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="500.00"
                        value={offlineAmount}
                        onChange={(e) => setOfflineAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Designated Pillar</label>
                      <select
                        value={offlinePillar}
                        onChange={(e) => setOfflinePillar(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <option value="general">General Emergency Fund</option>
                        {DEMO_PILLARS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Payment Instrument</label>
                      <select
                        value={offlineType}
                        onChange={(e) => setOfflineType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <option value="Check">Physical Check</option>
                        <option value="Wire">Bank Wire / ACH</option>
                        <option value="Grant">Foundation Grant</option>
                        <option value="Cash">Cash Receipt</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold bg-[#0B2545] hover:bg-[#13A89E] text-white transition-colors"
                  >
                    Commit Offline Record to Supabase
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 6. SUBSCRIBERS LIST (CSV EXPORT) */}
        {activeTab === 'subscribers' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                  Newsletter & Dispatch Subscribers
                </h2>
                <p className="text-xs text-slate-500">
                  Double opt-in verified email recipients for the monthly frontline impact dispatch.
                </p>
              </div>

              <button
                onClick={handleExportSubscribers}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Active List (CSV)</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold uppercase">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-6">Email Address</th>
                    <th className="py-3 px-6">Subscriber Name</th>
                    <th className="py-3 px-6">Subscribed Date</th>
                    <th className="py-3 px-6">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {subscribers.map((sub, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">{sub.email}</td>
                      <td className="py-3.5 px-6 text-slate-600 dark:text-slate-300">{sub.name}</td>
                      <td className="py-3.5 px-6 text-slate-500">{sub.joined}</td>
                      <td className="py-3.5 px-6">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          Confirmed Opt-in
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. FINANCIAL AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                Chronological Financial Audit Trail
              </h2>
              <p className="text-xs text-slate-500">
                Immutable system audit records created by PostgreSQL triggers for regulatory compliance.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold uppercase">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Entity Type</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Payload Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {DEMO_AUDIT_LOG.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {log.action}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{log.entityType}</td>
                      <td className="py-3.5 px-4 text-[#13A89E]">{log.actorId}</td>
                      <td className="py-3.5 px-4 text-slate-400">{formatDate(log.createdAt)}</td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 truncate max-w-xs">
                        {JSON.stringify(log.payload)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </>
  );
};
