import { motion } from "motion/react";
import { TextHoverEffect } from "../ui/text-hover-effect";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { blurDataURL } from "@/lib/helpers";

const ProfileBanner = ({
  preview,
  user,
}: {
  preview?: string | null;
  user?: Vectyzen | User;
}) => {
  return (
    <div
      className="relative h-64 md:h-80 w-full overflow-hidden rounded-b-2xl"
      role="img"
      aria-label="Profile cover background"
    >
      {preview || user?.banner ? (
        <Image
          src={preview! || user?.banner!}
          alt="Cover"
          width={1366}
          height={768}
          className="rounded-b-2xl h-full w-full object-cover"
          placeholder="blur"
          blurDataURL={blurDataURL}
        />
      ) : (
        <>
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
                "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
                "linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)",
                "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
              ],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="hidden md:block absolute h-48 z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <TextHoverEffect text="Vectolio" />
          </div>
        </>
      )}

      <div className="absolute inset-0 bg-black/10" />
      {user?.isPremium && (
        <Badge className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 text-white border-none">
          Premium
        </Badge>
      )}
      {!user?.banner && (
        <div className="absolute inset-0 bg-linear-to-t from-background/20 via-background/10 to-transparent" />
      )}
    </div>
  );
};

export default ProfileBanner;
