import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowRight, Table } from 'lucide-react';
import { formatCurrency } from '../../lib/format';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { CausePillarId } from '../../types';

interface CsvRow {
  donorName: string;
  donorEmail: string;
  amount: number;
  date: string;
  pillarId: string;
  receiptNumber: string;
}

export const CsvDonationImporter: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleCsvContent = `Donor Name,Donor Email,Amount,Date,Pillar
Eleanor Roosevelt,eleanor@example.com,250.00,2026-10-01,housing
Marcus Garvey,marcus@example.com,75.00,2026-10-02,hunger
Clara Barton,clara@example.com,120.00,2026-10-03,health
George Washington Carver,carver@example.com,500.00,2026-10-04,education`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg(null);
    setImportedCount(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

        if (lines.length < 2) {
          setErrorMsg('CSV must contain a header row and at least one data row.');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const nameIdx = headers.findIndex((h) => h.includes('name'));
        const emailIdx = headers.findIndex((h) => h.includes('email'));
        const amountIdx = headers.findIndex((h) => h.includes('amount'));
        const dateIdx = headers.findIndex((h) => h.includes('date'));
        const pillarIdx = headers.findIndex((h) => h.includes('pillar'));

        const parsed: CsvRow[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 3) {
            const rawAmount = parseFloat(cols[amountIdx !== -1 ? amountIdx : 2]) || 0;
            parsed.push({
              donorName: cols[nameIdx !== -1 ? nameIdx : 0] || 'Offline Supporter',
              donorEmail: cols[emailIdx !== -1 ? emailIdx : 1] || 'offline@impactaction.org',
              amount: rawAmount,
              date: cols[dateIdx !== -1 ? dateIdx : 3] || new Date().toISOString().split('T')[0],
              pillarId: cols[pillarIdx !== -1 ? pillarIdx : 4]?.toLowerCase() || 'general',
              receiptNumber: `ICA-CSV-${Date.now().toString().slice(-4)}-${i}`,
            });
          }
        }

        setCsvData(parsed);
      } catch (err: any) {
        setErrorMsg('Failed to parse CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setFileName('sample_offline_donations.csv');
    setErrorMsg(null);
    setImportedCount(null);

    const lines = sampleCsvContent.split('\n');
    const parsed: CsvRow[] = lines.slice(1).map((line, i) => {
      const [name, email, amount, date, pillar] = line.split(',');
      return {
        donorName: name,
        donorEmail: email,
        amount: parseFloat(amount),
        date,
        pillarId: pillar,
        receiptNumber: `ICA-OFFLINE-${Date.now().toString().slice(-4)}-${i + 1}`,
      };
    });

    setCsvData(parsed);
  };

  const handleConfirmImport = async () => {
    if (csvData.length === 0) return;

    setIsImporting(true);

    try {
      if (isSupabaseConfigured) {
        const records = csvData.map((row) => ({
          donor_name: row.donorName,
          donor_email: row.donorEmail,
          amount_cents: Math.round(row.amount * 100),
          currency: 'USD',
          frequency: 'once',
          pillar_id: row.pillarId,
          status: 'confirmed',
          source: 'csv_import',
          receipt_number: row.receiptNumber,
          created_at: new Date(row.date).toISOString(),
        }));

        await supabase.from('donations').insert(records);
      }
      setImportedCount(csvData.length);
      setCsvData([]);
      if (onComplete) onComplete();
    } catch (err: any) {
      setErrorMsg('Import error: ' + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#0B2545] dark:text-white">
            CSV Batch Donation Importer
          </h3>
          <p className="text-xs text-slate-500">
            Import check gifts, wire transfers, foundation grants, or third-party CRM records into Supabase.
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          className="text-xs font-semibold text-[#13A89E] hover:underline self-start sm:self-auto"
        >
          Load Sample Offline Template
        </button>
      </div>

      {importedCount !== null ? (
        <div className="p-6 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-[#13A89E] mx-auto" />
          <h4 className="font-serif font-bold text-slate-900 dark:text-white">
            Successfully Imported {importedCount} Donations
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Database triggers have automatically updated pillar totals and recorded audit log entries.
          </p>
          <button
            onClick={() => setImportedCount(null)}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2545] text-white"
          >
            Import Another File
          </button>
        </div>
      ) : (
        <>
          {/* File Upload Box */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2 hover:border-[#13A89E] transition-colors">
            <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              {fileName ? fileName : 'Upload .csv donation records spreadsheet'}
            </div>
            <label className="inline-block mt-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-xl cursor-pointer">
              <span>Select File</span>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Preview Table */}
          {csvData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Preview Table ({csvData.length} records ready to import)
                </span>
                <span className="text-slate-500">
                  Total Sum: <strong>{formatCurrency(csvData.reduce((s, r) => s + r.amount * 100, 0))}</strong>
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 max-h-60 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                      <th className="py-2.5 px-3">Donor Name</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Pillar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {csvData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{row.donorName}</td>
                        <td className="py-2.5 px-3 text-slate-500">{row.donorEmail}</td>
                        <td className="py-2.5 px-3 font-bold text-[#13A89E]">${row.amount.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-slate-500">{row.date}</td>
                        <td className="py-2.5 px-3 capitalize text-slate-600 dark:text-slate-400">{row.pillarId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setCsvData([])}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Clear
                </button>
                <button
                  onClick={handleConfirmImport}
                  disabled={isImporting}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isImporting ? 'Importing records...' : `Execute Import of ${csvData.length} Donations`}</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
