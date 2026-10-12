import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Download, FileText, CheckCircle2, TrendingUp, Users, DollarSign, Award } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { DEMO_PILLARS, DEMO_FINANCIALS } from '../demo/demoData';
import { formatCurrency, formatNumber } from '../lib/format';
import { ProjectMap } from '../components/home/ProjectMap';

const pillarComparisonData = DEMO_PILLARS.map((p) => ({
  name: p.name.split('&')[0].trim(),
  raised: p.raisedCents / 100,
  goal: p.goalCents / 100,
}));

const outcomeEfficiencyData = [
  { outcome: 'Food Box (6wks)', cost: 45, benchmark: 90 },
  { outcome: 'Eviction Prevention', cost: 380, benchmark: 2200 },
  { outcome: 'Youth STEM Seat', cost: 120, benchmark: 350 },
  { outcome: 'Veteran Home Ramp', cost: 420, benchmark: 3500 },
  { outcome: 'Emergency Aid Unit', cost: 110, benchmark: 250 },
];

export const ImpactPage: React.FC = () => {
  const reports = [
    { title: '2025 Annual Community Impact Report', size: '4.2 MB', pages: '36 pages', year: '2025' },
    { title: '2025 Third-Party Independent Financial Audit', size: '2.8 MB', pages: '24 pages', year: '2025' },
    { title: '2024 Retrospective & Outcome Longitudinal Study', size: '5.1 MB', pages: '48 pages', year: '2024' },
    { title: 'Community Housing Eviction Prevention Assessment', size: '1.9 MB', pages: '18 pages', year: '2024' },
  ];

  return (
    <>
      <SEO
        title="Impact Report & Metrics"
        description="Explore the tangible results, cost-per-outcome efficiencies, and annual community reports of Impact Community Action."
      />

      {/* Hero Header */}
      <section className="bg-[#0B2545] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Verified Outcomes
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              2025 Annual Impact & Efficiency Report
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              We measure success not by dollars received, but by evictions halted, meals distributed, and students equipped. Here is our rigorous annual account.
            </p>
          </div>
        </div>
      </section>

      {/* Top High-Level Headline KPIs */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <Users className="w-5 h-5 text-[#13A89E] mb-2" />
              <p className="font-serif text-3xl font-bold text-[#0B2545] dark:text-white">
                {formatNumber(DEMO_FINANCIALS.livesImpacted)}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Individuals Directly Served</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <DollarSign className="w-5 h-5 text-emerald-600 mb-2" />
              <p className="font-serif text-3xl font-bold text-[#0B2545] dark:text-white">
                ${DEMO_FINANCIALS.costPerOutcomeAverage}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Average Cost per Life Transformed</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <TrendingUp className="w-5 h-5 text-amber-500 mb-2" />
              <p className="font-serif text-3xl font-bold text-[#0B2545] dark:text-white">
                88%
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Direct Programmatic Allocation</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <Award className="w-5 h-5 text-purple-600 mb-2" />
              <p className="font-serif text-3xl font-bold text-[#0B2545] dark:text-white">
                4-Star
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Charity Navigator Score (100/100)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chart 1: Funding vs Goal by Pillar */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#13A89E]">
            Financial Deployment
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white mt-1">
            Raised vs. Goal Across 7 Cause Pillars
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking community funding targets across active campaigns
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pillarComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [formatCurrency(Number(val) * 100), '']}
                  contentStyle={{
                    backgroundColor: '#0B2545',
                    color: '#fff',
                    borderRadius: '0.75rem',
                    border: 'none',
                  }}
                />
                <Legend />
                <Bar dataKey="raised" fill="#13A89E" name="Raised ($)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="goal" fill="#0B2545" name="Budget Goal ($)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Chart 2: Cost-per-Outcome Efficiency Comparison */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#13A89E]">
              Efficiency Benchmarks
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white mt-1">
              ICA Unit Cost vs. Institutional Benchmark
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Why grassroots prevention saves taxpayers and donors thousands per family
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {outcomeEfficiencyData.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  {item.outcome}
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-slate-400">ICA Direct Cost:</div>
                  <div className="font-serif text-2xl font-bold text-[#13A89E]">
                    ${item.cost}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  Gov / Agency avg: <span className="line-through">${item.benchmark}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Embedded Field Operations Map */}
      <ProjectMap />

      {/* Downloadable Reports Repository */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#13A89E]">
            Primary Documents
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] dark:text-white mt-1">
            Download Official Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Unredacted financial audits, outcome assessments, and governance publications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reports.map((rep, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm hover:border-[#13A89E] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {rep.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {rep.year} Edition · {rep.pages} · {rep.size} · PDF
                  </p>
                </div>
              </div>

              <button
                onClick={() => alert(`Starting download of ${rep.title} (PDF)...`)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0B2545] hover:text-white transition-colors text-slate-700 dark:text-slate-300 shrink-0 ml-2"
                aria-label={`Download ${rep.title}`}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
