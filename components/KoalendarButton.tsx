"use client";

import Script from "next/script";
import { useCallback, useEffect } from "react";
import { useLocale } from "next-intl";

type KoalendarArgs = [string, ...unknown[]];
type KoalendarFn = ((...args: KoalendarArgs) => void) & {
     props?: KoalendarArgs[];
};

declare global {
     interface Window {
          Koalendar?: KoalendarFn;
     }
}

const KOALENDAR_URL = "https://koalendar.com/e/reunion-de-30-minutes";
const DEFAULT_BUTTON_CLASS =
     "border border-dark-blue text-dark-blue px-8 py-2.5 hover:bg-dark-blue hover:text-white transition-all duration-500 cursor-pointer";

type KoalendarButtonProps = {
     className?: string;
     children?: React.ReactNode;
};

export default function KoalendarButton({ className, children }: KoalendarButtonProps = {}) {
     const locale = useLocale();

     useEffect(() => {
          if (typeof window === "undefined") {
               return;
          }

          if (!window.Koalendar) {
               const queuedCalls: KoalendarArgs[] = [];
               const queue = ((...args: KoalendarArgs) => {
                    queuedCalls.push(args);
               }) as KoalendarFn;
               queue.props = queuedCalls;
               window.Koalendar = queue;
          }
     }, []);

     const label =
          locale === "fr" ? "Planifier un appel découverte" : "Schedule a discovery call";

     const openKoalendar = useCallback(() => {
          if (typeof window !== "undefined" && typeof window.Koalendar === "function") {
               window.Koalendar("open", {
                    url: KOALENDAR_URL,
               });
          }
     }, []);

     return (
          <>
               <Script
                    src="https://koalendar.com/assets/widget.js"
                    strategy="afterInteractive"
               />
               <button onClick={openKoalendar} className={className ?? DEFAULT_BUTTON_CLASS}>
                    {children || label}
               </button>
          </>
     );
}
