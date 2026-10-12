import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  X,
  FileCheck,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { DEMO_VOLUNTEER_OPPORTUNITIES, DEMO_PILLARS } from '../demo/demoData';
import { VolunteerOpportunity } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const VolunteerPage: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [signingUpFor, setSigningUpFor] = useState<VolunteerOpportunity | null>(null);

  // Form fields
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const availableStates = Array.from(new Set(DEMO_VOLUNTEER_OPPORTUNITIES.map((v) => v.state))).sort();

  const filteredOpportunities = DEMO_VOLUNTEER_OPPORTUNITIES.filter((opp) => {
    const matchPillar = selectedPillar === 'all' || opp.pillarId === selectedPillar;
    const matchState = selectedState === 'all' || opp.state === selectedState;
    return matchPillar && matchState;
  });

  const handleOpenModal = (opp: VolunteerOpportunity) => {
    setSigningUpFor(opp);
    setIsConfirmed(false);
    setVolunteerName('');
    setVolunteerEmail('');
    setVolunteerPhone('');
    setEmergencyContact('');
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingUpFor) return;

    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured) {
        await supabase.from('volunteer_signups').insert([
          {
            opportunity_id: signingUpFor.id,
            volunteer_name: volunteerName,
            volunteer_email: volunteerEmail,
            volunteer_phone: volunteerPhone,
            status: 'confirmed',
          },
        ]);
      }
    } catch (err) {
      console.warn('Saved signup', err);
    }

    // Save locally so the user can see it in their portal
    const existing = JSON.parse(localStorage.getItem('ica_my_volunteer_shifts') || '[]');
    existing.push({
      id: `signup-${Date.now()}`,
      opportunityId: signingUpFor.id,
      opportunityTitle: signingUpFor.title,
      dateTime: signingUpFor.dateTime,
      location: signingUpFor.location,
      durationHours: signingUpFor.durationHours,
      volunteerName,
      status: 'confirmed',
    });
    localStorage.setItem('ica_my_volunteer_shifts', JSON.stringify(existing));

    setIsSubmitting(false);
    setIsConfirmed(true);
  };

  return (
    <>
      <SEO
        title="Volunteer Mobilization Hub"
        description="Join thousands of active neighbors across Ohio & Appalachia packing fresh food parcels, assembling accessibility ramps, and mentoring youth."
      />

      {/* Header Banner */}
      <section className="bg-[#0B2545] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Civic Action & Community Service
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
                Put Your Hands Where Heart Is
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Volunteers are the lifeblood of Impact Community Action. In 2025 alone, 3,450 volunteers contributed over 38,000 hours of direct frontline service.
              </p>
            </div>

            <Link
              to="/portal"
              className="px-5 py-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 shrink-0 self-start md:self-auto flex items-center gap-2 transition-colors"
            >
              <FileCheck className="w-4 h-4 text-teal-300" />
              <span>My Shifts & Certificates</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Metrics Bar */}
      <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">3,450</p>
            <p className="text-xs text-slate-500">Active Volunteers</p>
          </div>
          <div>
            <p className="font-serif text-2xl font-bold text-[#13A89E]">38,200</p>
            <p className="text-xs text-slate-500">Service Hours Logged</p>
          </div>
          <div>
            <p className="font-serif text-2xl font-bold text-amber-500">100%</p>
            <p className="text-xs text-slate-500">Safety & Background Verified</p>
          </div>
          <div>
            <p className="font-serif text-2xl font-bold text-purple-600">Free PDF</p>
            <p className="text-xs text-slate-500">Service Hours Certificates</p>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="py-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
            >
              <option value="all">All Cause Pillars</option>
              {DEMO_PILLARS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
            >
              <option value="all">All States</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500">
            Showing {filteredOpportunities.length} scheduled volunteer shifts
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredOpportunities.map((opp) => {
            const pillar = DEMO_PILLARS.find((p) => p.id === opp.pillarId);
            const spotsRemaining = Math.max(0, opp.slotsAvailable - opp.slotsFilled);

            return (
              <div
                key={opp.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: pillar ? pillar.accentColor : '#13A89E' }}
                    >
                      {pillar?.name}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {spotsRemaining > 0 ? (
                        <span className="text-emerald-600 font-bold">{spotsRemaining} slots remaining</span>
                      ) : (
                        <span className="text-rose-500 font-bold">Shift Full</span>
                      )}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#0B2545] dark:text-white leading-snug">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#13A89E]" />
                      <span>{opp.dateTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#13A89E]" />
                      <span>{opp.durationHours} hours per shift</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#13A89E]" />
                      <span>{opp.location}</span>
                    </div>
                  </div>

                  {opp.requirements && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Shift Guidelines
                      </span>
                      <ul className="text-[11px] text-slate-600 dark:text-slate-400 list-disc list-inside space-y-0.5">
                        {opp.requirements.map((req: string, idx: number) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Coordinator: <strong>{opp.coordinatorName}</strong>
                  </div>
                  <button
                    onClick={() => handleOpenModal(opp)}
                    disabled={spotsRemaining === 0}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      spotsRemaining > 0
                        ? 'bg-[#0B2545] hover:bg-[#13A89E] text-white shadow-sm'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Reserve Shift
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Volunteer Shift Reservation Modal */}
      {signingUpFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#13A89E]" />
                <h3 className="font-serif text-lg font-bold text-[#0B2545] dark:text-white">
                  Reserve Volunteer Shift
                </h3>
              </div>
              <button
                onClick={() => setSigningUpFor(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isConfirmed ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                  You're Signed Up!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{volunteerName}</strong>. Your shift for <em>{signingUpFor.title}</em> has been saved. A reminder will be sent prior to the event date.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    to="/portal"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#0B2545] text-white hover:bg-[#13A89E]"
                  >
                    View in My Portal
                  </Link>
                  <button
                    onClick={() => setSigningUpFor(null)}
                    className="px-5 py-2.5 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <strong className="block text-slate-900 dark:text-white font-serif">
                    {signingUpFor.title}
                  </strong>
                  <p className="text-slate-500">{signingUpFor.dateTime}</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Sanchez"
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="maria@example.com"
                      value={volunteerEmail}
                      onChange={(e) => setVolunteerEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone (SMS reminder)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(614) 555-0182"
                      value={volunteerPhone}
                      onChange={(e) => setVolunteerPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Contact (Name & Phone)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Sanchez (614) 555-0199"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-bold bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>{isSubmitting ? 'Confirming...' : 'Confirm My Reservation'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
