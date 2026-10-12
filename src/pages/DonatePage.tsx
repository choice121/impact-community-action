import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Gift,
  EyeOff,
  ExternalLink,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { DEMO_PILLARS, DEMO_PROJECTS } from '../demo/demoData';
import { siteConfig, getDonationUrl } from '../config/siteConfig';
import { formatCurrency } from '../lib/format';
import { CausePillarId } from '../types';

export const DonatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initial params
  const initialPillar = searchParams.get('pillar') || 'general';
  const initialProject = searchParams.get('project') || '';
  const initialAmount = Number(searchParams.get('amount')) || 50;

  // State
  const [frequency, setFrequency] = useState<'once' | 'monthly' | 'annually'>('monthly');
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedPillar, setSelectedPillar] = useState<string>(initialPillar);
  const [selectedProject, setSelectedProject] = useState<string>(initialProject);
  
  // Dedication & Anonymity
  const [isHonorGift, setIsHonorGift] = useState<boolean>(false);
  const [inHonorOf, setInHonorOf] = useState<string>('');
  const [honorMessage, setHonorMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  
  // Cover fee toggle
  const [coverFees, setCoverFees] = useState<boolean>(true);

  // Review Modal state
  const [showReviewStep, setShowReviewStep] = useState<boolean>(false);

  // Donor Contact form for tax receipt prefill
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');

  // Preset amount options with concrete tangible impact copy
  const presetAmounts = [
    { amount: 25, impact: '50 fresh, balanced meals for an after-school hub' },
    { amount: 50, impact: '1 full month of emergency pantry groceries for a family' },
    { amount: 100, impact: 'Emergency winter heating utility shutoff relief' },
    { amount: 250, impact: 'Stops a courthouse eviction and renews family lease' },
    { amount: 500, impact: 'Provides emergency bridge housing deposit & move-in essentials' },
  ];

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;

  // Fee calculation (standard 2.9% + $0.30)
  const feeAmount = coverFees && currentAmount > 0
    ? Number((currentAmount * siteConfig.donationFeeRate + siteConfig.donationFixedFee).toFixed(2))
    : 0;

  const totalAmount = currentAmount + feeAmount;

  // Impact Calculator dynamic outcomes
  const dynamicMeals = Math.max(0, Math.round(currentAmount * 2));
  const dynamicShelterNights = Math.max(0, Math.round(currentAmount / 40));
  const dynamicSchoolKits = Math.max(0, Math.round(currentAmount / 35));

  const handleSelectPreset = (amt: number) => {
    setSelectedAmount(amt);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
    setIsCustom(true);
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount < 5) {
      alert('Please select a minimum gift of $5.');
      return;
    }
    setShowReviewStep(true);
  };

  const handleConfirmAndRedirect = () => {
    // Generate donation URL
    const url = getDonationUrl({
      amount: totalAmount,
      frequency,
      pillarId: selectedPillar,
      projectId: selectedProject || undefined,
      inHonorOf: isHonorGift ? inHonorOf : undefined,
      isAnonymous,
      coverFees,
    });

    // In a live environment with an external donation portal:
    // window.location.href = url;
    // For in-app preview testing, we save to local storage and route directly to thank-you screen:
    const receiptNum = `ICA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const record = {
      id: `don-${Date.now()}`,
      donorName: isAnonymous ? 'Anonymous Donor' : (donorName || 'Generous Supporter'),
      donorEmail: donorEmail || 'donor@example.com',
      amountCents: Math.round(totalAmount * 100),
      currency: 'USD',
      frequency,
      pillarId: (selectedPillar as CausePillarId) || 'general',
      projectId: selectedProject,
      isAnonymous,
      inHonorOf: isHonorGift ? inHonorOf : undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      receiptNumber: receiptNum,
    };

    localStorage.setItem('ica_last_donation', JSON.stringify(record));
    navigate(`/donate/thank-you?amount=${totalAmount}&pillar=${selectedPillar}&receipt=${receiptNum}`);
  };

  return (
    <>
      <SEO
        title="Donate — Make a Tangible Difference"
        description="Every dollar is tracked with radical transparency. Give directly to food security, eviction defense, youth coding, or emergency relief."
      />

      <section className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Tax-Deductible 501(c)(3) Charitable Donation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2545] dark:text-white">
            Small Acts. Generational Change.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Choose where your gift goes. We maintain 88% direct program allocation and zero administrative padding.
          </p>
        </div>

        {/* Main Donation Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10 space-y-8">
          
          <form onSubmit={handleProceedToReview} className="space-y-8">
            
            {/* Step 1: Frequency Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Select Frequency
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                {(['monthly', 'once', 'annually'] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`py-3 rounded-xl font-bold text-xs sm:text-sm capitalize transition-all ${
                      frequency === freq
                        ? 'bg-white dark:bg-[#0B2545] text-[#0B2545] dark:text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {freq === 'monthly' ? '♥ Monthly Giving' : freq === 'once' ? 'One-Time' : 'Annually'}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Amount Selector with Outcomes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Choose Your Impact Tier
                </label>
                {frequency === 'monthly' && (
                  <span className="text-xs font-semibold text-[#13A89E] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Monthly donors create sustained stability</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {presetAmounts.map((preset) => {
                  const isSelected = !isCustom && selectedAmount === preset.amount;
                  return (
                    <button
                      key={preset.amount}
                      type="button"
                      onClick={() => handleSelectPreset(preset.amount)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#13A89E] ring-2 ring-[#13A89E] bg-teal-50/40 dark:bg-teal-950/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <span className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                        ${preset.amount}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-tight">
                        {preset.impact}
                      </p>
                    </button>
                  );
                })}

                {/* Custom Amount Box */}
                <div
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCustom
                      ? 'border-[#13A89E] ring-2 ring-[#13A89E] bg-teal-50/40 dark:bg-teal-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-500">Custom Amount</span>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      min="5"
                      step="1"
                      placeholder="Other"
                      value={customAmount}
                      onChange={(e) => handleCustomChange(e.target.value)}
                      onFocus={() => setIsCustom(true)}
                      className="w-full pl-7 pr-3 py-2 text-sm font-bold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Impact Calculator Visualization Bar */}
            {currentAmount > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B2545] dark:text-white">
                  <Sliders className="w-4 h-4 text-[#13A89E]" />
                  <span>Real-Time Impact Calculator</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl">
                    <p className="font-serif text-lg font-bold text-[#13A89E]">{dynamicMeals}</p>
                    <p className="text-[10px] text-slate-500">Nutritious Meals</p>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl">
                    <p className="font-serif text-lg font-bold text-blue-600">{dynamicShelterNights}</p>
                    <p className="text-[10px] text-slate-500">Nights Shelter</p>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl">
                    <p className="font-serif text-lg font-bold text-purple-600">{dynamicSchoolKits}</p>
                    <p className="text-[10px] text-slate-500">Student Kits</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Designation / Pillar / Project Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Direct Your Gift
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <select
                    value={selectedPillar}
                    onChange={(e) => {
                      setSelectedPillar(e.target.value);
                      setSelectedProject('');
                    }}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
                  >
                    <option value="general">★ Where Needed Most (Emergency Reserve)</option>
                    {DEMO_PILLARS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} Pillar
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
                  >
                    <option value="">All Initiatives in this Pillar</option>
                    {DEMO_PROJECTS.filter((proj) => selectedPillar === 'general' || proj.pillarId === selectedPillar).map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        Specific Project: {proj.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dedication & Tribute (In Honor / Memorial) */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isHonorGift}
                    onChange={(e) => setIsHonorGift(e.target.checked)}
                    className="rounded text-[#13A89E] focus:ring-[#13A89E]"
                  />
                  <Gift className="w-4 h-4 text-amber-500" />
                  <span>Dedicate this gift in honor or memory of someone</span>
                </label>
              </div>

              {isHonorGift && (
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-3 animate-in fade-in duration-200">
                  <input
                    type="text"
                    placeholder="Honoree Name (e.g. Grandma Rose, Sister Mary)"
                    value={inHonorOf}
                    onChange={(e) => setInHonorOf(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="text"
                    placeholder="Optional tribute note or message"
                    value={honorMessage}
                    onChange={(e) => setHonorMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              )}
            </div>

            {/* Anonymous Gift Option */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-[#13A89E] focus:ring-[#13A89E]"
                />
                <EyeOff className="w-3.5 h-3.5" />
                <span>Keep this gift anonymous on the public activity ticker</span>
              </label>
            </div>

            {/* Cover the Processing Fees Checkbox */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3">
              <input
                type="checkbox"
                id="coverFees"
                checked={coverFees}
                onChange={(e) => setCoverFees(e.target.checked)}
                className="rounded text-[#13A89E] focus:ring-[#13A89E] mt-0.5"
              />
              <label htmlFor="coverFees" className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed cursor-pointer flex-1">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Cover the 2.9% + $0.30 processing fee (+${feeAmount.toFixed(2)})
                </span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Allows 100% of your ${currentAmount} to go directly to community relief.
                </span>
              </label>
            </div>

            {/* Donor Contact info for official IRS Tax receipt */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                4. Donor Information for Official Tax Receipt
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Legal Name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
                />
                <input
                  type="email"
                  required
                  placeholder="Receipt Email Address"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
                />
              </div>
            </div>

            {/* Total Summary & Review Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left w-full sm:w-auto">
                <span className="text-xs text-slate-500 block">Total Tax-Deductible Contribution:</span>
                <span className="font-serif text-3xl font-bold text-[#0B2545] dark:text-white">
                  {formatCurrency(totalAmount * 100, true)}
                </span>
                <span className="text-xs text-slate-400 capitalize block">
                  {frequency === 'once' ? 'One-time gift' : `${frequency} recurring gift`}
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-amber-400 to-[#13A89E] hover:from-amber-300 hover:to-teal-400 text-[#0B2545] shadow-xl flex items-center justify-center gap-2 transition-transform transform active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>Review & Secure Gift</span>
              </button>
            </div>

          </form>

        </div>

        {/* Security & Disclaimer Notice */}
        <div className="mt-8 text-center text-xs text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit Bank-Grade Encryption · No payment credentials stored on this server</span>
          </p>
          <p>
            {siteConfig.settings.legalName} is an exempt 501(c)(3) organization. EIN: {siteConfig.settings.ein}.
          </p>
        </div>

      </section>

      {/* Review Modal Step */}
      {showReviewStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#13A89E]" />
                <h3 className="font-serif text-xl font-bold text-[#0B2545] dark:text-white">
                  Confirm Your Gift
                </h3>
              </div>
              <button
                onClick={() => setShowReviewStep(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Back to Edit
              </button>
            </div>

            {/* Gift Itemized Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Designation:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedPillar === 'general' ? 'Where Needed Most Fund' : `${selectedPillar.toUpperCase()} Pillar`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Frequency:</span>
                <span className="font-bold capitalize text-slate-900 dark:text-white">
                  {frequency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Base Donation:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(currentAmount * 100, true)}
                </span>
              </div>
              {coverFees && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Processing Fee Covered:</span>
                  <span className="font-bold text-emerald-600">
                    +{formatCurrency(feeAmount * 100, true)}
                  </span>
                </div>
              )}
              {isHonorGift && (
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                  <span className="text-slate-500">In Honor Of:</span>
                  <span className="font-bold text-amber-600">{inHonorOf}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-sm">
                <span className="font-bold text-slate-900 dark:text-white">Total Charge:</span>
                <span className="font-serif font-bold text-base text-[#13A89E]">
                  {formatCurrency(totalAmount * 100, true)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Clicking below will complete your tax-deductible gift through our verified secure donation adapter. An official IRS tax receipt PDF will be generated immediately.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewStep(false)}
                className="w-1/3 py-3 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmAndRedirect}
                className="w-2/3 py-3 rounded-xl font-bold text-xs bg-[#0B2545] hover:bg-[#13A89E] text-white shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Complete Secure Donation</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
