
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";


export default function ProfessionalServices() {
     return (
          <>
               <Hero3
                    title="Services aux professionnels B2B"
                    description="Séjour Adaptée / Services aux professionnels B2B"
               />
               <main className="py-40">
                    <div className="max-w-7xl mx-5 md:mx-auto">
                         <form action="" method="post">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div className="flex flex-col gap-2 mb-5">
                                        <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="name">
                                             Agence ou Organisation
                                        </label>
                                        <input type="text" id="name" name="name" className="border border-gray-200 bg-gray-100 p-2" placeholder="Nom de l'agence ou de l'organisation" />
                                   </div>
                                   <div className="flex flex-col gap-2 mb-5">
                                        <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="name">
                                             Nom de Responsable
                                        </label>
                                        <input type="text" id="name" name="name" className="border border-gray-200 bg-gray-100 p-2" placeholder="Nom de l'agence ou de l'organisation" />
                                   </div>
                                   <div className="flex flex-col gap-2 mb-5">
                                        <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="name">
                                             Téléphone
                                        </label>
                                        <input type="text" id="name" name="name" className="border border-gray-200 bg-gray-100 p-2" placeholder="Nom de l'agence ou de l'organisation" />
                                   </div>
                                   <div className="flex flex-col gap-2 mb-5">
                                        <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="name">
                                             Email
                                        </label>
                                        <input type="text" id="name" name="name" className="border border-gray-200 bg-gray-100 p-2" placeholder="Nom de l'agence ou de l'organisation" />
                                   </div>
                                   <div className="flex flex-col gap-2 mb-5">
                                        <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="name">
                                             Adresse
                                        </label>
                                        <input type="text" id="name" name="name" className="border border-gray-200 bg-gray-100 p-2" placeholder="Nom de l'agence ou de l'organisation" />
                                   </div>
                                   <div className="flex flex-col gap-2 mb-5">
                                        <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="name">
                                             Pays
                                        </label>
                                        <input type="text" id="name" name="name" className="border border-gray-200 bg-gray-100 p-2" placeholder="Nom de l'agence ou de l'organisation" />
                                   </div>
                              </div>
                              <div className="flex flex-col gap-2 mb-10">
                                   <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="name">
                                        Message
                                   </label>
                                   <textarea id="name" name="name" rows={6} className="border border-gray-200 bg-gray-100 p-2" placeholder="Nom de l'agence ou de l'organisation" />
                              </div>
                              <button type="submit" className="border-1 border-dark-blue bg-dark-blue text-white px-12 py-2.5 hover:bg-white hover:text-dark-blue transition-all duration-500 cursor-pointer">
                                   Envoyer
                              </button>
                         </form>
                    </div>
               </main>
               <Footer />
          </>
     );
}