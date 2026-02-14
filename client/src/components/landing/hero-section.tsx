import Image from "next/image";
import {
  Search,
  ChevronDown,
  PenTool,
  Image as ImageIcon,
  FileImage,
  Presentation,
  Box,
  Files,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
              Find Vector and Logo Inspiration <br className="hidden md:block" />
              for your Business
            </h1>
            <p className="text-white/90 text-sm md:text-lg font-medium max-w-2xl mx-auto drop-shadow-sm">
              The best free stock photos, royalty free images & PSD shared by
              creators.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-full p-2 flex items-center shadow-lg w-full">
              {/* Dropdown Trigger */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-10 md:h-12 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold flex items-center gap-2 mr-2 shrink-0"
                  >
                    Vectors
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-0" align="start">
                  <div className="grid gap-1 p-2">
                    <Button
                      variant="ghost"
                      className="justify-start font-medium"
                    >
                      Vectors
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-medium"
                    >
                      Photos
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-medium"
                    >
                      PSD
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Input Field */}
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search vectors..."
                  className="border-0 shadow-none focus-visible:ring-0 text-base h-10 md:h-12 placeholder:text-gray-400"
                />
              </div>

              {/* Search Icon */}
              <div className="pr-2">
                <Search className="text-gray-400 h-6 w-6" />
              </div>
            </div>

            {/* Popular Tags */}
            <div className="flex w-[70%] lg:w-full md:w-auto items-center justify-start md:justify-center gap-2 mt-4 text-sm text-white/80 pb-2 md:pb-0 mx-auto">
              <span className="font-medium shrink-0 sticky left-0 bg-black/40 px-3 py-0.5 rounded-full md:static md:bg-black/20 z-10">
                Popular:
              </span>

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
                <span className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full cursor-pointer transition-colors backdrop-blur-sm shrink-0">
                  Background
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Icons Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto px-4">
        {/* Vector Stock */}
        <div className="flex flex-col items-center gap-4 group cursor-pointer">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl text-gray-600 group-hover:text-blue-600 transition-colors">
            <PenTool className="w-10 h-10" strokeWidth={1.5} />
          </div>
          <span className="text-gray-600 text-sm text-center md:text-lg font-medium group-hover:text-blue-600 transition-colors">
            Vector Stock
          </span>
        </div>

        {/* Image Stock */}
        <div className="flex flex-col items-center gap-4 group cursor-pointer">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl text-gray-600 group-hover:text-blue-600 transition-colors">
            <ImageIcon className="w-10 h-10" strokeWidth={1.5} />
          </div>
          <span className="text-gray-600 text-sm text-center md:text-lg font-medium group-hover:text-blue-600 transition-colors">
            Image Stock
          </span>
        </div>

        {/* PSD Stock */}
        <div className="flex flex-col items-center gap-4 group cursor-pointer">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl text-gray-600 group-hover:text-blue-600 transition-colors">
            <FileImage className="w-10 h-10" strokeWidth={1.5} />
          </div>
          <span className="text-gray-600 text-sm text-center md:text-lg font-medium group-hover:text-blue-600 transition-colors">
            PSD Stock
          </span>
        </div>

        {/* PNGs Stock */}
        <div className="flex flex-col items-center gap-4 group cursor-pointer">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl text-gray-600 group-hover:text-blue-600 transition-colors">
            <Files className="w-10 h-10" strokeWidth={1.5} />
          </div>
          <span className="text-gray-600 text-sm text-center md:text-lg font-medium group-hover:text-blue-600 transition-colors">
            PNGs Stock
          </span>
        </div>

        {/* Mockup Stock */}
        <div className="flex flex-col items-center gap-4 group cursor-pointer">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl text-gray-600 group-hover:text-blue-600 transition-colors">
            <Box className="w-10 h-10" strokeWidth={1.5} />
          </div>
          <span className="text-gray-600 text-sm text-center md:text-lg font-medium group-hover:text-blue-600 transition-colors">
            Mockup Stock
          </span>
        </div>

        {/* Powerpoint */}
        <div className="flex flex-col items-center gap-4 group cursor-pointer">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl text-gray-600 group-hover:text-blue-600 transition-colors">
            <Presentation className="w-10 h-10" strokeWidth={1.5} />
          </div>
          <span className="text-gray-600 text-sm text-center md:text-lg font-medium group-hover:text-blue-600 transition-colors">
            Powerpoint
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
