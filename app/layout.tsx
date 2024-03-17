import "@/src/styles/globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";

import { Footer } from "@/src/components/footer";
import { MainHeader } from "@/src/components/main-header";
import { themeEffect } from "@/src/utils/theme-effect";

import { Analytics } from "../src/components/analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "하조은의 블로그",
  description: "hajoeun.com",
  openGraph: {
    title: "하조은의 블로그",
    description: "hajoeun.com",
    url: "https://hajoeun.com",
    siteName: "하조은의 블로그",
  },
  twitter: {
    card: "summary_large_image",
    site: "@hajoeun_",
    creator: "@hajoeun_",
  },
  metadataBase: new URL("https://hajoeun.com"),
};

export const viewport = {
  themeColor: "transparent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${inter.className} antialiased`}
      suppressHydrationWarning={true}
    >
      <head>
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
        {process.env.GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID} />
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
