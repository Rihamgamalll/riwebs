import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock3,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import api from '../lib/api';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSubmitted(false);

    try {
      await api.post('/contact', {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      setSubmitted(true);
      setForm({
        name: '',
        email: '',
        message: '',
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError('We could not send your message right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blush-500">
          We are here to help
        </p>

        <h1 className="mb-3 font-serif text-4xl font-light text-nude-900 md:text-5xl">
          Contact Us
        </h1>

        <p className="mx-auto max-w-xl text-nude-500">
          Have a question about a product, your order, or your skincare routine?
          Send us a message and our team will get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Contact information */}
        <div className="space-y-4">
          <a
            href="tel:+201000000000"
            className="group flex items-start gap-3 rounded-2xl border border-nude-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-blush-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blush-100">
              <Phone className="h-5 w-5 text-blush-500" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-medium text-nude-900">Phone</p>
              <p className="mt-0.5 text-sm text-nude-500">
                +20 100 000 0000
              </p>
            </div>

            <ExternalLink className="mt-1 h-4 w-4 text-nude-300 transition-colors group-hover:text-blush-400" />
          </a>

          <a
            href="mailto:hello@RiWebs.com"
            className="group flex items-start gap-3 rounded-2xl border border-nude-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-sage-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-sage-100">
              <Mail className="h-5 w-5 text-sage-500" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-medium text-nude-900">Email</p>
              <p className="mt-0.5 break-all text-sm text-nude-500">
                hello@RiWebs.com
              </p>
            </div>

            <ExternalLink className="mt-1 h-4 w-4 text-nude-300 transition-colors group-hover:text-sage-400" />
          </a>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Cairo%2C%20Egypt"
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 rounded-2xl border border-nude-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-beige-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-beige-100">
              <MapPin className="h-5 w-5 text-beige-500" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-medium text-nude-900">Location</p>
              <p className="mt-0.5 text-sm text-nude-500">Cairo, Egypt</p>
            </div>

            <ExternalLink className="mt-1 h-4 w-4 text-nude-300 transition-colors group-hover:text-beige-500" />
          </a>

          <div className="rounded-2xl border border-blush-100 bg-blush-50/60 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-blush-500" />
              <p className="font-medium text-nude-900">Response Time</p>
            </div>

            <p className="text-sm leading-relaxed text-nude-500">
              We usually respond within 24 hours during business days.
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div className="md:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl border border-nude-200 bg-white p-6 shadow-soft md:p-8"
          >
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 block text-sm text-nude-600"
              >
                Your Name
              </label>

              <input
                id="contact-name"
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                required
                autoComplete="name"
                className="input-field"
                placeholder="Riham Gamal"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 block text-sm text-nude-600"
              >
                Email
              </label>

              <input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                required
                autoComplete="email"
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-1.5 block text-sm text-nude-600"
              >
                Message
              </label>

              <textarea
                id="contact-message"
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
                required
                rows={6}
                className="input-field resize-y"
                placeholder="How can we help you?"
              />
            </div>

            {submitted && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-sage-700"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>
                  Your message has been sent successfully. We will reply as soon
                  as possible.
                </p>
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-blush-200 bg-blush-50 px-4 py-3 text-sm text-blush-600"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-xs text-nude-400">
                Usually responds within 24 hours
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}