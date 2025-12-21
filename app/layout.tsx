import { ReactNode } from 'react';
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import localFont from "next/font/local";
import { headers } from 'next/headers';
import './globals.css';
import { GoogleTagManager } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const myanmarMN = localFont({
  src: [
    {
      path: '../public/fonts/myanmar-mn.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/myanmar-mn.woff',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-myanmar',
  display: 'swap',
  fallback: ['MyanmarMN', 'Arial', 'sans-serif'],
});

const vensfolk = localFont({
  src: '../public/fonts/vensfolk.woff',
  variable: '--font-vensfolk',
  weight: '400',
  display: 'block',
  fallback: ['Arial', 'sans-serif'],
  preload: true,
});

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || undefined;

  return (
    <html lang="en">
      <GoogleTagManager
        gtmId="GTM-NKG2GQHF"
        // gtmScriptUrl="https://sst.remes-tunisie.com/gtm.js"
        nonce={nonce}
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${myanmarMN.variable} ${vensfolk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}