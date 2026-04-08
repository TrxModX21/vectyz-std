import { useSession } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useFollowStatus, useToggleFollow } from "@/hooks/use-follow";
import { useRouter } from "next/navigation";

const FollowButton = ({ authorId }: { authorId?: string }) => {
  const router = useRouter();

  const { data: session } = useSession();
  const { data: followData, isLoading: isLoadingFollow } =
    useFollowStatus(authorId);
  const toggleFollow = useToggleFollow(authorId);

  const isOwnProfile = session?.user?.id === authorId;
  const isFollowing = followData?.isFollowing || false;

  const handleFollowClick = () => {
    if (!session?.user) {
      return router.push("/auth/sign-in");
    }
    toggleFollow.mutate(isFollowing);
  };

  if (isOwnProfile) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "secondary"}
      size="sm"
      className={cn(
        "rounded-full h-8 transition-all min-w-[80px]",
        isFollowing && "border-primary/20",
        isFollowing &&
          !isLoadingFollow &&
          !toggleFollow.isPending &&
          "hover:bg-red-50 hover:text-red-600 hover:border-red-200",
      )}
      onClick={handleFollowClick}
      disabled={isLoadingFollow || toggleFollow.isPending}
    >
      {isLoadingFollow ? "..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;
