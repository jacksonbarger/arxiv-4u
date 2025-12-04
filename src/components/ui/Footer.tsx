'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="Arxiv-4U"
                width={120}
                height={35}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Turn AI research papers into profitable products and businesses.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm transition-colors hover:underline text-slate-500 dark:text-slate-400"
                >
                  Feed
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm transition-colors hover:underline text-slate-500 dark:text-slate-400"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/demo4"
                  className="text-sm transition-colors hover:underline text-slate-500 dark:text-slate-400"
                >
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">
              Data Sources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://arxiv.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:underline text-slate-500 dark:text-slate-400"
                >
                  arXiv.org
                </a>
              </li>
              <li>
                <a
                  href="https://www.semanticscholar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:underline text-slate-500 dark:text-slate-400"
                >
                  Semantic Scholar
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm transition-colors hover:underline text-slate-500 dark:text-slate-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm transition-colors hover:underline text-slate-500 dark:text-slate-400"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              &copy; {new Date().getFullYear()} Arxiv-4U. All rights reserved.
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Built by{' '}
              <a
                href="https://zentrex.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-slate-500 dark:text-slate-400"
              >
                Zentrex
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
