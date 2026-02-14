import HeroSection from "@/components/landing/hero-section";
import Header from "../../components/landing/header";
import SectionSeparator from "@/components/common/section-separator";
import PopularLandingSection from "@/components/landing/popular-landing-section";
import TrendingLandingSection from "@/components/landing/trending-landing-section";
import WhyChooseUsSection from "@/components/landing/why-choose-us-section";
import LandingCTASection from "@/components/landing/landing-cta-section";
import Footer from "../../components/common/footer";

const HomePage = () => {
  return (
    <section>
      <Header />
      <HeroSection />
      <SectionSeparator />
      <PopularLandingSection />
      <SectionSeparator />
      <TrendingLandingSection />
      <WhyChooseUsSection />
      <LandingCTASection />
      <Footer />
    </section>
  );
};

export default HomePage;
