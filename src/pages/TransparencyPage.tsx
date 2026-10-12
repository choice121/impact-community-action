import React from 'react';
import { ShieldCheck, Award, FileText, CheckCircle2, Download, Users, Lock, HeartHandshake } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { WhereDollarGoes } from '../components/home/WhereDollarGoes';
import { siteConfig } from '../config/siteConfig';

export const TransparencyPage: React.FC = () => {
  const { settings } = siteConfig;

  const leadership = [
    { name: 'Dr. Marcus Holloway', role: 'Executive Director & Co-Founder', bio: 'Former community health director with 18 years advancing housing and nutrition networks.' },
    { name: 'Elena Ramos-Chen, CPA', role: 'Chief Financial Officer', bio: 'Former senior auditor at Deloitte, specializing in 501(c)(3) tax governance and compliance.' },
    { name: 'Alicia Jenkins', role: 'Director of Programs & Field Operations', bio: 'Grassroots organizer who built our 24-hour court eviction defense response protocol.' },
    { name: 'David Washington', role: 'Director of Volunteer Mobilization', bio: 'Oversees 3,400+ active volunteer corps across five regional logistics hubs.' },
  ];

  const board = [
    { name: 'Judge Evelyn Vance (Ret.)', role: 'Board Chair', affiliation: 'Franklin County Municipal Court' },
    { name: 'Carlos Mendez, MD', role: 'Vice Chair', affiliation: 'Midwest Regional Health Institute' },
    { name: 'Sarah Sterling, Esq.', role: 'Treasurer & Legal Counsel', affiliation: 'Sterling & Partners LLP' },
    { name: 'Pastor Anthony Wright', role: 'Secretary & Community Liaison', affiliation: 'Grace Community Fellowship' },
  ];

  const ratings = [
    { title: 'Charity Navigator', badge: '★★★★ 4-Star (100%)', desc: 'Highest possible rating for financial health, accountability, and transparency.' },
    { title: 'Candid / GuideStar', badge: 'Platinum Seal of Transparency', desc: 'Highest level of recognition, publishing all audited financials and public metrics.' },
    { title: 'Better Business Bureau', badge: 'BBB Accredited Charity', desc: 'Meets all 20 Standards for Charity Accountability without exception.' },
  ];

  return (
    <>
      <SEO
        title="Financial Transparency & Governance"
        description="Review Impact Community Action's financial allocations, IRS Form 990 filings, board governance, and charity watchdog ratings."
      />

      {/* Header Banner */}
      <section className="bg-[#0B2545] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Open Books & Radical Accountability
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Transparency & Stewardship
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              We operate under the principle that public charity belongs to the public. Every dollar received is tracked, audited independently, and published for all to inspect.
            </p>
          </div>
        </div>
      </section>

      {/* Fund Flow Lifecycle Snapshot */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
              <span className="text-xs font-bold uppercase text-teal-700 dark:text-teal-300">1. Total Raised (2025)</span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white mt-1">$2,435,000</p>
              <p className="text-[11px] text-slate-500 mt-1">From 4,810 individual donors & foundations</p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <span className="text-xs font-bold uppercase text-blue-700 dark:text-blue-300">2. Program Allocated</span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white mt-1">$2,142,800</p>
              <p className="text-[11px] text-slate-500 mt-1">88% directly committed to the 7 pillars</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">3. Admin & Governance</span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white mt-1">$170,450</p>
              <p className="text-[11px] text-slate-500 mt-1">7% for audits, insurance, and legal oversight</p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="text-xs font-bold uppercase text-amber-700 dark:text-amber-300">4. Fundraising & Care</span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white mt-1">$121,750</p>
              <p className="text-[11px] text-slate-500 mt-1">5% for ethical outreach & receipting operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* "Where Every Dollar Goes" Interactive Breakdown */}
      <WhereDollarGoes />

      {/* Watchdog Ratings & Certifications */}
      <section id="ratings" className="py-16 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#13A89E]">
              External Verification
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white mt-1">
              Top Charity Watchdog Ratings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Our books, governance guidelines, and fundraising ratios undergo rigorous independent external scrutiny.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ratings.map((r, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-center flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-[#13A89E] flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {r.title}
                  </h3>
                  <div className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {r.badge}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  Verified Active Accreditation · 2026
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Independent Board of Directors */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#13A89E]">
            Executive Governance
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white mt-1">
            Leadership & Independent Board
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Our board members serve without financial compensation, ensuring fiduciary focus solely on the public mission.
          </p>
        </div>

        {/* Executive Staff */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">
            Executive Leadership Team
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((member, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {member.name}
                </div>
                <div className="text-xs text-[#13A89E] font-medium">
                  {member.role}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Independent Board */}
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">
            Independent Board of Trustees (Uncompensated)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {board.map((member, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1"
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  {member.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {member.role}
                </div>
                <div className="text-[11px] text-teal-600 dark:text-teal-400 font-medium pt-1">
                  {member.affiliation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Policies */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#0B2545] dark:text-white">
            Ethical Governance Policies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
            <div className="space-y-1">
              <strong className="text-slate-900 dark:text-white block">Conflict of Interest Policy:</strong>
              Annual disclosure required for all staff and trustees; prohibits transactions with affiliated businesses.
            </div>
            <div className="space-y-1">
              <strong className="text-slate-900 dark:text-white block">Whistleblower Protection:</strong>
              Confidential third-party hotline with guaranteed zero retaliation for reported ethical or financial concerns.
            </div>
            <div className="space-y-1">
              <strong className="text-slate-900 dark:text-white block">Document Retention:</strong>
              Strict 7-year storage compliance for all financial vouchers, bank records, and IRS correspondences.
            </div>
          </div>
        </div>

      </section>
    </>
  );
};
