import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

const LandingCTASection = () => {
  return (
    <div className="relative flex flex-col gap-10 container mx-auto px-4 lg:px-6 py-4 space-y-12">
      <div className="relative w-full rounded-3xl overflow-hidden bg-blue-600 min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
        <Image
          src="/banner-landing.png"
          alt="Hero Background"
          fill
          className="object-cover object-center z-0"
          priority
        />

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl px-4 space-y-6 lg:space-y-8">
          <div className="space-y-2 lg:space-y-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-md">
              Sign up to download free weekly stock images
            </h1>
            <p className="text-white/90 text-sm md:text-lg font-medium max-w-3xl mx-auto drop-shadow-sm">
              Ready for a world of free vectors, photos and video from amazing
              artists all over the world? <br /> Sign up free today
            </p>

            <Button
              className="bg-v-green hover:bg-[#a6c91698] text-[#0a2082] font-bold"
              size="lg"
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </div>

      <div className="relative w-full rounded-3xl overflow-hidden bg-[#EAF6FF] flex flex-col lg:flex-row items-center justify-between p-8 md:p-12 lg:p-16 gap-8">
        <div className="flex flex-col items-start text-left space-y-4 md:space-y-6 w-full lg:w-1/2 z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-700 leading-tight">
            Join With Other Contributor <br className="hidden lg:block" />
            <span className="text-[#A6C916]">Maker Local Area</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base lg:text-lg max-w-xl">
            Behind each stock picture, there&apos;s an inventive brain. You can
            likewise make content and sell it on Vectyz
          </p>

          <Button
            className="bg-v-green hover:bg-[#93b313] text-white font-bold px-8 h-12 md:h-14 text-base md:text-lg rounded-md shadow-sm transition-all mt-2"
          >
            Sell Content
          </Button>
        </div>

        <div className="hidden lg:block relative w-1/2 h-[300px] lg:h-[400px]">
          <Image
            src="/landing-cta.png"
            alt="Contributors"
            fill
            className="object-contain object-center lg:object-right"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingCTASection;
