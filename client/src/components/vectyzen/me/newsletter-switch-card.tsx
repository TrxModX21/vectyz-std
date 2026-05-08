import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useUpdateNewsletter } from "@/hooks/use-profile";

const NewsLetterSwitchCard = ({ user }: { user: User | undefined }) => {
  const { mutate } = useUpdateNewsletter();

  const handleToggle = (checked: boolean) => {
    mutate({ newsletter: checked });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Receive newsletters, promotions and news from Vectolio.
            </p>
          </div>
          <Switch 
            checked={user?.profile?.newsletter ?? false} 
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-primary" 
          />
        </div>
        <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
          Vectolio will process your data to send you information about our
          products and services, promotions, surveys, raffles, based on our
          legitimate interest, and updates from the creators you follow, if you
          have consented to this. You can opt out of our notifications with the
          slider.{" "}
          <span className="text-primary cursor-pointer hover:underline font-medium">
            More information
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default NewsLetterSwitchCard;
