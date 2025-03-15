import '@/styles/globals.css';
import '@/styles/codes.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import { Footer } from '@/components/footer';
import { MainHeader } from '@/components/main-header';
import { themeEffect } from '@/utils/theme-effect';

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  themeColor: 'transparent',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
      <head>
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Atom Feed"
          href="https://hajoeun.com/atom"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})();`,
          }}
        />
      </head>

      <body className="dark:text-gray-100 max-w-2xl m-auto">
        <main className="p-6 pt-3 md:pt-6 min-h-screen">
          <MainHeader />
          {children}
        </main>

        <Footer />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8316897973981102"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {process.env.GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID} />
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
