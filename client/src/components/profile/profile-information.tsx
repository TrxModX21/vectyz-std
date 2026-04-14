import { CalendarDays, LinkIcon, MapPin, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import FollowButton from "../common/follow-button";
import { ShareDialog } from "../common/share-dialog";
import { Button } from "../ui/button";
import { extractDomain } from "@/lib/helpers";
import { format } from "date-fns";

const ProfileInformation = ({
  user,
  profile,
}: {
  user: Vectyzen;
  profile: Profile;
}) => {
  const dateRaw = user?.createdAt || Date.now();
  const dateObj = new Date(dateRaw);
  const joinedAt = format(dateObj, "dd MMMM yyyy");

  let userLocation = "Not set";
  if (profile?.city && profile.countryName) {
    userLocation = `${(profile?.city, profile?.countryName)}`;
  }

  return (
    <div className="w-full lg:w-80 shrink-0 space-y-6">
      <div className="relative inline-block">
        <Avatar className="h-40 w-40 border-4 border-background shadow-xl">
          <AvatarImage src={user?.image} />
          <AvatarFallback className="text-4xl">
            {user?.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        {user?.isPremium && (
          <Badge className="absolute bottom-4 right-0 bg-amber-500 hover:bg-amber-600 text-white border-2 border-background px-3 py-1 shadow-md">
            PRO
          </Badge>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-extrabold">{user?.name}</h1>
        <p className="text-lg text-muted-foreground mt-1">@{user?.username}</p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {/* Location */}
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" /> {userLocation}
        </div>

        {/* Websites */}
        <div className="flex items-center gap-1">
          <LinkIcon className="h-4 w-4" />
          <a
            href={profile?.websites || `${window.location.href}`}
            className="hover:text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {user?.name || extractDomain(profile?.websites)}
          </a>
        </div>

        <div className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" /> Joined {joinedAt}
        </div>
      </div>

      {profile?.bio && (
        <p className="text-foreground leading-relaxed">{profile.bio}</p>
      )}

      <div className="flex gap-3 pt-4 border-t">
        <FollowButton authorId={user?.id} variant="style-2" />

        <ShareDialog
          url={`${window.location.href}`}
          title={`Share ${user?.name} Profile`}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full shrink-0"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </ShareDialog>
      </div>
    </div>
  );
};

export default ProfileInformation;
