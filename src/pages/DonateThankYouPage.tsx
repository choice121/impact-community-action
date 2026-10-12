import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Heart,
  Download,
  Share2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  Copy,
  Sparkles,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { RippleAnimation } from '../components/common/RippleAnimation';
import { generateDonationReceipt } from '../lib/receiptGenerator';
import { DonationRecord } from '../types';
import { formatCurrency, formatDate } from '../lib/format';
import { siteConfig } from '../config/siteConfig';
import { supabase } from '../lib/supabase';

export const DonateThankYouPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const amountParam = Number(searchParams.get('amount')) || 50;
  const pillarParam = searchParams.get('pillar') || 'general';
  const receiptParam = searchParams.get('receipt') || `ICA-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const [copied, setCopied] = useState(false);
  const [donationRecord, setDonationRecord] = useState<DonationRecord | null>(null);

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#13A89E', '#0B2545', '#F4A340', '#4C7A4F'],
      });
    } catch {
      // ignore
    }

    // Retrieve last donation from storage if available
    const saved = localStorage.getItem('ica_last_donation');
    if (saved) {
      try {
        const record = JSON.parse(saved);
        setDonationRecord(record);

        // Record confirmed donation into Supabase (activates live database triggers)
        if (!record._syncedToDb) {
          supabase.from('donations').insert([{
            donor_name: record.donorName || 'Generous Supporter',
            donor_email: record.donorEmail || 'supporter@example.com',
            amount_cents: record.amountCents,
            currency: 'USD',
            frequency: record.frequency || 'once',
            pillar_id: record.pillarId || 'general',
            is_anonymous: Boolean(record.isAnonymous),
            in_honor_of: record.inHonorOf || null,
            status: 'confirmed',
            source: 'web',
            receipt_number: record.receiptNumber,
          }]).then(({ error }) => {
            if (!error) {
              record._syncedToDb = true;
              localStorage.setItem('ica_last_donation', JSON.stringify(record));
            }
          });
        }
        return;
      } catch {
        // ignore
      }
    }

    // Fallback record
    setDonationRecord({
      id: `rec-${Date.now()}`,
      donorName: 'Generous Supporter',
      donorEmail: 'donor@example.com',
      amountCents: Math.round(amountParam * 100),
      currency: 'USD',
      frequency: 'once',
      pillarId: pillarParam as any,
      isAnonymous: false,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      receiptNumber: receiptParam,
    });
  }, [amountParam, pillarParam, receiptParam]);

  const handleDownloadReceipt = () => {
    if (!donationRecord) return;
    generateDonationReceipt(donationRecord);
  };

  const handleShare = () => {
    const text = `I just supported community relief and housing stability through Impact Community Action! Join me in creating tangible change: ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({ title: 'Impact Community Action', text, url: window.location.origin }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const amountCents = donationRecord ? donationRecord.amountCents : Math.round(amountParam * 100);

  return (
    <>
      <SEO
        title="Thank You for Your Generosity"
        description="Your gift is already expanding outwards into warm beds, groceries, and educational kits."
      />

      <div className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
        
        {/* Celebration Header */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[#13A89E] block">
            Donation Successfully Confirmed
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B2545] dark:text-white">
            Thank You for Empowering Neighbors
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Your generous gift of <strong>{formatCurrency(amountCents)}</strong> is now active in our field fund. See how your single act ripples into tangible outcomes below:
          </p>
        </div>

        {/* Signature Interactive Concentric Ripple Animation */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-8 shadow-sm">
          <RippleAnimation
            amountCents={amountCents}
            pillarId={pillarParam}
          />
        </div>

        {/* Tax Receipt Card & Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-lg max-w-2xl mx-auto space-y-6 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0B2545] dark:text-white">
                Official Tax Receipt
              </h3>
              <p className="text-xs text-slate-500">
                Receipt #{donationRecord?.receiptNumber || receiptParam} · {formatDate(donationRecord?.createdAt || new Date().toISOString())}
              </p>
            </div>
            <div className="p-2 bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Organization</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{siteConfig.settings.legalName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Federal EIN</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{siteConfig.settings.ein}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Amount Deductible</span>
              <span className="font-bold text-[#13A89E] text-sm">{formatCurrency(amountCents, true)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Designation</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{pillarParam} Pillar</span>
            </div>
          </div>

          {/* Download jsPDF Receipt Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Tax Receipt</span>
            </button>

            <button
              onClick={handleShare}
              className="py-3 px-5 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share Impact</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Next Steps / Portal Teaser */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/stories"
            className="text-xs font-bold text-[#13A89E] hover:underline flex items-center gap-1"
          >
            <span>Read how other donors made an impact</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-slate-400 hidden sm:inline">·</span>
          <Link
            to="/portal"
            className="text-xs font-bold text-[#0B2545] dark:text-slate-200 hover:underline"
          >
            Go to Donor Portal & History
          </Link>
        </div>

      </div>
    </>
  );
};
