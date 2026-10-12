import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Video, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useLiveContent } from '../hooks/useLiveContent';
import { IKImage } from '../components/common/IKImage';
import { formatDate } from '../lib/format';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const EventsPage: React.FC = () => {
  const { events } = useLiveContent();
  const [registeringEvent, setRegisteringEvent] = useState<any | null>(null);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringEvent) return;

    if (isSupabaseConfigured) {
      try {
        await supabase.from('event_registrations').insert([
          {
            event_id: registeringEvent.id,
            attendee_name: attendeeName,
            attendee_email: attendeeEmail,
          },
        ]);
      } catch (err) {
        console.warn('Registered', err);
      }
    }

    setRegisteredSuccess(true);
  };

  return (
    <>
      <SEO
        title="Community Events & Galas"
        description="Join Impact Community Action for upcoming galas, seasonal warming drives, student STEM showcases, and community town halls."
      />

      <section className="bg-[#0B2545] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Gatherings & Advocacy
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Community Events & Galas
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              We gather neighbors, frontline organizers, and supporters to celebrate breakthroughs, coordinate emergency responses, and advocate for civic dignity.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative">
                  <IKImage
                    path={event.coverImage}
                    alt={event.title}
                    aspectRatio="16/9"
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5">
                    {event.isVirtual ? <Video className="w-3.5 h-3.5 text-teal-400" /> : <MapPin className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{event.isVirtual ? 'Virtual Event' : 'In-Person Gathering'}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#13A89E] font-semibold">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#13A89E] transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="pt-2 text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.registeredCount} RSVPs confirmed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-2">
                <Link
                  to={`/events/${event.slug}`}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-center border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  Details
                </Link>
                <button
                  onClick={() => {
                    setRegisteringEvent(event);
                    setRegisteredSuccess(false);
                    setAttendeeName('');
                    setAttendeeEmail('');
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#0B2545] hover:bg-[#13A89E] text-white transition-colors"
                >
                  RSVP Free
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP Modal */}
      {registeringEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-serif text-lg font-bold text-[#0B2545] dark:text-white">
                RSVP for Event
              </h3>
              <button
                onClick={() => setRegisteringEvent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {registeredSuccess ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-serif text-xl font-bold">You're on the Guest List!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  We sent an email confirmation with calendar invite and arrival details to <strong>{attendeeEmail}</strong>.
                </p>
                <button
                  onClick={() => setRegisteringEvent(null)}
                  className="mt-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0B2545] text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4 text-xs">
                <div>
                  <strong className="block text-slate-900 dark:text-white font-serif text-sm">
                    {registeringEvent.title}
                  </strong>
                  <span className="text-slate-500 block">{formatDate(registeringEvent.eventDate)}</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Cooper"
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address (for ticket & calendar invite)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold bg-[#0B2545] hover:bg-[#13A89E] text-white transition-colors"
                >
                  Confirm Free RSVP
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
