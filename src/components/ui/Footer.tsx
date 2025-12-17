'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

export function Footer() {
  const { themeDefinition } = useTheme();
  const colors = themeDefinition.colors;

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
      }}
    >
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
            <p className="text-sm" style={{ color: colors.foregroundMuted }}>
              Turn AI research papers into profitable products and businesses.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: colors.foreground }}>
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: colors.foregroundMuted }}
                >
                  Feed
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: colors.foregroundMuted }}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/demo4"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: colors.foregroundMuted }}
                >
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: colors.foreground }}>
              Data Sources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://arxiv.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: colors.foregroundMuted }}
                >
                  arXiv.org
                </a>
              </li>
              <li>
                <a
                  href="https://www.semanticscholar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: colors.foregroundMuted }}
                >
                  Semantic Scholar
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: colors.foreground }}>
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: colors.foregroundMuted }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: colors.foregroundMuted }}
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 border-t"
          style={{ borderColor: colors.border }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm" style={{ color: colors.foregroundMuted }}>
              &copy; {new Date().getFullYear()} Arxiv-4U. All rights reserved.
            </p>
            <p className="text-sm" style={{ color: colors.foregroundMuted }}>
              Built by{' '}
              <a
                href="https://zentrex.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: colors.foregroundMuted }}
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
