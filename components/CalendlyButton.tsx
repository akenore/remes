"use client";

import Script from "next/script";
import { useLocale } from "next-intl";
import { useCallback } from "react";

export default function CalendlyButton() {
     const locale = useLocale();
     const calendlyUrl =
          locale === "fr"
               ? "https://calendly.com/remes-tunisie/reunion-fr"
               : "https://calendly.com/remes-tunisie/meeting-en";

     const label =
          locale === "fr" ? "Planifier un appel dès maintenant" : "Schedule a call now";

     const openCalendly = useCallback(() => {
          if (typeof window !== "undefined" && "Calendly" in window) {
               // @ts-ignore
               window.Calendly.initPopupWidget({ url: calendlyUrl });
          }
     }, [calendlyUrl]);

     return (
          <>
               <Script
                    src="https://assets.calendly.com/assets/external/widget.js"
                    strategy="afterInteractive"
               />
               <link
                    href="https://assets.calendly.com/assets/external/widget.css"
                    rel="stylesheet"
               />
               <button
                    onClick={openCalendly}
                    className="border-1 border-dark-blue text-dark-blue px-8 py-2.5 hover:bg-dark-blue hover:text-white transition-all duration-500 cursor-pointer"
               >
                    {label}
               </button>
          </>
     );
}
