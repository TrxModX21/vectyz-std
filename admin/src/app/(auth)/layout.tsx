import VectyzLogo from "@/app/(main)/_common/vectyz-logo";
import { GalleryVerticalEnd } from "lucide-react";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <section className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <VectyzLogo width={300} height={300} />
        </div>

        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
