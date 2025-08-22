'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 min-h-screen text-center space-y-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Sorry, the page you were looking for could not be found.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          Return Home
        </Link>
        <Link
          href="/contact"
          className="px-5 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-blue-600 transition"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
