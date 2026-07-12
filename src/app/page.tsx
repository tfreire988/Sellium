import { LanguageProvider } from "@/lib/language-context";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { HowItWorks } from "@/components/HowItWorks";
import { DemoVideo } from "@/components/DemoVideo";
import { Pricing } from "@/components/Pricing";
import { Accountants } from "@/components/Accountants";
import { Trust } from "@/components/Trust";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <LanguageProvider>
      <GrainOverlay />
      <div className="relative bg-ink">
        <Nav />
        <Hero />
        <Problem />
        <HowItWorks />
        <DemoVideo />
        <Pricing />
        <Accountants />
        <Trust />
        <Faq />
        <FinalCta />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
