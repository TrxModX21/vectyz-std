import { ExternalLink, ShieldCheck, Laptop, BadgeCheck } from "lucide-react";

const FEATURES = [
  {
    icon: ExternalLink,
    title: "Fresh content everyday",
    description:
      "Our library is updated on a daily basis so you can find the newest and trendiest photos and designs.",
  },
  {
    icon: ShieldCheck,
    title: "Guaranteed search results",
    description:
      "There's an image and style for every project, whatever your needs are.",
  },
  {
    icon: Laptop, // Or User, Laptop fits "Ready-to-use assets" comfortably
    title: "Ready-to-use assets",
    description:
      "Access thousands of images and designs ready-to-publish and get your project ready double quick.",
  },
  {
    icon: BadgeCheck,
    title: "High-quality stock content",
    description:
      "Download scroll-stopping images of the best quality to make your projects look professional.",
  },
];

const WhyChooseUsSection = () => {
  return (
    <div className="container mx-auto px-4 lg:px-32 py-12 lg:py-20">
      <div className="flex flex-col justify-center lg:grid lg:grid-cols-12 gap-12 lg:gap-8">
        {/* Left Content (Desktop) / Top Content (Mobile) */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700">
            Why <br />
            Choice Us?
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-md lg:max-w-xs leading-relaxed">
            Our library is updated on a daily basis so you can find the newest
            and trendiest photos and designs.
          </p>
        </div>

        {/* Right Content (Features List) */}
        <div className="lg:col-span-7 flex flex-col space-y-12 lg:space-y-0">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className={`
                    flex flex-col lg:flex-row items-center lg:items-start 
                    gap-4 lg:gap-6 
                    lg:border-b lg:border-gray-200 
                    lg:pb-8 lg:mb-8 last:lg:border-0 last:lg:pb-0 last:lg:mb-0
                `}
            >
              {/* Icon */}
              <div className="shrink-0 text-lime-500">
                <feature.icon
                  className="w-12 h-12 lg:w-10 lg:h-10"
                  strokeWidth={1.5}
                />
              </div>

              {/* Text Content */}
              <div className="text-center lg:text-left space-y-2 max-w-md lg:max-w-none">
                <h3 className="text-xl font-bold text-blue-700">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsSection;
