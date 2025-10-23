import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/lib/toast-context";
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

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
type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
