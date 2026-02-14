import VectyzLogo from "@/components/common/vectyz-logo";
import Image from "next/image";
import { ReactNode } from "react";

function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="w-full h-auto">
      <div className="w-full h-screen min-h-[600px] flex overflow-hidden bg-white">
        {/* Left Panel - Hidden on Mobile */}
        <div className="hidden md:flex relative w-[35%] flex-col bg-blue-50 overflow-hidden">
          {/* Wave Backgrounds */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Top light blue wave */}
            <div
              className="absolute top-0 left-0 w-full h-[40%] bg-[#e0f2fe] z-0"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 100%)" }}
            ></div>

            {/* Bottom dark blue waves - Approx Shape */}
            <div className="absolute bottom-0 left-0 w-full h-[60%] z-10">
              <Image
                src="/bg-auth.svg"
                alt="Auth Background"
                fill
                className="object-cover z-0"
              />
            </div>
          </div>

          {/* Logo - Centered in the open space */}
          <div className="relative z-20 mt-32">
            <VectyzLogo width={250} height={250} className="h-14" />
          </div>
        </div>
        
        {children}
      </div>
    </main>
  );
}

export default AppLayout;
