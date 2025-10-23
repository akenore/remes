import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import HomeView from "@/components/layout/HomeView";
// import MaintenanceMode from "@/components/layout/MaintenanceMode";

type PageParams = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'frontend.home.meta'
  });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Home() {
  return (
    <>
      <HomeView />
      {/* <MaintenanceMode /> */}
    </>
  );
}
