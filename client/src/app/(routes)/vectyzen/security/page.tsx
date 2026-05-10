import FadeIn from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const SecurityPage = () => {
  return (
    <FadeIn>
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Security Settings</h1>
            <p className="text-muted-foreground">
              Manage your account security.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Security */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and authentication methods.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Update your password through the button below. You will be
                      redirected to a new page.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit whitespace-nowrap"
                  >
                    Set new password
                  </Button>
                </div>

                <hr className="border-border" />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      Two-factor-authentication
                    </h4>
                    <p className="text-sm text-muted-foreground max-w-[500px]">
                      Enable two-factor authentication to add an extra layer of
                      security to your account. When you log in, we'll send a
                      6-digit code to your email.
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session & Devices */}
          <Card>
            <CardHeader>
              <CardTitle>Session & Devices</CardTitle>
              <CardDescription>
                Manage your active sessions and connected devices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                      <path d="M12 18h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Chrome on Windows (Current)
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Jakarta, Indonesia • Active now
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-start">
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 px-0"
              >
                Log out all other devices
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </FadeIn>
  );
};

export default SecurityPage;
