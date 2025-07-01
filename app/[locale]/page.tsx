import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import HomeView from "@/components/layout/HomeView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('frontend.home.meta');
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Home() {
  return (
    <>
      <HomeView />
    </>
  );
}
