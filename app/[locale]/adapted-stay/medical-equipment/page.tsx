import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
import PageSection from "@/components/ui/PageSection";
import EquipmentTable from "@/components/ui/table/EquipmentTable";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.medicalEquipment.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function MedicalEquipment() {
     const t = useTranslations('frontend.medicalEquipment');

     return (
          <>
               <Hero3
                    title={t('hero.title')}
                    description={t('hero.description')}
               />
               <main className="pt-40">
                    <PageSection
                         title={t('content.title')}
                         paragraphs={[
                              t('content.paragraph1'),
                              t('content.paragraph2'),
                              t('content.paragraph3'),
                              t('content.paragraph4'),
                         ]}
                    />
                    <div className="max-w-7xl mx-5 md:mx-auto mb-20 md:mb-40">
                         <EquipmentTable />
                    </div>
                    <ContactForm />
               </main>
               <Footer />
          </>
     );
}