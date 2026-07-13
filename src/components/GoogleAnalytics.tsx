"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { readConsent, CONSENT_EVENT } from "@/lib/cookie-consent";

/**
 * Google Analytics 4 — loaded ONLY after the visitor accepts analytics cookies
 * (RGPD: no analytics scripts or cookies before consent). It reacts live to the
 * cookie banner via the CONSENT_EVENT, so accepting loads GA without a reload;
 * a returning visitor who already consented gets it on mount.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-2Z8W61Z6X5";

export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(readConsent()?.analiticas === true);
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!enabled || !GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
