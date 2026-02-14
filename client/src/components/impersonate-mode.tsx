"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

const ImpersonateMode = () => {
  const { data: session } = authClient.useSession();

  return session?.session?.impersonatedBy ? (
    <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-2 text-sm flex items-center justify-between w-full relative top-0 left-0 z-50">
      <span className="font-bold ml-4">
        You are currently impersonating {session.user.name}
      </span>
      <Button
        variant="outline"
        size="sm"
        className="mr-4 bg-white hover:bg-amber-50 text-amber-700 border-amber-200"
        onClick={async () => {
          await authClient.admin.stopImpersonating();
          window.location.href = "http://localhost:3001";
        }}
      >
        Stop Impersonating
      </Button>
    </div>
  ) : (
    <></>
  );
};

export default ImpersonateMode;
