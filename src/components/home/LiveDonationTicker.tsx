import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Clock } from 'lucide-react';
import { DEMO_PUBLIC_ACTIVITY } from '../../demo/demoData';
import { PublicActivityItem } from '../../types';
import { formatCurrency, formatRelativeTime } from '../../lib/format';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export const LiveDonationTicker: React.FC = () => {
  const [items, setItems] = useState<PublicActivityItem[]>(DEMO_PUBLIC_ACTIVITY);

  // Subscribe to real Supabase public_activity if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Fetch initial activity
    supabase
      .from('public_activity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const mapped: PublicActivityItem[] = data.map((d) => ({
            id: d.id,
            donorName: d.donor_name || 'Anonymous Donor',
            amountCents: d.amount_cents,
            pillarId: d.pillar_id || 'general',
            pillarName: d.pillar_name || 'Where Needed Most',
            projectTitle: d.project_title,
            timestamp: d.created_at,
            frequency: d.frequency || 'once',
            inHonorOf: d.in_honor_of,
          }));
          setItems(mapped);
        }
      });

    // Realtime channel
    const channel = supabase
      .channel('public_activity_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'public_activity' },
        (payload) => {
          const newDoc = payload.new;
          const newItem: PublicActivityItem = {
            id: newDoc.id,
            donorName: newDoc.donor_name || 'Anonymous Donor',
            amountCents: newDoc.amount_cents,
            pillarId: newDoc.pillar_id || 'general',
            pillarName: newDoc.pillar_name || 'Where Needed Most',
            projectTitle: newDoc.project_title,
            timestamp: newDoc.created_at || new Date().toISOString(),
            frequency: newDoc.frequency || 'once',
            inHonorOf: newDoc.in_honor_of,
          };
          setItems((prev) => [newItem, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-[#FAF7F2] dark:bg-slate-950 py-6 border-b border-slate-200/60 dark:border-slate-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#13A89E]"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Live Community Activity
            </span>
          </div>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="text-xs text-slate-500">
            Real gifts empowering neighbors right now across Ohio & Appalachia
          </span>
        </div>

        {/* Horizontal ticker ribbon */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="shrink-0 flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm text-xs hover:border-[#13A89E] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] flex items-center justify-center shrink-0">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
                  <span>{item.donorName}</span>
                  <span className="font-bold text-[#13A89E]">
                    {formatCurrency(item.amountCents)}
                  </span>
                  {item.frequency !== 'once' && (
                    <span className="text-[10px] uppercase font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded">
                      {item.frequency}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[150px]">{item.pillarName}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
