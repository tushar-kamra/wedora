import { CtaAndFooterSection } from "@/components/features/marketing/cta-and-footer-section";
import { FeaturesBentoSection } from "@/components/features/marketing/features-bento-section";
import { HeroSection } from "@/components/features/marketing/hero-section";
import { HowItWorksSection } from "@/components/features/marketing/how-it-works-section";
import { ImpactSection } from "@/components/features/marketing/impact-section";
import { LandingHeader } from "@/components/features/marketing/landing-header";
import { ValuePropositionSection } from "@/components/features/marketing/value-proposition-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-surface text-on-surface">
      <LandingHeader />
      <main className="w-full min-h-[calc(100vh-20rem)] bg-surface pt-20">
        <div className="flex w-full flex-col">
          <HeroSection />
          <ValuePropositionSection />
          <FeaturesBentoSection />
          <HowItWorksSection />
          <ImpactSection />
          <CtaAndFooterSection />
        </div>
      </main>
    </div>
  );
}
