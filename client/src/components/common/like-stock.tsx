import { useSession } from "@/lib/auth-client";
import { NativeLikesCounter } from "../uitripled/native-likes-counter-shadcnui";
import { useRouter } from "next/navigation";
import { useToggleLikeStock } from "@/hooks/use-stock";
import { cn } from "@/lib/utils";

const LikeStock = ({
  stock,
  variant = "default",
  className,
}: {
  stock?: Stock;
  variant?: "default" | "outline" | "ghost" | "subtle" | undefined;
  className?: string;
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const toggleLike = useToggleLikeStock(stock?.id);

  const mappedUsers =
    stock?.likes?.map((like) => ({
      id: like.user.id,
      name: like.user.name || like.user.username,
      avatar: like.user.image,
    })) || [];

  const handleLike = () => {
    if (!session?.user) {
      return router.push("/auth/sign-in");
    }
    toggleLike.mutate(session.user as any); // cast safely for the hook params
  };
  return (
    <NativeLikesCounter
      count={stock?.totalLikes || 0}
      liked={stock?.isLiked || false}
      users={mappedUsers}
      onLike={handleLike}
      variant={variant}
      className={cn("h-9", className)}
    />
  );
};

export default LikeStock;
