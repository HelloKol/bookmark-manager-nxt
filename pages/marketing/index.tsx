import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header/index";
import FeatureSection from "@/components/FeatureSection";
import DemoSection from "@/components/DemoSection";
import PricingSection from "@/components/PricingSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 mx-auto">
        <HeroSection />
        <FeatureSection />
        <DemoSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
