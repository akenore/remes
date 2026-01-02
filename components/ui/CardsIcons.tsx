import { FaClock, FaHandsHelping, FaSmile, FaUsersCog, FaUserCheck } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function Icons() {
     const t = useTranslations();
     return (
          <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
               <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-20 pb-40">
                         <div className="flex flex-col items-center text-white h-full space-y-4 text-center">
                              <FaHandsHelping size={72} className="text-[#EEDAB8]" />
                              <span className="text-4xl md:text-5xl font-semibold">+300</span>
                              <p className="text-sm md:text-base">
                                   {t('remesnumbers.1')}
                              </p>
                         </div>
                         <div className="flex flex-col items-center text-white h-full space-y-4 text-center">
                              <FaUsersCog size={72} className="text-[#EEDAB8]" />
                              <span className="text-4xl md:text-5xl font-semibold">+3</span>
                              <p className="text-sm md:text-base">{t('remesnumbers.2')}</p>
                         </div>
                         <div className="flex flex-col items-center text-white h-full space-y-4 text-center">
                              <FaSmile size={72} className="text-[#EEDAB8]" />
                              <span className="text-4xl md:text-5xl font-semibold">99%</span>
                              <p className="text-sm md:text-base">{t('remesnumbers.3')}</p>
                         </div>
                         <div className="flex flex-col items-center text-white h-full space-y-4 text-center">
                              <FaClock size={72} className="text-[#EEDAB8]" />
                              <span className="text-4xl md:text-5xl font-semibold">+5</span>
                              <p className="text-sm md:text-base">{t('remesnumbers.4')}</p>
                         </div>
                         {/* <div className="flex flex-col items-center text-white h-full space-y-4 text-center">
                              <FaUserCheck size={72} className="text-[#EEDAB8]" />
                              <span className="text-4xl md:text-5xl font-semibold">50%</span>
                              <p className="text-sm md:text-base">
                                   {t('remesnumbers.5')}
                              </p>
                         </div> */}
                    </div>
               </div>
          </div>
     );
}
