import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "./providers/QueryProvider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { LoaderProvider } from '../components/Loader/LoaderContext';
import RouteChangeListener from '../components/Loader/RouteChangeListener';
import LoaderOverlay from '../components/Loader/LoaderOverlay';
import { LanguageProvider } from '../contexts/LanguageContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zenly - Tabiat bilan sayohat",
  description: "Tabiat qo'ynida dam oling, yangi joylarni kashf eting, sarguzashtlarga to'la sayohat boshlang.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="w-full max-w-full overflow-x-hidden">
          <LanguageProvider>
            <QueryProvider>
              <LoaderProvider>
                <RouteChangeListener />
                <LoaderOverlay />
                <Toaster richColors position="top-center" />
                {children}
                <Analytics />
                <SpeedInsights />
              </LoaderProvider>
            </QueryProvider>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
