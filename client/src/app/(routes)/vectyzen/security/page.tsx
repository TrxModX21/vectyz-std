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
          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Connected accounts</CardTitle>
              <CardDescription>
                Manage the social media accounts connected to your profile for
                easy login.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="font-semibold text-sm">Google</span>
                </div>
                <span className="text-sm text-muted-foreground mx-auto text-left flex-1 pl-8 hidden sm:block">
                  Connected
                </span>
                <Button variant="outline" size="sm" className="shrink-0">
                  Disconnect
                </Button>
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
