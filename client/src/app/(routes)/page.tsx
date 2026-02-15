import HeroSection from "@/components/landing/hero-section";
import Header from "../../components/landing/header";
import SectionSeparator from "@/components/common/section-separator";
import PopularLandingSection from "@/components/landing/popular-landing-section";
import TrendingLandingSection from "@/components/landing/trending-landing-section";
import WhyChooseUsSection from "@/components/landing/why-choose-us-section";
import LandingCTASection from "@/components/landing/landing-cta-section";
import Footer from "../../components/common/footer";
import FadeIn from "@/components/common/fade-in";

const HomePage = () => {
  return (
    <section>
      <Header />
      <FadeIn>
        <HeroSection />
      </FadeIn>
      <FadeIn>
        <SectionSeparator />
        <PopularLandingSection />
      </FadeIn>
      <FadeIn>
        <SectionSeparator />
        <TrendingLandingSection />
      </FadeIn>
      <FadeIn>
        <WhyChooseUsSection />
      </FadeIn>
      <FadeIn>
        <LandingCTASection />
      </FadeIn>
      <Footer />
    </section>
  );
};

export default HomePage;
