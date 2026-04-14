import { Flag, MoreVerticalIcon, Share2, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import ActionButton from "./action-button";
import LikeStock from "../common/like-stock";
import FollowButton from "../common/follow-button";
import AddToCollectionButton from "../common/add-to-collection-button";

const StockAction = ({ stock }: { stock?: Stock }) => {
  const user = stock?.user;

  return (
    <>
      <Card className="border-2 border-primary/10 shadow-lg">
        <CardContent className="p-6 pt-0 space-y-6">
          {/* Stock Action */}
          <div className="flex items-start">
            <div className="flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <MoreVerticalIcon className="w-5 h-5 text-zinc-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={-25}>
                  <DropdownMenuGroup className="p-4">
                    <DropdownMenuItem>
                      <Flag />
                      Report Content
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 />
                      Share
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <LikeStock stock={stock} variant="ghost" className="px-2" />

              <AddToCollectionButton stock={stock} />
            </div>
          </div>

          {/* License Info */}
          <div className="flex items-center gap-3 p-3 bg-green-500/10 text-green-700 rounded-lg text-sm font-medium">
            <ShieldCheck className="h-5 w-5" />
            <span>Standard License included</span>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={user?.image} />
              <AvatarFallback>{user?.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link
                href={`/profile/${user?.username}`}
                className="font-bold hover:underline truncate block"
              >
                {user?.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {user?.totalFollowers} followers • {user?._count.uploadedStocks}{" "}
                assets
              </p>
            </div>

            <FollowButton authorId={user?.id} />
          </div>

          {/* Actions */}
          <ActionButton stock={stock!} />
        </CardContent>
      </Card>
    </>
  );
};

export default StockAction;
