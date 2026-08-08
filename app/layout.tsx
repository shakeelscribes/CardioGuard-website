import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { SlackWidget } from '@/components/ui/SlackWidget';

export const metadata: Metadata = {
  title: {
    default: "CardioGuard | AI-Powered Cardiovascular Risk Prediction",
    template: "%s | CardioGuard"
  },
  description: "Predict cardiovascular disease with 80.17% ROC-AUC accuracy. CardioGuard uses an advanced clinical-grade machine learning engine trained on 68,000+ patient records for precision preventative cardiology and heart health intelligence.",
  keywords: [
    "Cardiovascular disease prediction",
    "Heart health AI",
    "CVD risk assessment",
    "Clinical-grade AI",
    "Cardiology ML model",
    "Heart attack prevention",
    "Preventative cardiology",
    "Medical machine learning",
    "Heart disease risk calculator"
  ],
  authors: [{ name: "CardioGuard Team" }],
  creator: "CardioGuard",
  publisher: "CardioGuard Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "CardioGuard | AI-Powered Cardiovascular Risk Prediction",
    description: "Clinical-grade AI for preventative cardiology. Predict your heart disease risk instantly with our ML model.",
    url: "https://cardioguard-website.vercel.app",
    siteName: "CardioGuard",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CardioGuard | Cardiovascular Risk AI",
    description: "Predict cardiovascular disease with 80.17% ROC-AUC accuracy.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className="font-sans min-h-screen bg-background">
        <SmoothScroll />
        {children}
        <SlackWidget />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
