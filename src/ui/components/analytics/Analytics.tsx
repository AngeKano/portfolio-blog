// ui/components/analytics/Analytics.tsx
"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { env } from "../../../infrastructure/config/env";

// ID de mesure Google Analytics
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fonction pour envoyer les pageviews à Google Analytics
  //   const pageView = (url: string) => {
  //     if (typeof window !== 'undefined' && window.gtag) {
  //       window.gtag('config', GA_MEASUREMENT_ID as string, {
  //         page_path: url,
  //       });
  //     }
  //   };

  // Suivre les changements de page
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    // pageView(url);
  }, [pathname, searchParams]);

  // Si pas d'ID de mesure, ne pas charger le script
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
