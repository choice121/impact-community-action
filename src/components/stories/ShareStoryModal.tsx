import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, Upload, Heart } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { CausePillarId } from '../../types';

interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareStoryModal: React.FC<ShareStoryModalProps> = ({ isOpen, onClose }) => {
  const [pillarId, setPillarId] = useState<CausePillarId>('hunger');
  const [firstName, setFirstName] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [storyText, setStoryText] = useState('');
  const [firstNameOnly, setFirstNameOnly] = useState(true);
  const [consentGranted, setConsentGranted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGranted) {
      alert('Please check the consent authorization box.');
      return;
    }

    setIsSubmitting(true);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('story_submissions').insert([
          {
            pillar_id: pillarId,
            author_name: firstName,
            location_city: locationCity,
            story_body: storyText,
            first_name_only: firstNameOnly,
            consent_granted: true,
            status: 'pending_review',
          },
        ]);
      } catch (err) {
        console.error('Submission error', err);
      }
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              Share Your Community Journey
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
              Thank You for Sharing
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your story has been received by our community ethics team. We review every submission with strict privacy care before publishing to our gallery.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0B2545] text-white hover:bg-[#13A89E] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
            
            {/* Cause pillar */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Which Cause Pillar applies?
              </label>
              <select
                value={pillarId}
                onChange={(e) => setPillarId(e.target.value as CausePillarId)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
              >
                <option value="hunger">Hunger & Nutrition</option>
                <option value="housing">Housing & Homelessness</option>
                <option value="health">Health & Wellness</option>
                <option value="education">Education & Youth</option>
                <option value="families">Families & Economic Opportunity</option>
                <option value="disaster">Disaster Relief</option>
                <option value="seniors">Seniors & Veterans</option>
              </select>
            </div>

            {/* Name & City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City & State
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Columbus, OH"
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Story Body */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                How did this support change your family's circumstances?
              </label>
              <textarea
                required
                rows={4}
                placeholder="Share your personal experience in your own words..."
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
              />
            </div>

            {/* Privacy Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={firstNameOnly}
                  onChange={(e) => setFirstNameOnly(e.target.checked)}
                  className="rounded text-[#13A89E] focus:ring-[#13A89E]"
                />
                <span className="text-slate-600 dark:text-slate-400">
                  Protect identity: Display first name and last initial only
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentGranted}
                  onChange={(e) => setConsentGranted(e.target.checked)}
                  className="rounded text-[#13A89E] focus:ring-[#13A89E] mt-0.5"
                />
                <span className="text-slate-600 dark:text-slate-400">
                  <strong>Consent Authorization:</strong> I grant Impact Community Action permission to publish my story to encourage community donors. I understand I may revoke consent anytime.
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-bold bg-[#0B2545] hover:bg-[#13A89E] text-white transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Story for Review'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
