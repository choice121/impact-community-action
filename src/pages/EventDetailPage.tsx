import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Video, ArrowLeft, CheckCircle2, Share2 } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { DEMO_EVENTS } from '../demo/demoData';
import { IKImage } from '../components/common/IKImage';
import { formatDate } from '../lib/format';

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const event = DEMO_EVENTS.find((e) => e.slug === slug || e.id === slug);

  const [registered, setRegistered] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!event) {
    return <Navigate to="/events" replace />;
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistered(true);
  };

  return (
    <>
      <SEO
        title={event.title}
        description={event.description}
        image={event.coverImage}
      />

      <article className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Events</span>
        </Link>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#13A89E] text-xs font-semibold">
            {event.isVirtual ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
            <span>{event.isVirtual ? 'Virtual Stream' : event.location}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B2545] dark:text-white leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1.5 font-bold text-[#13A89E]">
              <Calendar className="w-4 h-4" />
              {formatDate(event.eventDate)}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {event.registeredCount} community members registered
            </span>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
          <IKImage path={event.coverImage} alt={event.title} aspectRatio="16/9" priority={true} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
              Event Details & Schedule
            </h2>
            <p>{event.description}</p>
            <p>
              This event is open to all community members, donors, and families. Refreshments and materials are provided free of charge through our civic partnership fund.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              Reserve Your Free Seat
            </h3>

            {registered ? (
              <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-2xl text-center space-y-2 text-xs">
                <CheckCircle2 className="w-8 h-8 text-[#13A89E] mx-auto" />
                <p className="font-bold text-slate-900 dark:text-white">RSVP Confirmed!</p>
                <p className="text-slate-500">We emailed calendar reminders to {email}.</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold bg-[#0B2545] hover:bg-[#13A89E] text-white transition-colors"
                >
                  Confirm RSVP
                </button>
              </form>
            )}
          </div>
        </div>
      </article>
    </>
  );
};
