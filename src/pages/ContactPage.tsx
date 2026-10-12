import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { siteConfig } from '../config/siteConfig';

export const ContactPage: React.FC = () => {
  const { settings } = siteConfig;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with the Impact Community Action team for donor relations, volunteer coordination, or community partnership."
      />

      <section className="bg-[#0B2545] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Direct Communication
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              We're Here for You
            </h1>
            <p className="text-slate-200 text-sm sm:text-base">
              Reach out for donor support, institutional partnerships, or volunteer coordination.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
                Headquarters & Dispatch
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Our main office manages multi-county field deployment, cold storage logistics, and donor receipts.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <MapPin className="w-5 h-5 text-[#13A89E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white">Physical Address</strong>
                  <p className="text-slate-500 mt-0.5">
                    {settings.address.street}<br />
                    {settings.address.city}, {settings.address.state} {settings.address.zip}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <Phone className="w-5 h-5 text-[#13A89E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white">Phone Support</strong>
                  <p className="text-slate-500 mt-0.5">{settings.phone} (Mon-Fri 9am-5pm EST)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <Mail className="w-5 h-5 text-[#13A89E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white">Email Inquiries</strong>
                  <p className="text-slate-500 mt-0.5">{settings.email}</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold text-[#0B2545] dark:text-white block mb-1">
                Looking for Emergency Assistance?
              </span>
              If you or a neighbor are facing an immediate utility shutoff or court eviction, please visit our <a href="/get-help" className="text-[#13A89E] underline font-bold">Get Help Application</a> for priority review.
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                  Message Dispatched
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you for reaching out. A representative from our community relations team will respond within 1 business day.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#0B2545] text-white hover:bg-[#13A89E] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Send a Direct Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department Inquiry
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Donor Relations & Receipts">Donor Relations & Receipts</option>
                    <option value="Corporate Sponsorship & Matching">Corporate Sponsorship & Matching</option>
                    <option value="Volunteer Coordination">Volunteer Coordination</option>
                    <option value="Media & Press">Media & Press</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="How can we assist you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold bg-[#0B2545] hover:bg-[#13A89E] text-white flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </>
  );
};
