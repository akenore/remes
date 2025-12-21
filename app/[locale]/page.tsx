import HomeView from "@/components/layout/HomeView";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { buildLocalizedMetadata } from '@/lib/seo';
import { getHomeSlides } from '@/lib/home-data';
// import MaintenanceMode from "@/components/layout/MaintenanceMode";

type PageParams = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'frontend.home.meta',
  });

  return buildLocalizedMetadata({
    locale,
    path: '/',
    title: t('title'),
    description: t('description'),
  });
}

export default async function Home() {
  const slides = await getHomeSlides();

  return (
    <>
      <HomeView initialSlides={slides} />
      {/* <MaintenanceMode /> */}
    </>
  );
}
