"use client";

import FadeIn from "@/components/common/fade-in";
import AccountSettingSkeleton from "@/components/vectyzen/me/acount-setting-skeleton";
import AvatarCard from "@/components/vectyzen/me/avatar-card";
import BannerCard from "@/components/vectyzen/me/banner-card";
import BioCard from "@/components/vectyzen/me/bio-card";
import NewsLetterSwitchCard from "@/components/vectyzen/me/newsletter-switch-card";
import { useAuth } from "@/hooks/use-auth";

const AccountSettingPage = () => {
  const { data: userProfileResponse, isLoading: sessionLoading } = useAuth();
  const user: User | undefined = userProfileResponse?.user;
  const profile: Profile | undefined = userProfileResponse?.user.profile;

  return (
    <FadeIn>
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile and preferences.
            </p>
          </div>
        </div>

        {sessionLoading ? (
          <AccountSettingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AvatarCard user={user} />

            <div className="md:col-span-2 space-y-8">
              <BannerCard user={user} />

              <BioCard user={user} profile={profile} />

              <NewsLetterSwitchCard user={user} />
            </div>
          </div>
        )}
      </section>
    </FadeIn>
  );
};

export default AccountSettingPage;
