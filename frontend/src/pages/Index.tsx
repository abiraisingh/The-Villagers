import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { VillageFinderSection } from "@/components/home/VillageFinderSection";
import { CallToAction } from "@/components/home/CallToAction";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <VillageFinderSection />
      <CallToAction />
    </Layout>
  );
};

export default Index;
