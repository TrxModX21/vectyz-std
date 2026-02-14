import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type PropsType = {
  width?: number;
  height?: number;
  className?: string;
};

const VectyzLogo = ({ width = 160, height = 160, className }: PropsType) => {
  return (
    <Link
      className={cn("h-10 flex items-center justify-center", className)}
      href="/"
      rel="noopener noreferrer"
    >
      <Image
        src="/vectyz.svg"
        alt="Vercel logomark"
        width={width}
        height={height}
        className="h-full w-auto"
        loading="eager"
        priority
      />
    </Link>
  );
};

export default VectyzLogo;
