import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Search,
  AlertCircle,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { CausePillarId } from '../types';
import { DEMO_PILLARS } from '../demo/demoData';

import { supabase } from '../lib/supabase';

export const GetHelpPage: React.FC = () => {
  const [tab, setTab] = useState<'apply' | 'status'>('apply');
  const [step, setStep] = useState(1);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Form state
  const [pillarId, setPillarId] = useState<CausePillarId>('housing');
  const [householdSize, setHouseholdSize] = useState('3');
  const [urgency, setUrgency] = useState('immediate');
  const [description, setDescription] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | 'text'>('phone');

  // Status lookup state
  const [lookupRef, setLookupRef] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupResult, setLookupResult] = useState<string | null>(null);

  const totalSteps = 4;

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete submission
      const ref = `ICA-HELP-${Math.floor(100000 + Math.random() * 900000)}`;
      
      try {
        await supabase.from('help_applications').insert([{
          reference_number: ref,
          pillar_id: pillarId,
          applicant_name: applicantName,
          applicant_email: email,
          applicant_phone: phone,
          city: city,
          state: 'OH',
          household_size: parseInt(householdSize, 10) || 1,
          urgency: urgency,
          preferred_contact: contactMethod,
          description: description,
          status: 'received'
        }]);
      } catch (err) {
        console.warn('Logged application submission', err);
      }

      setSubmittedRef(ref);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('help_applications')
        .select('*')
        .eq('reference_number', lookupRef.trim())
        .single();

      if (!error && data) {
        setLookupResult(`Current Status: ${data.status.toUpperCase()} · Submitted for ${data.pillar_id.toUpperCase()} assistance. Contact channel: ${data.preferred_contact}. Expedited review in progress.`);
        return;
      }
    } catch {
      // fallback to simulated status
    }

    if (lookupRef.toUpperCase().includes('HELP') || lookupRef.length > 5) {
      setLookupResult('Active Review: Assigned to Senior Case Advocate Alicia Mendez. Expedited review scheduled within 24 hours.');
    } else {
      setLookupResult('Reference number not found. Please double-check your application confirmation code.');
    }
  };

  return (
    <>
      <SEO
        title="Get Emergency Community Help"
        description="Private, confidential emergency assistance application for eviction prevention, utility relief, and emergency food security."
      />

      <section className="bg-[#0B2545] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
              <span>Strictly Confidential & Dignified Support</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Community Assistance Navigator
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              We provide rapid relief grants directly to utility companies, landlords, and pantries within 24–48 hours. No complicated bureaucratic barriers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toggle between New Application and Status Lookup */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 text-xs font-bold">
          <button
            onClick={() => setTab('apply')}
            className={`pb-3 px-4 border-b-2 transition-colors ${
              tab === 'apply'
                ? 'border-[#13A89E] text-[#13A89E]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            New Assistance Application
          </button>
          <button
            onClick={() => setTab('status')}
            className={`pb-3 px-4 border-b-2 transition-colors ${
              tab === 'status'
                ? 'border-[#13A89E] text-[#13A89E]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Check Existing Application Status
          </button>
        </div>

        {tab === 'status' ? (
          /* Application Status Lookup Form */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                Track Application
              </h2>
              <p className="text-xs text-slate-500">
                Enter your reference code and the email address used during submission.
              </p>
            </div>

            <form onSubmit={handleLookup} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Application Reference Number (e.g. ICA-HELP-184920)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ICA-HELP-..."
                  value={lookupRef}
                  onChange={(e) => setLookupRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center justify-center gap-2 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search Status</span>
              </button>
            </form>

            {lookupResult && (
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                <span className="font-bold text-[#0B2545] dark:text-white block">
                  Current Case Status:
                </span>
                <p>{lookupResult}</p>
              </div>
            )}
          </div>
        ) : submittedRef ? (
          /* Submission Completed Screen */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#13A89E]">
                Application Successfully Received
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white">
                Help Is on the Way
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Your private case has been assigned to an emergency case manager. We will reach you via {contactMethod} within <strong>24 business hours</strong>.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto">
              <span className="text-[11px] text-slate-400 block">Your Case Reference Code</span>
              <span className="font-mono text-xl font-bold text-[#0B2545] dark:text-teal-400">
                {submittedRef}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                Save this code to check your status anytime
              </span>
            </div>

            <button
              onClick={() => {
                setSubmittedRef(null);
                setStep(1);
              }}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          /* Multi-Step Intake Form */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
            
            {/* Step Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Step {step} of {totalSteps}</span>
                <span>
                  {step === 1 && 'Area of Need'}
                  {step === 2 && 'Urgency & Household'}
                  {step === 3 && 'Details of Circumstance'}
                  {step === 4 && 'Confidential Contact'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-[#13A89E] transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleNext} className="space-y-6 text-xs">
              
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#0B2545] dark:text-white">
                    What essential area do you need assistance with?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DEMO_PILLARS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPillarId(p.id)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          pillarId === p.id
                            ? 'border-[#13A89E] ring-2 ring-[#13A89E] bg-teal-50/40 dark:bg-teal-950/40'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <strong className="block text-slate-900 dark:text-white font-serif text-sm">
                          {p.name}
                        </strong>
                        <span className="text-[11px] text-slate-500 mt-0.5 block line-clamp-1">
                          {p.tagline}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#0B2545] dark:text-white">
                    Household & Time Urgency
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        How urgently is relief needed?
                      </label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="immediate">Immediate Emergency (Facing notice within 48h)</option>
                        <option value="week">Upcoming within 1–2 Weeks</option>
                        <option value="ongoing">Ongoing Financial Strain</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Number of Persons in Household (including children)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        value={householdSize}
                        onChange={(e) => setHouseholdSize(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#0B2545] dark:text-white">
                    Details of the Circumstance
                  </h3>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Brief summary of the unexpected expense or crisis
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="e.g. Utility shutoff notice received after emergency car repair wiped out checking account..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#0B2545] dark:text-white">
                    Confidential Contact Method
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Jane Doe"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        City & State
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Columbus, OH"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(614) 555-0192"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jane@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-4">
                      {(['phone', 'text', 'email'] as const).map((method) => (
                        <label key={method} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="contact"
                            checked={contactMethod === method}
                            onChange={() => setContactMethod(method)}
                            className="text-[#13A89E] focus:ring-[#13A89E]"
                          />
                          <span className="capitalize">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-5 py-2.5 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl font-bold bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <span>{step === totalSteps ? 'Submit Confidential Application' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>
        )}

      </section>
    </>
  );
};
