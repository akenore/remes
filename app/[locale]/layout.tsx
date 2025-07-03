import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/lib/toast-context";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Optimized Poppins with next/font/google
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

// Local custom fonts with next/font/local
const myanmarMN = localFont({
  src: [
    {
      path: '../../public/fonts/myanmar-mn.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/myanmar-mn.woff',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-myanmar',
  display: 'swap',
  fallback: ['MyanmarMN', 'Arial', 'sans-serif'],
});

const vensfolk = localFont({
  src: '../../public/fonts/vensfolk.woff',
  variable: '--font-vensfolk',
  weight: '400',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: "Résidence médicalisée Remes",
    template: "Résidence médicalisée Remes - %s",
  },
  description: "Un lieu de vie, de soin et de serenite Une résidence médicalisée haut de gamme en bord de mer, dédiée au confort, aux soins et à la sérénité.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await the params before destructuring
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${myanmarMN.variable} ${vensfolk.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
        <AuthProvider>
        <ToastProvider>
        {children}
        </ToastProvider>
        </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
