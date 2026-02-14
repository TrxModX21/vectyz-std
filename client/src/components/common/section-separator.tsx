import Image from "next/image";

const SectionSeparator = () => {
  return (
    <div className="h-2.5 max-w-[55%] rounded-full mx-auto mb-8 mt-36 relative">
      <Image
        src="/separator-color.png"
        alt="Hero Background"
        fill
        className="object-cover object-center z-0 rounded-full"
      />
    </div>
  );
};

export default SectionSeparator;
