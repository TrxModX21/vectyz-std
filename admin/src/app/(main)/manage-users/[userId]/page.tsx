"use client";

import { useGetUser } from "@/hooks/use-users";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconWallet,
  IconCreditCard,
  IconBuildingBank,
  IconArrowsExchange,
  IconCircleCheck,
  IconCircleX,
  IconLogin,
  IconBell,
  IconBan,
} from "@tabler/icons-react";

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.userId as string;
  const { data, isLoading } = useGetUser(userId);
  const user = data?.user;

  const handleImpersonate = async () => {
    try {
      const result = await authClient.admin.impersonateUser({
        userId,
      });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      if (result.data) {
        const token = result.data.session.token;
        const clientUrl = "http://localhost:3000"; // Assuming Client URL
        // Redirect to client app to set cookie
        window.open(
          `${clientUrl}/api/auth/impersonate?token=${token}&callbackUrl=${clientUrl}/vectyzen`,
          "_blank"
        );
        toast.success("Impersonation session started in new tab");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to impersonate user");
    }
  };

  if (isLoading) {
    return (
      <div className="px-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  // Calculate wallet stats (mock logic if multiple wallets, assuming first is main for now)
  const mainWallet = user.wallets?.[0];
  const balance = Number(mainWallet?.balance) || 0;
  const currency = mainWallet?.currency || "IDR";

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <section className="px-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          User Detail - {user.name}
        </h1>
        <Button variant="outline" size="sm" onClick={handleImpersonate}>
          <IconLogin className="mr-2 size-4" />
          Login as User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">
              Balance
            </CardTitle>
            <IconWallet className="size-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(balance, currency)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">
              Deposits
            </CardTitle>
            <IconCreditCard className="size-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(0, currency)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">
              Withdrawals
            </CardTitle>
            <IconBuildingBank className="size-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(0, currency)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">
              Transactions
            </CardTitle>
            <IconArrowsExchange className="size-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1">
          <IconCircleCheck className="mr-2 size-4" />
          Balance
        </Button>
        <Button className="bg-red-500 hover:bg-red-600 text-white flex-1">
          <IconCircleX className="mr-2 size-4" />
          Balance
        </Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1">
          <IconLogin className="mr-2 size-4" />
          Logins
        </Button>
        <Button variant="secondary" className="text-muted-foreground flex-1">
          <IconBell className="mr-2 size-4" />
          Notifications
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white flex-1">
          <IconBan className="mr-2 size-4" />
          Ban User
        </Button>
      </div>

      {/* User Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Information of {user.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={user.name?.split(" ")[0]} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} readOnly />
            </div>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="flex">
                <div className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-muted-foreground text-sm">
                  +
                </div>
                <Input
                  id="mobile"
                  className="rounded-l-none"
                  placeholder="No mobile number"
                  readOnly
                />
              </div>
            </div>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="No address provided" readOnly />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">Zip/Postal</Label>
              <Input id="zip" placeholder="" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Indonesia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email Verification</Label>
              <div
                className={`p-2 rounded-md font-medium text-center text-white ${
                  user.emailVerified ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                {user.emailVerified ? "Verified" : "Unverified"}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mobile Verification</Label>
              <div className="bg-emerald-500 p-2 rounded-md font-medium text-center text-white">
                Verified
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>2FA Verification</Label>
              <div className="bg-red-500 p-2 rounded-md font-medium text-center text-white">
                Disable
              </div>
            </div>
            <div className="space-y-2">
              <Label>KYC</Label>
              <div className="bg-emerald-500 p-2 rounded-md font-medium text-center text-white">
                Verified
              </div>
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
            Submit
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
