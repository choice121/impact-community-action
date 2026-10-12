import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Heart, ArrowRight } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useLiveContent } from '../hooks/useLiveContent';
import { CausePillarId, Project } from '../types';
import { IKImage } from '../components/common/IKImage';
import { formatCurrency } from '../lib/format';

export const ProjectsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const { projects, pillars } = useLiveContent();

  const availableStates = Array.from(new Set(projects.map((p) => p.state))).sort();

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const matchesSearch =
        proj.title.toLowerCase().includes(search.toLowerCase()) ||
        proj.summary.toLowerCase().includes(search.toLowerCase()) ||
        proj.city.toLowerCase().includes(search.toLowerCase());

      const matchesPillar = selectedPillar === 'all' || proj.pillarId === selectedPillar;
      const matchesState = selectedState === 'all' || proj.state === selectedState;
      const matchesStatus = selectedStatus === 'all' || proj.status === selectedStatus;

      return matchesSearch && matchesPillar && matchesState && matchesStatus;
    });
  }, [search, selectedPillar, selectedState, selectedStatus, projects]);

  return (
    <>
      <SEO
        title="Community Projects"
        description="Browse and fund direct grassroots initiatives across food security, eviction defense, youth coding, and veteran housing."
      />

      {/* Header Banner */}
      <section className="bg-[#0B2545] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Grassroots Action
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Community Projects Ready for Funding
            </h1>
            <p className="text-slate-200 text-sm sm:text-base">
              Every project is locally planned with a concrete budget, transparent milestones, and zero administrative bloat.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search projects or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
              />
            </div>

            {/* Pillar Filter */}
            <div>
              <select
                value={selectedPillar}
                onChange={(e) => setSelectedPillar(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
              >
                <option value="all">All Cause Pillars</option>
                {pillars.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
              >
                <option value="all">All US States</option>
                {availableStates.map((st) => (
                  <option key={st} value={st}>
                    State: {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13A89E]"
              >
                <option value="all">All Project Statuses</option>
                <option value="active">Active Fundraising</option>
                <option value="fully-funded">Fully Funded</option>
                <option value="completed">Completed in Field</option>
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const pillar = pillars.find((p) => p.id === project.pillarId);
              const percent = Math.min(100, Math.round((project.raisedCents / project.goalCents) * 100));

              return (
                <div
                  key={project.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative">
                      <IKImage
                        path={project.coverImage}
                        alt={project.title}
                        aspectRatio="16/9"
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow"
                          style={{ backgroundColor: pillar ? pillar.accentColor : '#13A89E' }}
                        >
                          {pillar?.name}
                        </span>
                        {project.status === 'fully-funded' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow">
                            Fully Funded
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-[#13A89E]" />
                        <span>
                          {project.city}, {project.state}
                        </span>
                        <span>·</span>
                        <span>{project.donorsCount} supporters</span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#13A89E] transition-colors leading-snug">
                        {project.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        {project.summary}
                      </p>
                    </div>
                  </div>

                  {/* Thermometer & Action */}
                  <div className="p-6 pt-0 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(project.raisedCents)}
                        </span>
                        <span className="text-slate-500">
                          {percent}% of {formatCurrency(project.goalCents)}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: pillar ? pillar.accentColor : '#13A89E',
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/projects/${project.slug}`}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold text-center bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                      >
                        Details
                      </Link>
                      <Link
                        to={`/donate?project=${project.id}&pillar=${project.pillarId}`}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold text-center bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center justify-center gap-1 shadow-sm transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Fund Now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Filter className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-200">
              No matching projects found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to see active projects.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedPillar('all');
                setSelectedState('all');
                setSelectedStatus('all');
              }}
              className="mt-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </>
  );
};
