import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative container mx-auto px-4 lg:px-6 py-4 space-y-12">
      <div className="relative w-full rounded-3xl overflow-hidden bg-blue-600 min-h-[400px] lg:min-h-[400px] flex items-center justify-center">
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

          <div className="w-full max-w-2xl mx-auto">
            <div className="flex w-[70%] lg:w-full md:w-auto items-center justify-start md:justify-center gap-2 mt-4 text-sm text-white/80 pb-2 md:pb-0 mx-auto">
              <div className="flex overflow-x-auto md:overflow-visible no-scrollbar gap-2">
                <span className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full cursor-pointer transition-colors backdrop-blur-sm shrink-0">
                  Vectors
                </span>
                <span className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full cursor-pointer transition-colors backdrop-blur-sm shrink-0">
                  Background
                </span>
                <span className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full cursor-pointer transition-colors backdrop-blur-sm shrink-0">
                  Id Cards
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
