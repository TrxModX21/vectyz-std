import { motion } from "motion/react";
import { TextHoverEffect } from "../ui/text-hover-effect";
import { Badge } from "../ui/badge";

const ProfileBanner = ({ user }: { user: Vectyzen }) => {
  return (
    <div
      className="relative h-64 md:h-80 w-full overflow-hidden rounded-b-2xl"
      role="img"
      aria-label="Profile cover background"
    >
      {user?.banner ? (
        <img
          src={user.banner}
          alt="Cover"
          className="w-full h-full object-cover"
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
      <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />
    </div>
  );
};

export default ProfileBanner;
