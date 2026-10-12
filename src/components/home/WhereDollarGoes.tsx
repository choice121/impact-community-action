import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck, CheckCircle2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExpenseSlice {
  name: string;
  value: number;
  color: string;
  description: string;
}

const data: ExpenseSlice[] = [
  {
    name: 'Direct Community Programs',
    value: 88,
    color: '#13A89E', // Teal
    description: 'Food distribution, emergency rent relief, youth tech labs, ramp building, and crisis response.',
  },
  {
    name: 'Management & Governance',
    value: 7,
    color: '#0B2545', // Navy
    description: 'Third-party accounting, independent audits, compliance, legal counsel, and technical infrastructure.',
  },
  {
    name: 'Fundraising & Donor Care',
    value: 5,
    color: '#F4A340', // Amber
    description: 'Donor relations, tax receipting operations, and ethical community outreach.',
  },
];

export const WhereDollarGoes: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Context & Breakdown Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Independent 2025 Financial Audit Completed</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B2545] dark:text-white">
              Where Every Dollar Goes
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Charity Navigator and the Better Business Bureau consider 70%+ programmatic efficiency standard for nonprofits. At Impact Community Action, <strong>88 cents of every dollar</strong> goes straight into local community hands.
            </p>

            {/* Breakdown List */}
            <div className="space-y-4 pt-2">
              {data.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div
                    className="w-4 h-4 rounded-md shrink-0 mt-1"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {item.name}
                      </span>
                      <span className="font-serif font-bold text-base text-slate-900 dark:text-white">
                        {item.value}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/transparency"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0B2545] hover:bg-[#13A89E] transition-colors inline-flex items-center gap-2"
              >
                <span>Full Transparency Portal</span>
              </Link>
              <a
                href="#form990"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Form 990 PDF will download from verified Supabase edge storage.");
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Form 990 (PDF)</span>
              </a>
            </div>

            {/* Accessible screen-reader table fallback */}
            <div className="sr-only">
              <table>
                <caption>2025 Expense Breakdown</caption>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, i) => (
                    <tr key={i}>
                      <td>{d.name}</td>
                      <td>{d.value}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Right Column: Recharts Donut & Center Metric */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full h-72 sm:h-80 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Allocation']}
                    contentStyle={{
                      backgroundColor: '#0B2545',
                      color: '#fff',
                      borderRadius: '0.75rem',
                      border: 'none',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Central Badge inside Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-serif text-4xl font-bold text-[#0B2545] dark:text-white">
                  88%
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#13A89E]">
                  Programmatic
                </span>
              </div>
            </div>

            <p className="text-xs text-center text-slate-400 mt-2">
              Based on audited Form 990 financial reporting. Zero dark patterns.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
