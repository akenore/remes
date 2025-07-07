interface CardProps {
     price: string;
     options: string | string[];
}

export default function PriceCard({ price, options }: CardProps) {
     return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-gradient-to-l from-dark-blue to-blue md:max-w-7xl mx-5 md:mx-auto px-10 py-20 mb-52 shadow-2xl">
               <div className="flex flex-col text-center md:text-left">
                    <h2 className="text-gold text-[2rem] font-myanmar mb-5">A partir de</h2>
                    <p className="text-white text-7xl lg:text-[6rem] font-myanmar">{price} €<span className="text-gold text-2xl lg:text-[2.6rem] font-poppins"> / Per</span></p>
               </div>
               <div className="flex flex-col">
                    <ul className="w-full space-y-2 text-white">
                         { (Array.isArray(options) ? options : [options]).map((option, idx) => (
                              <li className="flex items-start" key={idx}>
                                   <svg className="w-5 h-5 mt-1 me-2 text-gold shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                   </svg>
                                   <span className="flex-1 break-words min-w-0 text-[1rem] md:text-[1.3rem]">{option}</span>
                              </li>
                         )) }
                    </ul>
               </div>
          </div>
     );
}
