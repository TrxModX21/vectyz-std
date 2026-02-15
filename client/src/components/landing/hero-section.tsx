import Image from "next/image";
import CategoryCarousel from "./category-carousel";
import LandingSearchBar from "./search-bar";

const HeroSection = () => {
  return (
    <div className="relative container mx-auto px-4 lg:px-6 py-4 space-y-12">
      {/* Blue Hero Card */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-blue-600 min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
        {/* Background Image */}
        <Image
          src="/banner-landing.png"
          alt="Hero Background"
          fill
          className="object-cover object-center z-0"
          priority
        />

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl px-4 space-y-6 lg:space-y-8">
          <div className="space-y-2 lg:space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-md">
              Find Vector and Logo Inspiration{" "}
              <br className="hidden md:block" />
              for your Business
            </h1>
            <p className="text-white/90 text-sm md:text-lg font-medium max-w-2xl mx-auto drop-shadow-sm">
              The best free stock photos, royalty free images & PSD shared by
              creators.
            </p>
          </div>

          {/* Search Bar */}
          <LandingSearchBar />
        </div>
      </div>

      {/* Category Carousel */}
      <CategoryCarousel />
    </div>
  );
};

export default HeroSection;
