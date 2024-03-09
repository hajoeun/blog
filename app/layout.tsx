import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import { themeEffect } from "./theme-effect";
import { Analytics } from "./analytics";
import { Header } from "./header";
import { Footer } from "./footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "하조은의 블로그",
  description: "하조은 | 당신 근처의 개발자",
  openGraph: {
    title: "하조은의 블로그",
    description: "하조은 | 당신 근처의 개발자",
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
      lang="en"
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
          <Header />
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
