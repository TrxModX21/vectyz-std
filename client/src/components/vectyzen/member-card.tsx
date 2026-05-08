import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Check, MapPin, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import Image from "next/image";
import { TextHoverEffect } from "../ui/text-hover-effect";

const MemberCard = ({
  member,
  className,
}: {
  member: Vectyzen;
  className?: string;
}) => {
  let userLocation = "Not set";
  if (member.profile?.city && member.profile.countryName) {
    userLocation = `${member?.profile?.city}, ${member?.profile?.countryName}`;
  }

  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-md transition-shadow",
        className,
      )}
    >
      <div
        className="relative h-24 md:h-34 w-full overflow-hidden rounded-b-2xl"
        role="img"
        aria-label="Profile cover background"
      >
        {member?.banner ? (
          <Image
            src={member?.banner!}
            alt="Cover"
            width={1366}
            height={768}
            className="rounded-b-2xl h-full w-full object-cover"
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
            <div className="hidden md:block absolute h-28 z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              <TextHoverEffect text="Vectolio" />
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-black/10" />
        {member.isPremium && (
          <Badge className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 text-white border-none">
            Premium
          </Badge>
        )}
      </div>

      <CardHeader className="text-center -mt-12 relative z-10 pb-2">
        <div className="mx-auto inline-block p-1 bg-background rounded-full">
          <Avatar className="h-20 w-20 border-2 border-muted">
            <AvatarImage src={member.image} alt={member.name} />
            <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
              {member.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-2">
          <Link
            href={`/profile/${member.username}`}
            className="hover:underline"
          >
            <h3 className="font-bold text-lg leading-none">{member.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            @{member.username}
          </p>
        </div>
        {userLocation && (
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            <span>{userLocation}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-4">
        <div className="grid grid-cols-3 gap-2 text-center py-4 border-y border-border/50">
          <div>
            <span className="block font-bold text-lg">
              {member.totalUploadedStocks}
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Assets
            </span>
          </div>
          <div>
            <span className="block font-bold text-lg">
              {member.totalFollowers}
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Followers
            </span>
          </div>
          <div>
            <span className="block font-bold text-lg">
              {member.totalFollowing}
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Following
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant={false ? "outline" : "default"}
          className="w-full gap-2 rounded-full"
        >
          {false ? (
            <>
              <Check className="h-4 w-4" /> Following
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" /> Follow
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemberCard;
