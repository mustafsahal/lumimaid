import React, { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { Phone, Mail, User, FileText, MapPin, CheckCircle, Star } from 'lucide-react';

// Metadata for the page
// Next.js will automatically set the document title and description from this object
export const metadata = {
  title: 'Contact LumiMaid',
  description: 'Get in touch with LumiMaid — request a quote, ask a question, or schedule a cleaning service in Minneapolis.',
};

/**
 * Contact form component
 * Handles submission state, validation, and spam prevention via honeypot and optional reCAPTCHA token
 */
const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    // Honeypot field used to deter bots
    const honeypot = formData.get('address');
    if (honeypot) {
      setError('Bot submission detected.');
      setIsSubmitting(false);
      return;
    }

    // Compose the payload for API route
    const payload: Record<string, any> = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      topic: formData.get('topic'),
      message: formData.get('message'),
    };
    const file = formData.get('file');
    if (file && (file as File).size) {
      payload.file = await (file as File).text();
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setIsSuccess(true);
        (event.currentTarget as HTMLFormElement).reset();
      } else {
        const data = await response.json();
        setError(data?.error || 'Something went wrong. Please try again later.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle size={20} />
          <p className="font-semibold">Thank you! Your message has been sent.</p>
        </div>
        <p className="mt-2 text-sm text-green-700">We'll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot field: should remain hidden to users */}
      <input type="text" name="address" className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label className="block text-sm font-medium" htmlFor="name">Name</label>
        <div className="relative mt-1">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-md border-gray-300 pl-10 pr-4 py-2 focus:ring-primary focus:border-primary"
            placeholder="Your full name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="email">Email</label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border-gray-300 pl-10 pr-4 py-2 focus:ring-primary focus:border-primary"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="phone">Phone</label>
        <div className="relative mt-1">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full rounded-md border-gray-300 pl-10 pr-4 py-2 focus:ring-primary focus:border-primary"
            placeholder="(555) 555-5555"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="topic">Topic</label>
        <select
          id="topic"
          name="topic"
          className="w-full mt-1 rounded-md border-gray-300 py-2 px-3 focus:ring-primary focus:border-primary"
        >
          <option value="General">General</option>
          <option value="Quote">Get a Quote</option>
          <option value="Hiring">Hiring</option>
          <option value="Partnership">Partnership</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full mt-1 rounded-md border-gray-300 py-2 px-3 focus:ring-primary focus:border-primary"
          placeholder="Tell us how we can help..."
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="file">Attach a file (optional)</label>
        <input
          id="file"
          name="file"
          type="file"
          className="mt-1 w-full rounded-md border-gray-300 py-2 px-3 focus:ring-primary focus:border-primary"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-primary px-4 py-2 text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary-light"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

/**
 * Contact information component
 * Displays phone, email, hours, and an embedded map
 */
const ContactInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Call or Text</h3>
        <p className="mt-1">
          <a href="tel:+16128887916" className="flex items-center gap-2 text-primary hover:underline">
            <Phone size={16} /> (612) 888-7916
          </a>
        </p>
        <p className="mt-1">
          <a href="sms:+16128887916" className="flex items-center gap-2 text-primary hover:underline">
            <Phone size={16} /> Text us
          </a>
        </p>
      </div>
      <div>
        <h3 className="text-xl font-semibold">Email</h3>
        <p className="mt-1">
          <a href="mailto:info@lumimaid.com" className="flex items-center gap-2 text-primary hover:underline">
            <Mail size={16} /> info@lumimaid.com
          </a>
        </p>
      </div>
      <div>
        <h3 className="text-xl font-semibold">Business Hours</h3>
        <p className="mt-1 text-sm">Monday–Saturday: 8 AM – 6 PM</p>
        <p className="text-sm">Sunday: Closed</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold">Serving Area</h3>
        <p className="mt-1 text-sm">Minneapolis, St. Paul & surrounding communities.</p>
      </div>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          title="LumiMaid location"
          loading="lazy"
          className="w-full h-64 border rounded-md"
          src="https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=Minneapolis+MN"
        ></iframe>
      </div>
    </div>
  );
};

/**
 * Trust section component
 * Highlights bonding/insurance and customer reviews
 */
const TrustSection: React.FC = () => (
  <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200 mt-12">
    <div className="flex items-center gap-3">
      <CheckCircle className="text-green-500" size={24} />
      <div>
        <p className="font-semibold">Bonded & Insured</p>
        <p className="text-sm text-gray-600">Your peace of mind is our priority.</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Star className="text-yellow-500" size={24} />
      <div>
        <p className="font-semibold">Top-rated by Customers</p>
        <p className="text-sm text-gray-600">Read reviews on Google & Yelp.</p>
      </div>
    </div>
  </div>
);

/**
 * FAQ section component
 * Uses native details/summary elements for accessibility
 */
const FAQSection: React.FC = () => (
  <section className="space-y-4 mt-12">
    <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
    <details className="p-4 border rounded-lg">
      <summary className="font-medium cursor-pointer">What is your cancellation policy?</summary>
      <p className="mt-2 text-base">We require 24 hours notice to cancel or reschedule without a fee.</p>
    </details>
    <details className="p-4 border rounded-lg">
      <summary className="font-medium cursor-pointer">How do I handle billing?</summary>
      <p className="mt-2 text-base">Payment is collected after each service via card on file.</p>
    </details>
    <details className="p-4 border rounded-lg">
      <summary className="font-medium cursor-pointer">What if I'm not satisfied?</summary>
      <p className="mt-2 text-base">We offer a satisfaction guarantee—if you're not happy, we'll make it right.</p>
    </details>
    <details className="p-4 border rounded-lg">
      <summary className="font-medium cursor-pointer">Do you serve my area?</summary>
      <p className="mt-2 text-base">We serve Minneapolis and surrounding communities. Contact us to see if we can help.</p>
    </details>
  </section>
);

/**
 * Main Contact Page component
 * Renders hero, contact form, info, trust section, FAQ, and structured data
 */
export default function ContactPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'LumiMaid',
    url: 'https://lumimaid.com/contact',
    telephone: '+16128887916',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Minneapolis',
      addressRegion: 'MN',
      addressCountry: 'US',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+16128887916',
        contactType: 'customer service',
        areaServed: ['Minneapolis', 'St. Paul'],
        availableLanguage: ['English'],
      },
    ],
  };

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Structured data for SEO */}
      <Script
        id="jsonld-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold">Contact LumiMaid</h1>
        <p className="mt-2 text-lg text-gray-600">Have questions or ready to book? We're here to help.</p>
      </header>
      {/* Call to action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
        <a href="tel:+16128887916" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-white font-medium hover:bg-primary-dark">
          Call Us
        </a>
        <a href="/quote" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-secondary text-white font-medium hover:bg-secondary-dark">
          Get a Quote
        </a>
      </div>
      {/* Grid: form and info */}
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <ContactForm />
        </div>
        <div>
          <ContactInfo />
        </div>
      </div>
      {/* Trust and FAQ sections */}
      <TrustSection />
      <FAQSection />
    </main>
  );
}
