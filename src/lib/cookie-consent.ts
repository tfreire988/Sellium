/**
 * Cookie consent storage — RGPD / LSSI-CE (Spain).
 *
 * We persist the user's granular choice with a version so that if the cookie
 * categories change later, we can re-ask. "Necesarias" is always true (strictly
 * necessary cookies are exempt from prior consent); the others default to false
 * (opt-in, never pre-ticked — required under RGPD).
 */
export const CONSENT_KEY = "sellium-cookie-consent";
export const CONSENT_VERSION = 1;
/** Fired on the window whenever the consent choice changes, so listeners
 *  (e.g. analytics) can react without a page reload. */
export const CONSENT_EVENT = "sellium-consent-changed";

export interface CookieConsent {
  version: number;
  necesarias: true;
  analiticas: boolean;
  marketing: boolean;
  fecha: string; // ISO timestamp of the decision
}

export function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;
    if (parsed.version !== CONSENT_VERSION) return null; // categories changed → re-ask
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(choice: { analiticas: boolean; marketing: boolean }) {
  const value: CookieConsent = {
    version: CONSENT_VERSION,
    necesarias: true,
    analiticas: choice.analiticas,
    marketing: choice.marketing,
    fecha: new Date().toISOString(),
  };
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event(CONSENT_EVENT));
  return value;
}
