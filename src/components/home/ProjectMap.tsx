import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { MapPin, ExternalLink, Heart } from 'lucide-react';
import { DEMO_PROJECTS, DEMO_PILLARS } from '../../demo/demoData';
import { Project } from '../../types';
import { formatCurrency } from '../../lib/format';

export const ProjectMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(DEMO_PROJECTS[0]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    // Center on eastern US region where projects are active
    const map = L.map(mapContainerRef.current, {
      center: [39.8, -82.5],
      zoom: 6,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Add markers for all projects
    DEMO_PROJECTS.forEach((proj) => {
      const pillar = DEMO_PILLARS.find((p) => p.id === proj.pillarId);
      const color = pillar ? pillar.accentColor : '#13A89E';

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([proj.lat, proj.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedProject(proj);
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#13A89E]">
            Field Operations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B2545] dark:text-white mt-1">
            Where Your Support Is Active
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
            Click any pin on the map to see real ongoing initiatives in Ohio, West Virginia, Pennsylvania, Louisiana, and Michigan.
          </p>
        </div>

        <Link
          to="/projects"
          className="text-xs font-bold text-[#13A89E] hover:underline flex items-center gap-1"
        >
          <span>View all filterable projects</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Map + Sidebar Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm overflow-hidden">
        
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 rounded-2xl overflow-hidden h-[420px] sm:h-[480px] z-10 border border-slate-200 dark:border-slate-800 relative">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Selected Project Card Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between p-2 sm:p-4 space-y-4">
          {selectedProject ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <MapPin className="w-4 h-4 text-[#13A89E]" />
                <span>
                  {selectedProject.city}, {selectedProject.state}
                </span>
                <span>·</span>
                <span className="capitalize">{selectedProject.pillarId}</span>
              </div>

              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {selectedProject.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedProject.summary}
              </p>

              {/* Progress */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(selectedProject.raisedCents)}
                  </span>
                  <span className="text-slate-500">
                    Goal: {formatCurrency(selectedProject.goalCents)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#13A89E]"
                    style={{
                      width: `${Math.min(100, Math.round((selectedProject.raisedCents / selectedProject.goalCents) * 100))}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 text-right">
                  {selectedProject.donorsCount} neighbors contributed
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-2">
                <Link
                  to={`/projects/${selectedProject.slug}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 block transition-colors"
                >
                  Project Details & Milestones
                </Link>
                <Link
                  to={`/donate?project=${selectedProject.id}&pillar=${selectedProject.pillarId}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Fund This Project</span>
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Click a map pin to view details.</p>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            All project coordinates represent verified civic partnerships and community drop points.
          </div>
        </div>

      </div>
    </section>
  );
};
