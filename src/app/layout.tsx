import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ReaderModeProvider } from "@/contexts/ReaderModeContext";
import { ToastProvider } from "@/components/ui/Toast";
import { ReferralTracker } from "@/components/ReferralTracker";
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arxiv-4U - AI/ML Research Papers",
  description: "Discover, filter, and bookmark AI/ML research papers from arXiv",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ThemeProvider>
            <ReaderModeProvider>
              <ToastProvider>
                <ReferralTracker />
                {children}
                <SpeedInsights />
              </ToastProvider>
            </ReaderModeProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
